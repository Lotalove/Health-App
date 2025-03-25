import {search,searchByID} from '../utils/json-search'
import { getExerciseImage } from '../utils/getImages'
import styles from '../styles/dashboard.module.css'

export function WorkoutViewer({routine}){
    var workout = routine.exercises.map(searchByID)

    return(
        <div className={styles.workout_viewer}>
             <b> Date: {" " + routine.date} </b>
            {workout.map((exercise,index)=>{
                return <div>
                  
                    <p>{index +1 +  '.' + exercise.name}</p>
                
                    <p>{routine.reps[index].length} sets </p>
                    <p>{routine.reps[index].join(',')}</p>
                    </div>
            }
            )
            }
        </div>
    )
}