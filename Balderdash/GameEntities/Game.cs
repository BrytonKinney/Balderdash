using Balderdash.DomainContext.PersistedEntities;
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
            IsStarted = false;
        }

        public string GameId => _gameId;
        public IList<Player> Players { get; }
        public bool IsStarted { get; private set; }
        public GameWord CurrentWord { get; private set; }

        public void SetWord(GameWord word)
        {
            CurrentWord = word;
        }

        public void Start()
        {
            IsStarted = true;
        }

        public void Stop()
        {
            IsStarted = false;
        }
    }
}
