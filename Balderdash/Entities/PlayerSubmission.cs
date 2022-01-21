using System.Threading;

namespace Balderdash.Entities
{
    public class PlayerSubmission
    {
        private int _votes;

        public PlayerSubmission(string playerId, string word, string definition)
        {
            SubmittedById = playerId;
            Word = word;
            Definition = definition;
            _votes = 0;
        }
        public string SubmittedById { get; private set; }
        public string Word { get; private set; }
        public string Definition { get; private set; }
        public int Votes => _votes;

        public void AddVote()
        {
            Interlocked.Increment(ref _votes);
        }
    }
}
