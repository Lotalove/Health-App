import styles from './ExerciseForm.module.css'
import { ExerciseTable } from '../Tracker/ExerciseTable'
export function ExerciseForm (props){
    return (
        <div className={styles.form}>
            <p>{props.exerciseInfo.name}</p>
            <ExerciseTable
                exercise = {props.exerciseInfo}
                exIndex = {props.exIndex}
                removeExercise = {props.removeExercise}
                updateReps = {props.updateReps}
                updateWeights = {props.updateWeight}
                updateCompletions = {props.updateCompletions} 
                origin = {props.origin}
            ></ExerciseTable>
            <div className={styles.buttonContainer}>
                <button
                type="button"
                className={styles.cancelButton}
                onClick={() => props.close()}
                >
                    Cancel
                </button>
                <button
                type="button"
                className={styles.submitButton}
                onClick={() => {
                    props.save()
                    props.close()
                }}  
                  >Confirm</button>
            </div>
        </div>
    )
}