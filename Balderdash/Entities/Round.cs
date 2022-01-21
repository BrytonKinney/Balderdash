using Balderdash.DomainContext.PersistedEntities;

namespace Balderdash.Entities
{
    public class Round
    {
        public GameWord RoundWord { get; private set; }
        public bool IsStarted { get; private set; }

        public void Start()
        {
            IsStarted = true;
        }

        public void SetRoundWord(GameWord roundWord)
        {
            RoundWord = roundWord;
        }
    }
}
