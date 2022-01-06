using Balderdash.DomainContext.PersistedEntities;
using Microsoft.Data.Sqlite;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Balderdash.DomainContext
{
    public class WordRepository
    {
        private const string CONNECTION_STRING = @"Data Source=data\words.db";
        
        public async Task<IEnumerable<GameWord>> GetWords()
        {
            using (var connection = new SqliteConnection(CONNECTION_STRING))
            {
                await connection.OpenAsync();
                using(var command = connection.CreateCommand())
                {
                    command.CommandText = "SELECT * FROM Words";
                    using(var reader = await command.ExecuteReaderAsync())
                    {
                        var words = new List<GameWord>();
                        while (reader.Read())
                        {
                            words.Add(new GameWord(reader.GetString(0), reader.GetString(1)));
                        }
                        return words;
                    }
                }
            }
        }
    }
}
