const { pool } = require('../database/connection')

async function getExercises(req,res){
try{
const result = await pool.query(`
  select 
    e.id,
    e.name,
    coalesce(img.images, '[]') as images,
    coalesce(eq.equipment, '[]') as equipment,
    coalesce(mg.muscle_groups, '[]') as muscle_groups,
    coalesce(ins.instructions, '[]') as instructions
  from public."Exercises" e
  left join (
    select id, json_agg(
      json_build_object('path', path, 'order_number', order_number) 
      order by order_number
    ) as images
    from public."exercise_images"
    group by id
  ) img on img.id = e.id
  left join (
    select id, json_agg(json_build_object('equipment_name', equipment_name)) as equipment
    from public."Exercise_Equiptment"
    group by id
  ) eq on eq.id = e.id
  left join (
    select id, json_agg(
      json_build_object('muscle_name', muscle_name, 'is_primary', is_primary)
    ) as muscle_groups
    from public."exercise_muscle_group"
    group by id
  ) mg on mg.id = e.id
  left join (
    select exercise_id, json_agg(
      json_build_object('number', number, 'text', text) 
      order by number
    ) as instructions
    from public."exercise_instruction"
    group by exercise_id
  ) ins on ins.exercise_id = e.id
`);

res.json(result.rows)
}
catch(err){
    console.log(err)
    res.status(500).send("Database error")
}
}



module.exports = {getExercises}