import { useState } from 'react'
import { useContext } from 'react'


import styles from './workout_builder.module.css'
import trash_icon from '../../media/icons/trash.svg'
import shuffle from '../../media/icons/Frame.svg'

import RoutineContext from '../../context/RoutineProvider'
import Routine from '../../utils/routine'
import useAuth from '../../hooks/useAuth'

import { generateWorkout } from '../../utils/generateWorkout'
import { getExerciseImage } from '../../utils/getImages'

export function GenWorkoutMenu(props){
    var [settings,updateSettings] = useState({"muscle_groups":[],"equiptment":[]})
    var muscleGroupOpts=['Biceps','Triceps','Shoulders','Back','Chest',"Abdominals","Legs"]
    var equiptmentOpts=[{label:'Body only',group:1},{label:"Full Gym",group:1},{label:"Dumbbell",group:null},{label:"Bands",group:null},{label:"Pull up Bar",group:null}]
    
    var [routine,setRoutine] = useState(null)
    // review Mode is the state where the user has generated a routine and is reviewing it before saving
    var [reviewMode,setReviewMode] = useState(false)

    const auth = useAuth()
    const [errorMessage, setErrorMessage] = useState(null)
    const {createRoutine,updateRoutine} = useContext(RoutineContext)


    async function save(){
        // Sends data to server to be saved to database
        try{
        // this bit of code will save te new routine to the routines database
           createRoutine({date:props.date,exercises:routine.getExIDList(),reps:routine.getRepsList(),user_id:auth.user.id})
           props.setRoutine(new Routine(routine.getList()))
        
        }
        catch (err){
            setErrorMessage("Something went wrong when saving your workout. Try again and if this message appears report to admin")
            return
        }
           props.close() //closes the workout builder 
        
        }
    function generateRoutine(){
        setRoutine(generateWorkout(settings))
        setReviewMode(true);
    }

    // this funtion handles changed to the muscle group
    function handleInputChange(e){    
        //if a muscle group is being added 
        if(e.target.checked){
            var updatedSettings = {"muscle_groups":[...settings.muscle_groups, e.target.name],"equiptment":settings.equiptment}
            updateSettings(updatedSettings)
        }
        // if it is begin removed
        else{
           var updated_muscles = settings.muscle_groups.filter((muscle)=>{return muscle != e.target.name })
           console.log(updated_muscles)
            var updatedSettings = {"muscle_groups":updated_muscles,"equiptment":settings.equiptment}
            updateSettings(updatedSettings)
        } 
    }

    function handleEquipment(e){
        var equip =e.target.name 
        var isAdding = e.target.checked
        if(equip == 'body only' || equip == 'full gym'){
            var equiptment = isAdding? [equip] : []
            updateSettings({"muscle_groups":settings.muscle_groups,"equiptment":equiptment})
        }
        else{
            
            // the location of an exclusive equipment option. -1 if none are in the list
            var locationOfExclusive = settings.equiptment.indexOf('body only') != -1 ? settings.equiptment.indexOf('body only') :settings.equiptment.indexOf('full gym') 
    
            var equiptment = [...settings.equiptment]
            //if an exclusive option was previously selected it will be removed
            if(locationOfExclusive != -1) {equiptment = settings.equiptment.filter(eq=>{return (eq != 'body only' && eq!= 'full gym')})}
                if(isAdding) equiptment.push(equip)
                else{equiptment = equiptment.filter(eq=>{return eq != equip})}
                updateSettings({"muscle_groups":settings.muscle_groups,"equiptment":equiptment})
            }
    }


    var form = <div id={styles.search_menu}>
                 <div className='menu-header'> 
               <p 
               id="popup_close"
               onClick={()=>{props.close()}}
               >X</p>
            </div>
    <div name="muscle_groups" onChange={handleInputChange}>
    <p>Muscle Groups</p>
        {muscleGroupOpts.map((muscle)=>{
            return(
                <span>
                <label className={styles.checkboxtext}>{muscle}</label>
                <input name={muscle.toLowerCase()} type="checkbox" checked ={settings.muscle_groups.includes(muscle.toLowerCase())}></input>
                </span>
                
            )
        })}
    
    </div>
    <div name="equiptment" onChange={handleEquipment}>
        <p>Equiptment</p>
        {equiptmentOpts.map((eq)=>{
            return(
                <span>
                <label className={styles.checkboxtext}>{eq.label}</label>
                <input name={eq.label.toLowerCase()} type="checkbox" checked={settings.equiptment.includes(eq.label.toLowerCase())}></input>
                </span>
            )
        })}
    
    </div>
    <button className={styles.button} onClick={()=>{generateRoutine()}}>Generate</button>
    </div>
  
  // {reviewMode? <RoutineListView routine = {routine?routine:null}  setRoutine={setRoutine} save={save} date={props.date} close={props.close} />:form}
    return(
        <div className={styles.routine_list}>
  
        {errorMessage?<p>{errorMessage}</p>:null}
         {reviewMode? <RoutineListView routine = {routine?routine:null}  setRoutine={setRoutine} save={save} date={props.date} close={props.close} />:form}
        </div>
    )
}


function RoutineListView({ routine, setRoutine, save,date,close}) {
  
    function remove(index) {
        routine.remove_exercise(index)
        // it is necessary to update the routine to a new object to force a rerender
        var newRoutine = new Routine (routine.getList()) 
        setRoutine(newRoutine)
    }
    function swap(index){
        routine.swap(index)
        setRoutine(new Routine(routine.getList()))
    }

    return (
        <div  id={styles.search_menu} className={styles.exercise_list}>
        
              <div className='menu-header'> 
               <p 
               id="popup_close"
               onClick={()=>{close()}}
               >X</p>
            </div>
            {routine.getList().map((exercise, index) => (

                <ShuffleableCard key={index} exercise={exercise} removeMethod={() => remove(index)} swapMethod={()=>{swap(index)}}/>
            ))}
            <button className={styles.button} id={styles.save_button} onClick={()=>{save()}}>Save</button>
        </div>
    );
}

function ShuffleableCard({exercise,removeMethod,swapMethod}){
  return(
    <div className = {styles.exercise_card}>
    <div className={styles.card_header}>
        <p className={styles.card_title}> {exercise.name}</p>
        <div id={styles.card_buttons}>
        <img 
            className={styles.card_button}
            src={shuffle}
            onClick={()=>{swapMethod()}}
        />

        <img 
            className={styles.card_button}
            src={trash_icon}
            onClick={()=>{removeMethod()}}
        />
        </div>
    </div>
    <div className={styles.card_body}>
        <img className = {styles.exercise_photo} src={getExerciseImage(exercise.images[0])}></img>
        <div>
        {exercise.reps? exercise.reps.map(rep=>{return <p>{rep + " "} reps</p>}):null}
    </div>
</div>
</div>
  )
}