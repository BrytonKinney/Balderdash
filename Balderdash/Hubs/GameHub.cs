using Balderdash.Entities;
using Balderdash.Models;
using Balderdash.Services;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Balderdash.Hubs
{
    public class GameHub : Hub<IGameHub>
    {
        private GameService _gameService;

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

        public async Task StartGame(string gameId)
        {
            var game = _gameService.StartGame(gameId);
            await SendRandomWordToHost(game.GameId);
            await Clients.Group(gameId).GameStarted();
        }

        public async Task StartRound(string gameId)
        {
            var game = _gameService.StartRound(gameId);
            foreach(Player player in game.Players)
            {
                await Clients.Client(player.Id).RoundStarted(player);
            }
        }
        public async Task SendRandomWordToHost(string gameId)
        {
            var randomWord = await _gameService.GetRandomWordAsync();
            var host = _gameService.GetGameHost(gameId);
            _gameService.GetGameById(gameId).SetCurrentWord(randomWord);
            if (host != null)
                await Clients.Client(host.Id).RandomWord(randomWord);
        }

        public async Task JoinGame(string gameId, Player player)
        {
            var joinedGame = _gameService.JoinGame(Context.ConnectionId, gameId, player);
            await Groups.AddToGroupAsync(Context.ConnectionId, joinedGame.GameId);
            await Clients.Group(joinedGame.GameId).PlayerListUpdated(joinedGame.Players);
            await Clients.Caller.GameJoined(new GameJoinedResponse()
            {
                GameId = joinedGame.GameId,
                PlayerId = Context.ConnectionId,
                IsGameStarted = joinedGame.IsStarted,
                IsRoundStarted = joinedGame.CurrentRound?.IsStarted ?? false
            });
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            Game game = _gameService.HandleDisconnect(Context.ConnectionId);
            if (game == null)
                return;
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, game.GameId, CancellationToken.None);
            await Clients.Group(game.GameId).PlayerListUpdated(game.Players);
            await base.OnDisconnectedAsync(exception);
        }
    }
}
