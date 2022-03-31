using Balderdash.Entities;
using Balderdash.Models;
using Balderdash.Services;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;

namespace Balderdash.Hubs
{
    public class GameHub : Hub<IGameHub>
    {
        private readonly GameService _gameService;

        public GameHub(GameService gameService)
        {
            _gameService = gameService;
        }

        public async Task CreateNewGame(Player playerOne)
        {
            var newGame = _gameService.CreateNewGame(Context.ConnectionId, playerOne);
            await Groups.AddToGroupAsync(Context.ConnectionId, newGame.GameId);
            await Clients.Caller.GameCreated(new StartGameResponse()
            {
                GameId = newGame?.GameId,
                StartedSuccessfully = newGame != null
            });
        }

        public async Task SubmitVote(string gameId, string playerId, string definition)
        {
            var game = _gameService.PlayerSubmittedVote(gameId, playerId, definition);
            await Clients.Caller.PlayerSubmittedVote(game.GetPlayerById(playerId), definition);
            if (game.Players.Where(p => !p.IsHost).All(p => p.HasVoted))
            {
                await SendGroup(game.GameId).AllVotesSubmitted(game.PlayerSubmissions);
                var mostVotes = game.PlayerSubmissions.OrderByDescending(p => p.Votes);
                var firstPlace = mostVotes.First();
                if (mostVotes.Count(p => p.Votes == firstPlace.Votes) > 1)
                {
                    foreach (var player in mostVotes)
                    {
                        AddPlayerPoint(game, player.SubmittedById);
                    }
                }
                else
                {
                    AddPlayerPoint(game, firstPlace.SubmittedById);
                }
                await Clients.Group(game.GameId).PlayerListUpdated(game.Players);
                await Task.Delay(TimeSpan.FromSeconds(5));
                _gameService.StopRound(game.GameId);
                await Clients.Group(game.GameId).StopRound();
                await Clients.Group(game.GameId).PlayerListUpdated(game.Players);
            }
        }

        public async Task StartGame(string gameId)
        {
            var game = _gameService.StartGame(gameId);
            await SendRandomWordToHost(game.GameId);
            await SendGroup(gameId).GameStarted();
        }

        public async Task StartRound(string gameId)
        {
            var game = _gameService.StartRound(gameId);
            foreach(Player player in game.Players)
            {
                await SendPlayer(player.Id).RoundStarted(player);
            }
        }

        public async Task SubmitDefinition(string gameId, string definition)
        {
            await _gameService.SubmitDefinition(gameId, Context.ConnectionId, definition);            
        }

        public async Task SendRandomWordToHost(string gameId)
        {
            var randomWord = await _gameService.GetRandomWordAsync();
            var host = _gameService.GetGameHost(gameId);
            _gameService.GetGameById(gameId).SetCurrentWord(randomWord);
            if (host != null)
                await SendPlayer(host.Id).RandomWord(randomWord);
        }

        public async Task JoinGame(string gameId, Player player)
        {
            var joinedGame = _gameService.JoinGame(Context.ConnectionId, gameId, player);
            if (joinedGame == null)
            {
                await Clients.Caller.GameDoesNotExist();
                return;
            }
            await Groups.AddToGroupAsync(Context.ConnectionId, joinedGame.GameId);
            await Clients.Group(joinedGame.GameId).PlayerListUpdated(joinedGame.Players);
            await Clients.Caller.GameJoined(new GameJoinedResponse()
            {
                GameId = joinedGame.GameId,
                PlayerId = Context.ConnectionId,
                IsGameStarted = joinedGame.IsStarted,
                IsRoundStarted = joinedGame.CurrentRound?.IsStarted ?? false
            });
            if (joinedGame.CurrentRound?.IsStarted == true)
            {
                player.SetWord(joinedGame.CurrentWord.Word);
                await Clients.Caller.RoundStarted(player);
            }
        }

        public async Task AddPlayerPoint(Game game, string playerId)
        {
            var player = game.GetPlayerById(playerId);
            player.AddPoint();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            Game game = _gameService.HandleDisconnect(Context.ConnectionId);
            if (game == null)
                return;
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, game.GameId, CancellationToken.None);
            await SendGroup(game.GameId).PlayerListUpdated(game.Players);
            await base.OnDisconnectedAsync(exception);
        }

        private IGameHub SendPlayer(string id)
        {
            return Clients.Client(id);
        }

        private IGameHub SendGroup(string groupName)
        {
            return Clients.Group(groupName);
        }
    }
}
