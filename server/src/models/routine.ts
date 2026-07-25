export interface Routine{
    id: number
    date: Date,
    exercises: exercise[]
}

export interface exercise{
    exercise_id:number,
    sets:set[]
    
}

interface set{
    order_no:number,
    reps:number,
    weight:number,
    completed:boolean
}