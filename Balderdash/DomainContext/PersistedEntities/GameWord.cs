namespace Balderdash.DomainContext.PersistedEntities
{
    public class GameWord
    {
        public GameWord(string word, string definition)
        {
            Word = word;
            Definition = definition;
        }

        public string Word { get; private set; }
        public string Definition { get; private set; }
    }
}
