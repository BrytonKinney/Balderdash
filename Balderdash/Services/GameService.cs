﻿using Balderdash.Entities;
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

        public Game StartNewGame(string playerId, Player playerOne)
        {
            var newGame = new Game();
            playerOne.SetId(playerId);
            newGame.Players.Add(playerOne);
            if (_currentGames.TryAdd(Guid.Parse(newGame.GameId), newGame))
                return newGame;
            return null;
        }

        public Game JoinGame(string playerId, string gameId, Player player)
        {
            if (!Guid.TryParse(gameId, out Guid gameGuid) || !_currentGames.TryGetValue(gameGuid, out Game currentGame))
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
    }
}
