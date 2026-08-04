const {Pool} = require('pg')

const pool: typeof Pool = new Pool(
    {
        connectionString:process.env.SUPABASE_CONNECTION_STRING,
        ssl:{rejectUnauthorized:false}
    }
)

module.exports= {pool};
