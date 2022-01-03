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
        private static readonly ConcurrentDictionary<Guid, Game> _currentGames = new ConcurrentDictionary<Guid, Game>();
        public StartGameResponse StartNewGame(Player playerOne)
        {
            var newGame = new Game();
            newGame.Players.Add(playerOne);
            return new StartGameResponse()
            {
                GameId = newGame.GameId,
                StartedSuccessfully = _currentGames.TryAdd(Guid.Parse(newGame.GameId), newGame)
            };
        }

        public void JoinGame(string gameId, Player player)
        {
            if (!Guid.TryParse(gameId, out Guid gameGuid))
                return;
            if (!_currentGames.TryGetValue(gameGuid, out Game currentGame))
                return;
            currentGame.Players.Add(player);
        }
    }
}
