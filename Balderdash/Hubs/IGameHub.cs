using Balderdash.DomainContext.PersistedEntities;
using Balderdash.Entities;
using Balderdash.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Balderdash.Hubs
{
    public interface IGameHub
    {
        Task GameCreated(StartGameResponse response);
        Task GameStarted();
        Task GameJoined(GameJoinedResponse response);
        Task RandomWord(GameWord randomWord);
        Task PlayerListUpdated(IList<Player> players);
        Task RoundStarted(Player player);
        Task AllDefinitionsSubmitted(IList<Player> players);
        Task DefinitionAlreadyUsed();
        Task PlayerSubmittedVote(Player player, string definition);
        Task AllVotesSubmitted(IList<PlayerSubmission> submissions);
        Task GameDoesNotExist();
        Task StopRound();
        Task PlayerKicked();
    }
}
