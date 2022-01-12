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
        public Player Host => Players.SingleOrDefault(p => p.IsHost);
        public Round CurrentRound { get; private set; }

        public void StartNewRound()
        {
            if (!IsStarted)
                Start();
            CurrentRound = new Round();
            CurrentRound.SetRoundWord(CurrentWord);
            CurrentRound.Start();
            var nonHostPlayers = Players.Where(p => !p.IsHost);
            int randomPlayerIndex = new System.Random().Next(nonHostPlayers.Count() - 1);
            var assignedPlayer = nonHostPlayers.ElementAt(randomPlayerIndex);
            assignedPlayer.AssignRealDefinition(CurrentWord.Word, CurrentWord.Definition);
            foreach(var player in nonHostPlayers.Where(p => p.Id != assignedPlayer.Id))
            {
                player.SetWord(CurrentWord.Word);
            }
        }

        public void SetCurrentWord(GameWord word)
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
