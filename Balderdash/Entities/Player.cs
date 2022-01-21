using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Balderdash.Entities
{
    public class Player
    {
        public Player(string id, string name, bool isHost)
        {
            Id = id;
            Name = name;
            IsHost = isHost;
        }

        public string Name { get; private set; }
        public string Id { get; private set; }
        public bool IsHost { get; }
        public string Word { get; private set; }
        public string Definition { get; private set; }
        public bool HasRealDefinition { get; private set; }
        public bool HasVoted { get; private set; }

        public void SetWord(string word)
        {
            Word = word;
        }

        public void AssignRealDefinition(string word, string definition)
        {
            HasRealDefinition = true;
            Word = word;
            Definition = definition;
        }

        public void ResetForNewRound()
        {
            HasRealDefinition = false;
            Word = string.Empty;
            Definition = string.Empty;
            HasVoted = false;
        }

        public void SetHasVoted(bool hasVoted)
        {
            HasVoted = hasVoted;
        }

        public void SetDefinition(string definition)
        {
            Definition = definition;
        }

        public void SetId(string id)
        {
            Id = id;
        }
    }
}
