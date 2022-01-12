using Balderdash.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Balderdash.Models
{
    public class GameJoinedResponse
    {
        public string GameId { get; set; }
        public bool IsGameStarted { get; set; }
        public bool IsRoundStarted { get; set; }
        public string PlayerId { get; set; }
    }
}
