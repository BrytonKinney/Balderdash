using Balderdash.DomainContext;
using Balderdash.DomainContext.PersistedEntities;
using Balderdash.Entities;
using Balderdash.Hubs;
using Balderdash.Models;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Balderdash.Services
{
    public class GameService
    {
        private static readonly ConcurrentDictionary<Guid, Game> _currentGames = new ConcurrentDictionary<Guid, Game>();
        private readonly WordRepository _wordRepository;
        private readonly IHubContext<GameHub, IGameHub> _gameHub;

        public GameService(IHubContext<GameHub, IGameHub> gameHub, WordRepository wordRepository)
        {
            _gameHub = gameHub;
            _wordRepository = wordRepository;
        }

        public Game CreateNewGame(string playerId, Player playerOne)
        {
            var newGame = new Game();
            playerOne.SetId(playerId);
            newGame.Players.Add(playerOne);
            if (_currentGames.TryAdd(Guid.Parse(newGame.GameId), newGame))
                return newGame;
            return null;
        }

        public Game StartGame(string gameId)
        {
            var currentGame = GetGameById(gameId);
            if (currentGame == null)
                return null;
            currentGame.Start();
            return currentGame;
        }

        public Game StartRound(string gameId)
        {
            var currentGame = GetGameById(gameId);
            if (currentGame == null)
                return null;
            currentGame.StartNewRound();
            return currentGame;
        }

        public async Task<GameWord> GetRandomWordAsync()
        {
            IEnumerable<GameWord> words = await _wordRepository.GetWords();
            int wordCount = words.Count();
            int randomIndex = new System.Random().Next(wordCount - 1);
            return words.ElementAt(randomIndex);
        }

        public Game JoinGame(string playerId, string gameId, Player player)
        {
            var currentGame = GetGameById(gameId);
            if (currentGame == null)
                return null;
            player.SetId(playerId);
            currentGame.Players.Add(player);
            return currentGame;
        }

        public Game HandleDisconnect(string playerId)
        {
            Game result = default;
            foreach(var gameKvp in _currentGames)
            {
                var playerMatch = gameKvp.Value.Players.SingleOrDefault(p => p.Id == playerId);
                if(playerMatch != null)
                {
                    gameKvp.Value.Players.Remove(playerMatch);
                    result = gameKvp.Value;
                }
                if (!gameKvp.Value.Players.Any())
                    _currentGames.TryRemove(gameKvp);
            }
            return result;
        }

        public Player GetGameHost(string gameId)
        {
            var currentGame = GetGameById(gameId);
            return currentGame.Host;
        }

        public Game GetGameById(string gameId)
        {
            if (!Guid.TryParse(gameId, out Guid gameGuid) || !_currentGames.TryGetValue(gameGuid, out Game currentGame))
                return null;
            return currentGame;
        }
    }
}
