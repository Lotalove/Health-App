const { pool } = require('../database/connection')


function createNewRoutine(user,routineInfo){

}

async function getAllRoutines(req, res) {
  try {

    const user  = req.user;

    // Use parameterized query ($1) to safely handle input and prevent SQL injection
    const result = await pool.query(
      `SELECT * FROM public."routines" WHERE user_id = $1`,
      [user.id]
    );

    // Send the query rows back to the client
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching routines:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}


function updateRoutine(req,res){

}

module.exports={getAllRoutines}