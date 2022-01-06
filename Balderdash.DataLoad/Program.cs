using Microsoft.Data.Sqlite;
using System;
using System.Collections.Generic;
using System.IO;

namespace Balderdash.DataLoad
{
    class Program
    {
        static void Main(string[] args)
        {
            using (var fs = new FileStream("obscure_dict.json", FileMode.Open))
            {
                using (var sr = new StreamReader(fs))
                {
                    var dict = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(sr.ReadToEnd());
                    using (var conn = new SqliteConnection("Data Source=words.db"))
                    {
                        conn.Open();
                        foreach (var entry in dict)
                        {
                            using (var cmd = new SqliteCommand("INSERT INTO Words(Word, Definition) VALUES(@word, @def)", conn))
                            {
                                cmd.Parameters.AddWithValue("@word", entry.Key);
                                cmd.Parameters.AddWithValue("@def", entry.Value);
                                cmd.ExecuteNonQuery();
                            }
                        }
                    }
                }
            }
        }
    }
}
