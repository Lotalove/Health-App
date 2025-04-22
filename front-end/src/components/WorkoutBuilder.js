import styles from '../styles/workout_builder.module.css'
import edit_icon from '../media/icons/pencil.svg'
import trash_icon from '../media/icons/trash.svg'
import add_icon from '../media/icons/add.svg'
import shuffle from '../media/icons/Frame.svg'
import exercise_photo from '../media/bicep_curl.jpg'
import {useEffect, useRef, useState,useContext} from 'react'
import {search,searchByID} from '../utils/json-search'
import { getExerciseImage } from '../utils/getImages'
import useAuth from '../hooks/useAuth'
import SuccessMessage from "./SuccessMessage"
import RoutineContext from '../context/RoutineProvider'
import {SetsInput,RepsInput,DurationInput} from './NumberInput'
import {getCardioType} from "../utils/getExerciseType.js";
import { generateWorkout } from '../utils/generateWorkout.js'
import Routine from '../utils/routine.js'
import { supabase } from '../api/supabaseClient.js'

function ExerciseCard(props){
    var [editing,setEditing] = useState(props.editing)
    var [sets,makeSets] = useState(props.exerciseInfo.reps)
    var setsRef = useRef(sets)
   
    let toggleEditing = ()=>{setEditing(!editing)}
   useEffect(()=>{
        setsRef.current=sets
    },[sets]) 
   
    // when the number of sets gets changed a new set is added to the array or removed
    async function handleSetsChange(numSets){
        if(numSets > sets.length){
            var newSetArr =[]
            for(let i = 0 ; i<numSets;i++){
                if (i < sets.length) newSetArr[i] = sets[i]
                else newSetArr[i] = 1
            }
            await makeSets(newSetArr)
        }
        else {
            var newSetArr =sets.slice(0,numSets)
            await makeSets(newSetArr)}
        props.update(props.index,{ ...props.exerciseInfo, reps:newSetArr })
    }
    function changeRepCount(indexOfSet,newCount){
        const updatedSets = sets.map((reps ,i)=>{
            if(indexOfSet == i) return Number(newCount)
            else return reps
        })
        makeSets(updatedSets)
        props.update(props.index,{ ...props.exerciseInfo, reps:updatedSets })
    }
 
    
    //set of buttons displayed if card is editable
    var editable_card_buttons= (
    <div id={styles.card_buttons}>
    <img 
    className={styles.card_button}
    src={edit_icon}
    onClick={toggleEditing}
    />
    
    <img 
    className={styles.card_button}
    src={trash_icon}
    onClick= {props.removeFunction}
    />

    </div>
    )
//set of buttons displayed if card is not editable
    var ineditable_card_buttons = (
        <div id={styles.card_buttons}>
        <SuccessMessage message="Successfully Added Exercise" clickFunction = {()=>{
            props.addFunction({ ...props.exerciseInfo, reps: sets });
        }}></SuccessMessage>
        </div>
    )
       


    const editorToUse = props.exerciseInfo.category === 'strength'
    ? <StrengthEditor sets={sets} editing={editing} handleSetsChange={handleSetsChange} changeRepCount={changeRepCount} />
    : <CardioEditor exercise={props.exerciseInfo} sets={sets} editing={editing} changeRepCount={changeRepCount} />;
    //<input key={index} min='1'onChange={(event)=>{changeRepCount(index,event)}} type="number" defaultValue={rep} /> old line 85
    return(
    <div className = {styles.exercise_card}>
        <div className={styles.card_header}>
            <p className={styles.card_title}>{props.exerciseInfo.name}</p>
            {props.isEditable?editable_card_buttons:ineditable_card_buttons}
        </div>
        <div className={styles.card_body}>
            <img className = {styles.exercise_photo} src={props.exerciseInfo?getExerciseImage(props.exerciseInfo.images[0]):exercise_photo}></img>
            <div>
            {props.exerciseInfo.reps? editorToUse:null}
        </div>
    </div>
    </div>
    )
}

function StrengthEditor({ sets, editing, handleSetsChange, changeRepCount }) {
    
    // common set/rep ranges will be recommended for quicker planning
    /* var recommendedSets = (<div>
        <div className={styles.rec_button}> 3x 10</div> 
        </div>)

           {editing?recommendedSets:null}
    */
    return (
        <div className={styles.exercise_sets}>
        
            <label> Sets</label>
            {editing ? (
                <SetsInput functions={{ onChange: handleSetsChange }} min="1" max="10" defaultValue={sets?.length || 1} />
            ) : (
                <p>{sets?.length || 1}</p>
            )}
            {sets?.map((rep, index) =>
                editing ? <RepsInput key={index} min={1} max={100} index={index} functions={{ onChange: changeRepCount }} defaultValue={rep} />
                        : <p className = {styles.set_rep_count} key={index}>{rep} reps</p>
            )}
        </div>
    );
}

