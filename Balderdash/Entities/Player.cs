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

        public void SetId(string id)
        {
            Id = id;
        }
    }
}
