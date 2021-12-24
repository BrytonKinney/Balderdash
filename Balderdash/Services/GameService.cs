using Balderdash.Entities;
using Balderdash.Models;
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

        public StartGameResponse StartNewGame(Player playerOne)
        {
            var newGame = new Game();
            newGame.Players.Add(playerOne);
            return new StartGameResponse()
            {
                GameId = newGame.GameId,
                StartedSuccessfully = _currentGames.TryAdd(newGame.GameId, newGame)
            };
        }
    }
}
