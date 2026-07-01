import { useEffect, useState,useContext } from "react";

import styles from './workout_builder.module.css'

import {ExerciseCard} from "./ExerciseCard";
import {GenWorkoutMenu} from "./WorkoutGenerationMenu";
import {ExerciseForm} from "./ExerciseForm";

import {search,searchByID} from '../../utils/json-search'
import { SearchMenu } from "./SearchMenu";
import RoutineContext from '../../context/RoutineProvider'
import useAuth from '../../hooks/useAuth'
import { getCardioType, isCardio } from "../../utils/getExerciseType";

export function WorkoutBuilder({routineSchema,close,date,updateMessage}){
    const [routine,setRoutine] = useState([])
    const [isGenerating,setGenerating] = useState(false)    
    const [isAdding,setAdding] = useState(false)

    const [editing,setEditing] = useState(false)
    const [selectedExercise, selectExercise] = useState(null)

    const { auth } = useAuth();
    const {createRoutine,updateRoutine,deleteRoutine} = useContext(RoutineContext)

    // the routine schema does not contain all the necessary information for displaying exercises so in use effect we get that info from the exercise data json (should be done on back end)
    useEffect(()=>{
    
        if(routineSchema == null){return}
        var convertedRoutine = routineSchema.exercises.map((exerciseId,index) =>{
            var exerciseObj = searchByID(exerciseId)
            exerciseObj['reps'] =routineSchema.reps[index]
            exerciseObj['weights'] =routineSchema.weight_matrix?.[index]?routineSchema.weight_matrix[index]:null
            return exerciseObj
        })
        
        setRoutine(convertedRoutine)

    },[])




    async function save(){

        var isNew = routineSchema == null;
        
        if(!isNew &&routine.length === 0){
        await deleteRoutine(routineSchema.id)
        updateMessage("Successfully Deleted ")
        return
        }
        
        var exercises = routine.map((exercise)=>{
            return exercise.id
        })
        var reps = routine.map((exercise)=>{
            return exercise.reps
        })
        var weight = routine.map((exercise)=>{
            return exercise.weights
        })
        var newRoutine = {date,exercises:exercises,reps:reps,weight_matrix:weight,completion_matrix:null,user_id:auth.user.id}
        

        if(!isNew){
        console.log('updating routine: ', routine)
        await updateRoutine(newRoutine,routineSchema.id) 
        return
        }

        if (isNew && routine.length > 0){
            await createRoutine(newRoutine)
            updateMessage("Successfully created Routine")
            return
        }
    }

    function addExercise(exerciseInfo){
        setRoutine([...routine, exerciseInfo])
    }
    
    function removeExercise(idx){
        setRoutine(routine.filter((_, i) => i !== idx))

    }

    function updateSets(exerIDX,reps){
        var newRoutine = [...routine]
        newRoutine[exerIDX].reps = reps
        setRoutine(newRoutine)

    }
    function updateWeights(exerIDX,weights){
        var newRoutine = [...routine]
        newRoutine[exerIDX].weights =weights
        setRoutine(newRoutine)
       
    }

    function updateCompletions(idx,completions){
        // this is a dummy function to prevent errors is exercise table component.
    }

    return(
        <div className={styles.workout_builder}> 
        <div id={styles.builder_header}>

        {/* Workout Generation Button */}
        <button 
        disabled
        id={styles.gen_button}
        className={styles.button}
        onClick={()=>{setGenerating(!isGenerating)}}>
        Generate Routine (temporarily
 disabled)
        </button>

        {isGenerating?<GenWorkoutMenu/>:null}
        {isAdding?
        <SearchMenu
        close={()=>{setAdding(false)}}
        addExercise = {addExercise}
        updateSets = {updateSets}
        />
        :null}

        {editing?
        <ExerciseForm 
        exerciseInfo = {routine[selectedExercise]}
        exIndex = {selectedExercise}
        removeExercise={removeExercise}
        updateReps = {updateSets}
        updateWeight = {updateWeights}
        updateCompletions = {updateCompletions}
        save = {save}
        close = {()=>{setEditing(false)}}
        origin = "builder"
         />:null}

        <div id={styles.header_right}>

        <button
        onClick={()=>{
            save()
            close()
        }}
        >
            Save and Close
            </button>
        
        <button
           onClick={close}
        >Close
        </button>
        
        </div>
        </div>
        <div className={styles.exercise_list}>
        {routine?.length > 0 ? routine.map((exercise,idx)=>{
           return <ExerciseCard 
                    exerciseInfo={exercise}
                    index= {idx}
                    addExercise={null}
                    removeExercise={removeExercise}
                    updateSet={updateSets}
                    editing = {editing}
                    setEditing= {setEditing}
                    selectExercise = {selectExercise}
                    /> 
        }):null }
      
       </div>
       <button 
               id={styles.add_button}
               onClick={()=>{
               setAdding(!isAdding)
               }}
               >Add Exercise</button>
       </div>
       )
}