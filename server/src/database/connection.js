const {Pool} = require('pg')

const pool = new Pool(
    {
        connectionString:process.env.SUPABASE_CONNECTION_STRING,
        ssl:{rejectUnauthorized:false}
    }
)

module.exports= {pool};
