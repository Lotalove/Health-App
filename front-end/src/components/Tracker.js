import { Navbar } from "./Navbar"
import styles from '../styles/tracker.module.css'
import Routine from "../utils/routine"
import { useState,useEffect,useRef,useContext} from "react"
import { useLocation } from 'react-router-dom';
import {searchByID} from '../utils/json-search'
import { SearchMenu } from "./WorkoutBuilderRebuild";
import { getTodaysDate } from "../utils/getDate";
import useAuth from '../hooks/useAuth'
import RoutineContext from '../context/RoutineProvider'
import { getCardioType } from "../utils/getExerciseType";
import trash_icon from '../media/icons/trash.svg'

export function Tracker(props){
    const { auth } = useAuth();
    const {createRoutine,updateRoutine,deleteRoutine} = useContext(RoutineContext)
    const location = useLocation();
    const [routine,setRoutine] = useState(new Routine)
    const [isAdding,setAdding] = useState(false)
    const [isFinished,setFinished] = useState(false)
    const [confirmed,setConfirm] = useState("No")
    var routineRef = useRef(routine);
    const wasUpdatedRef = useRef(false); 
    var date = location.state?location.state.date:getTodaysDate() 
    
    
    
    async function saveWorkout(){

        //const askoConfirm
        const isNew = location.state ? false : true;
        
        if (isNew) {
        await createRoutine({date:date,exercises:routineRef.current.getExIDList(),reps:routineRef.current.getRepsList(),weight_matrix:routineRef.current.getWeightList(),completion_matrix:routineRef.current.getCompletionList(),user_id:auth.user.id});
        } else {
            if (routineRef.current.getExIDList().length === 0) {
                await deleteRoutine(location.state.id);
            } else {
                console.log("updating routine")
                await updateRoutine(routineRef.current,location.state.id);
            }
        }
        setFinished(true)
    }
   
    function closeSearchMenu(){
        setAdding(false);
    }
    function convertRoutine(routine){
        var newExercises =routine.exercises.map(id=> searchByID(id)); // Collect all results
        newExercises.forEach((exercise,index) => {
            exercise.reps = routine.reps[index]
            exercise.weights = routine.weight_matrix?routine.weight_matrix[index]:null
            exercise.completions =  routine.completion_matrix?routine.completion_matrix[index]:null
        });
        var routineObj = new Routine(newExercises)
        setRoutine(routineObj); // Update state once with all results
        routineRef.current = routineObj
        }
    
      useEffect(() => {
                if(location.state){convertRoutine(location.state)}
            },[])
    
 function ExerciseTable(props){
        var [sets,updateSets] = useState(props.sets)
        var [weights,setWeights] = useState(props.exercise.weights?props.exercise.weights: new Array(sets.length).fill(null))
        var [completedArr,setCompletedArr] = useState(props.completion_matrix?props.completion_matrix:new Array(sets.length).fill(false))

        const type = getCardioType(props.exercise)

        console.log(type)
        function addSet(){
            var updatedSets= [...sets,1]
            updateSets(updatedSets) 
            routine.setReps(props.exIndex,updatedSets)
        }
        function updateSetWeight(index,weight){
            weights[index] =  weight
            routine.setWeight(props.exIndex,weights)
        }
        
        function updateCompletionArr(index,status){
            completedArr[index] =  status
            routine.setCompletion(props.exIndex, completedArr)
        }

        function updateReps(index,reps){
            sets[index] = reps
            routine.setReps(props.exIndex,sets)
        }
        //console.log(props)
        const distTableHeaders = (
                <tr>
                        <th>Miles</th>
                        <th>Time to Complete</th>
                        <th>Completed?</th>
                    </tr>
        )

return(
    <div className={styles.exTable}>
        <div style={{display:"inline-block",alignSelf:"flex-start",width:"100%"}}>
        <p className={styles.exerciseLabel}>{props.name}</p>
        <div className={styles.exerciseSettings}>
        <img 
        className={styles.card_button}
        src={trash_icon}
        //onClick={()=>{deleteExercise(indexOfExercise)}}
        />
        
        </div>
        </div>
                <table>
                    {
                        type == "distance"?distTableHeaders:
                    <tr>
                        <th>Sets</th>
                        <th>Reps Completed</th>
                        <th>Weight</th>
                        <th> Mark Complete</th>
                    </tr>
                    }
                    {sets.map((reps, index)=>{return <tr>
                        <td>{index+1}</td>
                        <td><TrackerInput index={index} saved={reps} update={updateReps}/></td>
                        <td><TrackerInput index={index} saved={weights[index]} update={updateSetWeight}></TrackerInput> </td>
                        <td><input
                        type="checkbox"
                        defaultChecked={completedArr[index]}
                        onClick={(e)=>{
                            updateCompletionArr(index,e.target.checked)
                        }}
                        /> 
                        </td>
                        </tr>})}
               
                </table>
                 <tr  onClick={addSet}className={styles.addExercise}> + Add Set</tr>
    </div>
)
}

    return(
        <div id={styles.trackerPage}>
            <Navbar></Navbar>
            {isFinished?<Summary routine = {routineRef.current.getList()}/>:null}
            <div className={styles.tracker}>
                <div id={styles.trackerHeader}>

                <h3>Tracking workout</h3>
                <div id={styles.finishButtonContainter}>
                
                {
                    confirmed == "Pending" ? 
                <button id={styles.cancelButton}
                    onClick={()=>{
                        setConfirm("No")
                    }}
                    > Cancel</button>
                    :null
                }
                {
                    confirmed == "No"?
                
                <button id={styles.finishButton}
                    onClick={()=>{setConfirm("Pending")}}
                    > Finish Workout</button>
                : <button id={styles.finishButton}
                    onClick={saveWorkout}
                    > Finish Workout</button>
                }
                </div>
                
                </div>
                    <h4>{ date}</h4>
                
                {routine.getList().map((exercise,index)=>{
                    return <ExerciseTable exIndex = {index} exercise={exercise} name={exercise.name} sets={exercise.reps} completion_matrix={exercise.completions}></ExerciseTable>
                })}
            </div>
             {isAdding?<SearchMenu closeMenu={closeSearchMenu}routine={routine} routineRef={routineRef} setRoutine={setRoutine} wasUpdatedRef={wasUpdatedRef}></SearchMenu>:null}
            <button disabled={isFinished} id={styles.addButton} onClick={()=>{setAdding(true)}}>Add Exercise</button> 
           
        </div>
    )
}

function Summary({routine}){
    var muscleGroups =new Set()
    routine.forEach(exercise=>{
        muscleGroups.add(exercise.primaryMuscles[0])
    })
    
    return(
    <div>
    
    <div id={styles.workout_summary}>
        <h2 style={{marginLeft:"8px",textAlign:"left"}}>Workout Summary:</h2>
        <h4>💪:{[... muscleGroups].join(', ')} | ⏱️: 1 hour 22 minutes |⚡: 300 Cals | 🏆:1</h4>
    </div>
     <div id="background_overlay"></div>
    </div>
    )
}   

function TrackerInput({index, update,saved}){
    var [selectedValue,setSelectedValue] = useState(saved) 
  
 
    function handleChange(e){
        const newValue = e.target.value;
    // Optionally, validate input (e.g., ensure it's a number)
    if (!(newValue == "") && Number(newValue)<=1000 ) {
        setSelectedValue(Number(newValue))
        update(index,Number(newValue))
    }
    else setSelectedValue("")
   
    }
    return (
       <input className={styles.inputs} value={selectedValue} onChange={handleChange} type="number"></input>
    )
}