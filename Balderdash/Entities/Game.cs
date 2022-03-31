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
            PlayerSubmissions = new List<PlayerSubmission>();
            _gameId = Guid.NewGuid().ToString();
            IsStarted = false;
        }

        public string GameId => _gameId;
        public IList<Player> Players { get; }
        public IList<PlayerSubmission> PlayerSubmissions { get; }
        public bool IsStarted { get; private set; }
        public GameWord CurrentWord { get; private set; }
        public Player Host => Players.SingleOrDefault(p => p.IsHost);
        public Round CurrentRound { get; private set; }

        public void StartNewRound()
        {
            if (!IsStarted)
                Start();
            var nonHostPlayers = Players.Where(p => !p.IsHost).ToList();
            if (!nonHostPlayers.Any())
                return;
            CurrentRound = new Round();
            CurrentRound.SetRoundWord(CurrentWord);
            CurrentRound.Start();
            foreach (Player player in nonHostPlayers)
            {
                player.ResetForNewRound();
            }
            int randomPlayerIndex = new System.Random().Next(nonHostPlayers.Count() - 1);
            var assignedPlayer = nonHostPlayers.ElementAt(randomPlayerIndex);
            assignedPlayer.AssignRealDefinition(CurrentWord.Word, CurrentWord.Definition);
            PlayerSubmissions.Add(new PlayerSubmission(assignedPlayer.Id, CurrentWord.Word, CurrentWord.Definition));
            foreach (var player in nonHostPlayers.Where(p => p.Id != assignedPlayer.Id))
            {
                player.SetWord(CurrentWord.Word);
            }
        }

        public void AddPlayer(string playerId, Player player)
        {
            player.SetId(playerId);
            Players.Add(player);
        }

        public bool AddPlayerSubmission(string playerId, string definition)
        {
            PlayerSubmissions.Add(new PlayerSubmission(playerId, CurrentWord.Word, definition));
            GetPlayerById(playerId).SetDefinition(definition);
            return true;
        }

        public void AddVoteToSubmission(string definition)
        {
            PlayerSubmissions.FirstOrDefault(ps => string.Compare(ps.Definition.Trim(), definition.Trim(), StringComparison.OrdinalIgnoreCase) == 0)?.AddVote();
        }

        public void SetCurrentWord(GameWord word)
        {
            CurrentWord = word;
        }

        public void Start()
        {
            IsStarted = true;
        }

        public Player GetPlayerById(string playerId)
        {
            return Players.FirstOrDefault(p => p.Id == playerId);
        }

        public void Stop()
        {
            IsStarted = false;
        }
    }
}
