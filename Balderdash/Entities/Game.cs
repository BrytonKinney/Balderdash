using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Balderdash.Entities
{
    public class Game
    {
        private string _gameId;
        
        public Game()
        {
            Players = new List<Player>();
            _gameId = Guid.NewGuid().ToString();
        }

        public string GameId => _gameId;
        public IList<Player> Players { get; }
    }
}