function CardioEditor({ exercise,sets, editing, changeRepCount }) {
   const type = getCardioType(exercise)
   
    return (
        <div className={styles.exercise_sets}>
            {sets?.map((rep, index) =>
                editing ? (
                    type == 'timed'?  <DurationInput key={index} min="0.1" max="100" index={index} functions={{ onChange: changeRepCount }} defaultValue={rep} />: <RepsInput key={index} min="1" max="100" index={index} functions={{ onChange: changeRepCount }} defaultValue={rep} />
                ) : (
                    <p key={index}>{rep} {type=='timed'?'Minutes':'Miles'}</p>
                )
            )}
        </div>
    );
}


function SearchMenu(props){
    var search_input = useRef(null)
    var [search_results , setSearchRes] = useState(null) 
    const debounceTimeout = useRef(null);

    function handleSearch(){
        var results = search(search_input.current.value.toLowerCase())
        setSearchRes(results)
    }
    return(
    <div id={styles.search_menu}>
       
    <div id={styles.search_bar}>
  
        <input onChange={()=>{
               if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
              }
      
              // Set a new timeout for debounce
              debounceTimeout.current = setTimeout(() => {
                handleSearch();
              }, 300); // Adjust delay as needed
            }} 
        ref = {search_input} type='search'></input>

          <p onClick={props.closeMenu}id={styles.search_close}>X</p>
    </div>
        <div className={styles.exercise_list}>
        {search_results!= null?search_results.map((result)=>{
           const exerciseData = { ...result, reps: [1] }; 
          return (<ExerciseCard update={props.exerciseController.updateRoutine} addFunction = {props.addFunction} exerciseInfo={exerciseData} isEditable={false} editing={true}></ExerciseCard>)
        }):null}
        </div>
    </div>
    )
}

