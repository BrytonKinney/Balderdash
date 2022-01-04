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
            var newGame = _gameService.StartNewGame(playerOne);
            await Groups.AddToGroupAsync(Context.ConnectionId, newGame.GameId);
            await Clients.Caller.SendAsync("gameStarted", newGame, CancellationToken.None);
        }

        public async Task JoinGame(string gameId, Player player)
        {
            var joinedGame = _gameService.JoinGame(Context.ConnectionId, gameId, player);
            await Groups.AddToGroupAsync(Context.ConnectionId, joinedGame.GameId);
            await Clients.AllExcept(Context.ConnectionId).SendAsync("playerJoined", player, CancellationToken.None);
            await Clients.Caller.SendAsync("gameJoined", new GameJoinedResponse()
            {
                GameId = joinedGame.GameId,
                PlayerId = Context.ConnectionId,
                Players = joinedGame.Players
            }, CancellationToken.None);
        }
    }
}
