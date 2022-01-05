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
    public class GameHub : Hub
    {
        private GameService _gameService;

        public GameHub(GameService gameService)
        {
            _gameService = gameService;
        }

        public async Task StartGame(Player playerOne)
        {
            var newGame = _gameService.StartNewGame(Context.ConnectionId, playerOne);
            await Groups.AddToGroupAsync(Context.ConnectionId, newGame.GameId);
            await Clients.Caller.SendAsync("gameStarted", new StartGameResponse()
            {
                GameId = newGame?.GameId,
                StartedSuccessfully = newGame != null
            }, CancellationToken.None);
        }

        public async Task JoinGame(string gameId, Player player)
        {
            var joinedGame = _gameService.JoinGame(Context.ConnectionId, gameId, player);
            await Groups.AddToGroupAsync(Context.ConnectionId, joinedGame.GameId);
            await Clients.Group(joinedGame.GameId).SendAsync("playerListUpdated", joinedGame.Players, CancellationToken.None);
            await Clients.Caller.SendAsync("gameJoined", new GameJoinedResponse()
            {
                GameId = joinedGame.GameId,
                PlayerId = Context.ConnectionId
            }, CancellationToken.None);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            Game game = _gameService.HandleDisconnect(Context.ConnectionId);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, game.GameId, CancellationToken.None);
            await Clients.Group(game.GameId).SendAsync("playerListUpdated", game.Players, CancellationToken.None);
            await base.OnDisconnectedAsync(exception);
        }
    }
}
