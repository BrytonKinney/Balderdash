using Balderdash.Entities;
using Balderdash.Models;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Balderdash.Services
{
    public class GameService
    {
        private static ConcurrentDictionary<string, Game> _currentGames = new ConcurrentDictionary<string, Game>();
        private static ConcurrentDictionary<string, Game> _hosts = new ConcurrentDictionary<string, Game>();
        public StartGameResponse StartNewGame(Player playerOne, HubCallerContext context)
        {
            var newGame = new Game();
            newGame.Players.Add(playerOne);
            _hosts.TryAdd(context.ConnectionId, context);
            return new StartGameResponse()
            {
                GameId = newGame.GameId,
                StartedSuccessfully = _currentGames.TryAdd(newGame.GameId, newGame)
            };
        }

        public void HandleDisconnect(HubCallerContext context)
        {
            if(_hosts.TryGetValue(context.ConnectionId, out var game))
            {
                context.
            }
        }
    }
}
