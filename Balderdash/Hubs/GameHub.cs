using Balderdash.Entities;
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
        private static GameService _gameService = new GameService();

        public async Task StartGame(Player playerOne)
        {
            var newGame = _gameService.StartNewGame(playerOne);
            await Groups.AddToGroupAsync(Context.ConnectionId, newGame.GameId);
            await Clients.Caller.SendAsync("gameStarted", newGame, CancellationToken.None);
        }
    }
}
