const { pool } = require('../database/connection')
import { Request, Response } from 'express';
import { Routine } from "../models/routine"
import { AuthenticatedGetRequest,  AuthenticatedPostRequest} from '../models/Auth';

// Define custom interface


async function getAllRoutines(req:AuthenticatedGetRequest, res:Response) {
  try {
// 1. Guard against missing authentication/user object
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
const query = `
  SELECT 
    r.id ,
    r.created_at as date,
    -- Group all distinct exercises inside this routine
    coalesce(
      json_agg(
        json_build_object(
          'exercise_id', rs.exercise_id,
          -- Aggregate all sets belonging to this specific routine + exercise combo
          'sets', rs.sets_list
        )
      ) FILTER (WHERE rs.exercise_id IS NOT NULL),
      '[]'
    ) AS exercises
  FROM public."routines" r
  LEFT JOIN (
    -- Subquery: Pre-aggregate sets per routine and exercise to avoid duplication
    SELECT 
      routine_id,
      exercise_id,
      json_agg(
        json_build_object(
          'order_no', order_no,
          'reps', reps,
          'weight', weight,
          'completed', completed
        ) ORDER BY order_no -- Keeps your sets in the correct workout order!
      ) AS sets_list
    FROM public.routine_sets
    GROUP BY routine_id, exercise_id
  ) rs ON r.id = rs.routine_id
  WHERE r.user_id = $1
  GROUP BY r.id;
`;

const result = await pool.query(query, [userId]);
    // Send the query rows back to the client
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching routines:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function addRoutine(req: AuthenticatedPostRequest, res: Response){
  const routine: Routine = req.body as Routine;
  const user = req.user.id;

    // 1. Checkout a dedicated client connection for the transaction
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // 2. Insert into `public.routine` and retrieve the newly generated ID
      const routineResult = await client.query(
        `INSERT INTO public.routines (user_id) VALUES ($1) RETURNING id`, // adjust 'id' if column name is routine_id
        [user]
      );
      const newRoutineId = routineResult.rows[0].id;

      // 3. Insert into `routine_exercises` safely
      for (const exercise of routine.exercises) {
        await client.query(
          `INSERT INTO routine_exercises (routine_id, exercise_id) VALUES ($1, $2)`,
          [newRoutineId, exercise.exercise_id]
        );

        // 4. Insert into `routine_sets` safely
        for (const set of exercise.sets) {
          await client.query(
            `INSERT INTO routine_sets (routine_id, exercise_id, order_no, reps, weight, completed) 
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              newRoutineId,
              exercise.exercise_id,
              set.order_no,
              set.reps,
              set.weight,
              set.completed,
            ]
          );
        }
      }

      await client.query('COMMIT');
      return res.status(201).json({ message: 'Routine created', routine_id: newRoutineId });

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error creating routine:', error);
      return res.status(500).json({ error: 'Failed to create routine' });

    } finally {
      // Always release the connection back to the pool
      client.release();
    }


  // Handle existing routine update logic here...
  return res.status(200).json({ message: 'received req' });
}
async function updateRoutine(req: AuthenticatedPostRequest, res: Response) {
  const routine: Routine = req.body as Routine;
  const user = req.user.id;
  const routine_id = routine.id

    // 1. Checkout a dedicated client connection for the transaction
    const client = await pool.connect();

    try {

      const result = await client.query('Select * from public.routines where id= $1 limit 1',[routine_id])
      if (result.rows[0].user_id != user) res.status(403).json({'error':"You dont have permision to update this routine"})

      await client.query('BEGIN');

      // 3. Insert into `routine_exercises` safely

       // delete all the old exercises from db them save the new ones (prevent need to check what changed)
      await client.query(
        `Delete from public.routine _exercises where routine_id = $1`,
        [routine_id]
      );
      await client.query(
          `Delete from public.routine_sets  where routine_id = $1`,
          [routine_id]
        );

      for (const exercise of routine.exercises) {

        await client.query(
          `INSERT INTO public.routine_exercises (routine_id, exercise_id) values ($1, $2)`,
          [routine_id, exercise.exercise_id]
        );
        
        
        // 4. Insert into `routine_sets` safely
        for (const set of exercise.sets) {
          await client.query(
            `INSERT INTO routine_sets (routine_id, exercise_id, order_no, reps, weight, completed) 
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
             routine_id,
              exercise.exercise_id,
              set.order_no,
              set.reps,
              set.weight,
              set.completed,
            ]
          );
        }
      }

      await client.query('COMMIT');
      return res.status(201).json({ message: 'Routine created', routine_id: routine_id });

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error creating routine:', error);
      return res.status(500).json({ error: 'Failed to update routine' });

    } finally {
      // Always release the connection back to the pool
      client.release();
    }

  // Handle existing routine update logic here...
  return res.status(200).json({ message: 'received req' });
}

async function deleteRoutine(req: AuthenticatedPostRequest, res: Response){
  const routine_id = req.body.routine_id
  try{
    // because the routine_id is used as a foreign key in tables holding information about routines so you only need to delete row in public.routines
    await pool.query(`DELETE FROM public.routines where id = $1`,[routine_id])
    res.status(200).json({message:"Routine Deleted"})
  }
  catch(e){
    console.log(e)
    res.status(500).json({error:"failed to delete routine"})
  }
}
module.exports={getAllRoutines, addRoutine,updateRoutine,deleteRoutine}