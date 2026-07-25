const { pool } = require('../database/connection')
import { Request, Response } from 'express';
import { Routine } from "../models/routine"
import { AuthenticatedRequest } from '../models/Auth';

// Define custom interface


async function getAllRoutines(req:AuthenticatedRequest, res:Response) {
  try {
// 1. Guard against missing authentication/user object
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
const query = `
  SELECT 
    r.id AS routine_id,
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


function updateRoutine(req:Request,res:Response){
const routine: Routine = req.body as Routine
const isNew = routine.id  === undefined
console.log(routine)
res.status(200).json({message:"received req"})
}

module.exports={getAllRoutines,updateRoutine}