function GenWorkoutMenu(props){
    var [settings,updateSettings] = useState({"muscle_groups":[],"equiptment":[]})
    var muscleGroupOpts=['Biceps','Triceps','Shoulders','Back','Chest',"Abdominals","Legs"]
    var equiptmentOpts=[{label:'Body only',group:1},{label:"Full Gym",group:1},{label:"Dumbbell",group:null},{label:"Bands",group:null},{label:"Pull up Bar",group:null}]
    
    var [routine,setRoutine] = useState(null)
    var [displayMode,setDisplayMode] = useState(false)
    const { setAuth } = useAuth();
    const [errorMessage, setErrorMessage] = useState(null)
    async function save(){
        // Sends data to server to be saved to database
        try{
       
        }
        catch (err){
            setErrorMessage("Something went wrong when saving your workout. Try again and if this message appears report to admin")
            return
        }
            props.close() //closes the workout builder 
    
        }
    function generateRoutine(){
        setRoutine(generateWorkout(settings))
        setDisplayMode(true);
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
    <div name="muscle_groups" onChange={handleInputChange}>
    <p>Muscle Groups</p>
        {muscleGroupOpts.map((muscle)=>{
            return(
                <span>
                <label>{muscle}</label>
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
                <label>{eq.label}</label>
                <input name={eq.label.toLowerCase()} type="checkbox" checked={settings.equiptment.includes(eq.label.toLowerCase())}></input>
                </span>
            )
        })}
    
    </div>
    <button onClick={()=>{generateRoutine()}}>Generate</button>
    </div>
  
    return(
        <div>
        {errorMessage?<p>{errorMessage}</p>:null}
        {displayMode? <RoutineListView routine = {routine?routine:null}  setRoutine={setRoutine} save={save}/>:form}
        </div>
    )
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

function RoutineListView({ routine, setRoutine, save }) {
 
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
        <div className={styles.routine_list}>
            {routine.getList().map((exercise, index) => (

                <ShuffleableCard key={index} exercise={exercise} removeMethod={() => remove(index)} swapMethod={()=>{swap(index)}}/>
            ))}
            <button id={styles.save_button} onClick={()=>{save()}}>Save</button>
        </div>
    );
}
export function WorkoutBuilder(props){
    var [isAdding,setAdding] = useState(false)
    var [isGenerating,setGenerating] = useState(false)
    var [routine,setRoutine] = useState(new Routine([]))
    const routineRef=useRef([])
    var [wasUpdated,setUpdated] = useState(false)
    const wasUpdatedRef = useRef(false); // Create a ref to track `wasUpdated`
    const { auth } = useAuth();
    
    const {addRoutine,updateRoutineLocally,deleteRoutine} = useContext(RoutineContext)
    
    async function createRoutine() {
        
            console.log(routineRef.current.getExIDList(),routineRef.current.getRepsList())
            const {data,error} = await supabase
            .from("Routines")
            .insert({date:props.date,exercises:routineRef.current.getExIDList(),reps:routineRef.current.getRepsList(),user_id:auth.user.id})
            .select()
           
            if(error) console.log(error)
            if(data){
                addRoutine(data[0])
            }    
            

    }

    useEffect(() => {
        // When the component mounts it will have the routine as a list of exercise id's
        // the getExercise method will get the exercise details
        const getRoutineInfo = async ()=>{
            if (props.routineInfo.routine) getExercises(props.routineInfo.routine)
            }
        
        getRoutineInfo()
        
        // when the component unmounts it will save the changes to the routine if there were any 
    return async ()=>{
        
        if(wasUpdatedRef.current == true) {
            const isNew = props.routineInfo.routine?false:true // was a routine passed as a prop? then it is not new, Otherwise is new
            
            // creates a new row in the Routines database holding this routine
            if(isNew){
               await createRoutine()
            }
        
        else if(isNew == false){

           
            if(routineRef.current.getExIDList().length == 0){
                
                const {data,error} = await supabase
                .from('Routines')
                .delete()
                .eq('id',props.routineInfo.routine.id)
                .select()
                if(error){alert(error.message)}
                if(data) {deleteRoutine(props.routineInfo.routine.id)}
            }

            else{
                const {data,error} = await supabase
                .from('Routines')
                .update({exercises:routineRef.current.getExIDList(),reps:routineRef.current.getRepsList()})
                .eq('id',props.routineInfo.routine.id)
                .select()
                if(error){console.log(error)}
                if(data) {
                    updateRoutineLocally(data[0])}
            }

        }
        }
    }

      }, []);

    /*
    exercises are stored as a list of id's in the database. The below function finds the
    exercise information using this id.
    
    The database stores the reps for each exercise in an arary which hold arrays with an int 
    for each set of the exercises
    EX: [[10,10,10],[20,15,10]] the first exercise in the routine has 3 sets of 10 reps 
    */
    async function getExercises(routine){
    var newExercises =routine.exercises.map(id=> searchByID(id)); // Collect all results
    newExercises.forEach((exercise,index) => {
        exercise.reps = routine.reps[index]
    });
    var routineObj = new Routine(newExercises)
    routineObj.display()
    await setRoutine(routineObj); // Update state once with all results
    }
    
    // whenver wasUpdated is changed the refrence will be updated as well
    useEffect(() => {
        wasUpdatedRef.current = wasUpdated;
        routineRef.current = routine
      }, [wasUpdated,routine]);


    //removes exercise at the index specified 
    function remove_exercise(index){
        routine.remove_exercise(index)
        // a new routine obj is made with the same exercises and reps of the old in order to cause an update to front end
        var newRoutine = new Routine(routine.getList())
        setUpdated(true)
        setRoutine(newRoutine)
    }
    function add_exercise(exercise){
        routine.addExercise(exercise)
        var newRoutine = new Routine(routine.getList())
        setRoutine(newRoutine)
        setUpdated(true)
    }   
    //this function is used to change the rep or set count of a given exercise
    function updateRoutine(exerciseIndex,newRoutine){
        routine.updateRoutine(exerciseIndex,newRoutine)
        var newRoutine = new Routine(routine.getList())
        setRoutine(newRoutine)  
        setUpdated(true)
    }
   
    // creates a card for each exercise in the routine
    var routine_cards = routine?.getList()?routine.getList().map((exercise,index)=>{
      return <ExerciseCard update ={updateRoutine} addFunction={add_exercise} exerciseInfo={exercise} isEditable={true} removeFunction ={()=>{remove_exercise(index)}} index={index} key = {index}/>  
    }):null

    function closeSearchMenu(){
        setAdding(false)
    }
   return(
    <div className={styles.workout_builder}> 
    <button id={styles.gen_button} className={styles.button} onClick={()=>{setGenerating(!isGenerating)}}>Generate Routine</button>
    <div className={styles.exercise_list}>
   {routine_cards}
   </div>
   {isAdding?<SearchMenu exerciseController={{updateRoutine:updateRoutine}} closeMenu={closeSearchMenu}addFunction={add_exercise}></SearchMenu>:null}
   {isGenerating?<GenWorkoutMenu close={()=>{props.close()}} date={props.date} />:null}
   {!isGenerating?<button 
   id={styles.add_button}
   onClick={()=>{
    setAdding(!isAdding)
   }}
   >Add Exercise</button>:null}
   </div>
   )
}
