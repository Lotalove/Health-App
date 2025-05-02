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


function ExerciseCard({routine, routineRef,setRoutine, wasUpdatedRef,indexOfExercise,exerciseProps}){
    var [exerciseInfo,setExerciseInfo] = useState(indexOfExercise!=null?routine.getList()[indexOfExercise]:exerciseProps)
    var [editing, setEditing] = useState(indexOfExercise != null ? false : true)

    var [sets,updateSets] = useState(exerciseInfo.reps)
    var setsRef = useRef(null)
    
   function addExercise(){
    routine.addExercise({... exerciseInfo , reps:sets})
    setRoutine(new Routine(routine.getList()))
    routineRef.current = routine
    wasUpdatedRef.current = true 
}

    function deleteExercise(index){
        console.log("Deleting exercise at index:", index);
        routine.remove_exercise(index)
        // it is necessary to update the routine to a new object to force a rerender
        var newRoutine = new Routine (routine.getList()) 
        setRoutine(newRoutine)
        wasUpdatedRef.current = true
        routineRef.current = newRoutine

    }

    function handleSetsChange(numSets) {
        if (numSets ==0) return
        const currentSets = [...sets]
        let updatedSets
    
        if (numSets > currentSets.length) {
            updatedSets = [...currentSets];
            for (let i = currentSets.length; i < numSets; i++) {
                updatedSets.push(1);
            }
        } else {
            updatedSets = currentSets.slice(0, numSets);
        }
        // will only update the routine object if the exercise is already in the routine
        //required because the search menu uses the same card component an functions
        if(indexOfExercise!=undefined){
            routine.setReps(indexOfExercise, updatedSets);
            routineRef.current = routine
            wasUpdatedRef.current = true
        }
        updateSets(updatedSets)
        
    }
    
    function changeRepCount(indexOfSet,newCount){
        let currentSets = [...sets]
        currentSets[indexOfSet] = newCount
        // will only update the routine object if the exercise is already in the routine
        if(indexOfExercise!=undefined){
            routine.setReps(indexOfExercise,currentSets)
            routineRef.current = routine
            wasUpdatedRef.current = true
        }
        updateSets(currentSets)
        
    } 
     
    function StrengthEditor() {
        // common set/rep ranges will be recommended for quicker planning
        function updateSetsArr(setArray){
            if(indexOfExercise!=undefined){
                routine.setReps(indexOfExercise, setArray);
                wasUpdatedRef.current = true
            }
            updateSets(setArray);
            
        }
        var recommendedSets = (<div id={styles.set_recs}>
            <div  onClick={()=>{
                updateSetsArr([10,10,10])
            }} 
                className={styles.rec_button}> 3x 10</div>
           
            <div onClick={()=>{updateSetsArr([12,12,12])}} 
            className={styles.rec_button}> 3x 12</div>
            
            
            <div 
            onClick={()=>{updateSetsArr([10,10,10,10])}}
            className={styles.rec_button}> 4x 10</div> 
            </div>)
    
        
        
    return (
        <div className={styles.exercise_sets}>
            {editing?(recommendedSets):null}
                <label> Sets</label>
                {editing ? (
                    <SetsInput setRef = {setsRef} functions={{ onChange: handleSetsChange }} min={1} max={9} defaultValue={sets?.length || 1} />
                ) : (
                    <p>{sets?.length || 1}</p>
                )}
                {sets?.map((rep, index) =>
                    editing ? <RepsInput key={index} min={1} max={100} index={index} functions={{onChange: changeRepCount}} defaultValue={rep} />
                            : <p className = {styles.set_rep_count} key={index}>{rep} reps</p>
                )}
            </div>
                  );
    }
    /*
    function CardioEditor() {
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
    */
    
        const editorToUse = exerciseInfo.category === 'strength'
    ? <StrengthEditor />:null
   // : <CardioEditor />;
    
    //set of buttons displayed if card is editable
    var editable_card_buttons= (
    <div id={styles.card_buttons}>
    
    <img 
    className={styles.card_button}
    src={edit_icon}
    onClick={()=>{setEditing(!editing)}}
    />

    <img 
    className={styles.card_button}
    src={trash_icon}
    onClick={()=>{deleteExercise(indexOfExercise)}}
    />
    </div>
    )

    var addable_card_button = (
        <div id={styles.card_buttons}>
        <SuccessMessage message="Successfully Added Exercise" clickFunction = {()=>{
            addExercise();
        }}></SuccessMessage>
        </div>
    )
       

    return(
    <div className = {styles.exercise_card}>
        <div className={styles.card_header}>
            <p className={styles.card_title}>{exerciseInfo.name}</p>
           {indexOfExercise !=undefined?editable_card_buttons:addable_card_button}
        </div>
        <div className={styles.card_body}>
            <img className = {styles.exercise_photo} src={exerciseInfo?getExerciseImage(exerciseInfo.images[0]):exercise_photo}></img>
            {sets? editorToUse:null}
            <div>
        
        </div>
    </div>
    </div>
    )
}

function SearchMenu({closeMenu,routine,setRoutine,routineRef,wasUpdatedRef}){
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

          <p onClick={closeMenu}id={styles.search_close}>X</p>
    </div>
        <div className={styles.exercise_list}>
        {search_results!= null?search_results.map((result,index)=>{
            const exerciseData = { ...result, reps: [1] }; 
         
          return (<ExerciseCard key={result.id || index} routine={routine} routineRef={routineRef}setRoutine={setRoutine}  wasUpdatedRef={wasUpdatedRef}indexOfExercise={null} exerciseProps={exerciseData}></ExerciseCard>)
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
    const { auth } = useAuth();
    const [errorMessage, setErrorMessage] = useState(null)
    const {createRoutine,updateRoutine} = useContext(RoutineContext)

    async function save(){
        // Sends data to server to be saved to database
        try{
            /*
            this bit of code will save te new routine to the routines database
            */
           createRoutine({date:props.date,exercises:routine.getExIDList(),reps:routine.getRepsList(),user_id:auth.user.id})
           console.log(routine)
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
        {displayMode? <RoutineListView routine = {routine?routine:null}  setRoutine={setRoutine} save={save} date={props.date}/>:form}
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

function RoutineListView({ routine, setRoutine, save,date }) {
  
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
    var [routine,setRoutine] = useState(new Routine())
    var [isGenerating,setGenerating] = useState(false)
    var [isAdding,setAdding] = useState(false)
    var routineRef = useRef(routine);
    const wasUpdatedRef = useRef(false); 
    const { auth } = useAuth();
    const {createRoutine,updateRoutine,deleteRoutine} = useContext(RoutineContext)
    /*
    exercises are stored as a list of id's in the database. The below function finds the
    exercise information using this id.
    
    The database stores the reps for each exercise in an arary which hold arrays with an int 
    for each set of the exercises
    EX: [[10,10,10],[20,15,10]] the first exercise in the routine has 3 sets of 10 reps 
    */

    function convertRoutine(routine){
        var newExercises =routine.exercises.map(id=> searchByID(id)); // Collect all results
        newExercises.forEach((exercise,index) => {
            exercise.reps = routine.reps[index]
        });
        var routineObj = new Routine(newExercises)
        setRoutine(routineObj); // Update state once with all results
        routineRef.current = routineObj
        }
        function closeSearchMenu(){
            setAdding(false)
        }
        function addExercise(exercise){
            routine.addExercise(exercise)
            setRoutine(new Routine(routine.getList()))
        }
    //when the workout builder loads, the routine inofmration will be retreived from the json file h
    useEffect(() => {
            if (props.routineInfo.routine) {
                convertRoutine(props.routineInfo.routine);
            }

            return () => {
                const cleanup = async () => {
            
                    if (wasUpdatedRef.current == true) {
                        
                        const isNew = props.routineInfo.routine ? false : true;
        
                        if (isNew) {
                            await createRoutine({date:props.date,exercises:routineRef.current.getExIDList(),reps:routineRef.current.getRepsList(),user_id:auth.user.id});
                        } else {
                            if (routineRef.current.getExIDList().length === 0) {
                                await deleteRoutine(props.routineInfo.routine.id);
                            } else {
                                console.log("updating routine")
                                await updateRoutine(routineRef.current,props.routineInfo.routine.id);
                            }
                        }
                        
                    }
                };
        
                cleanup(); // Run and don't await (it's okay for cleanup to be async internally)
            };

    },[])

    useEffect(() => {
        if (props.routineInfo.routine) {
            convertRoutine(props.routineInfo.routine);
        }
},[])

    
   return(
    <div className={styles.workout_builder}> 
    <button id={styles.gen_button} className={styles.button} onClick={()=>{setGenerating(!isGenerating)}}>Generate Routine</button>
    <div className={styles.exercise_list}>
   {routine.getList().map((exercise,index)=>{
    return <ExerciseCard key={index + exercise.name} routine={routine} routineRef={routineRef}  setRoutine ={setRoutine} wasUpdatedRef={wasUpdatedRef} indexOfExercise={index} ></ExerciseCard>
    
   })}
   </div>
   {isAdding?<SearchMenu closeMenu={closeSearchMenu}routine={routine} routineRef={routineRef} setRoutine={setRoutine} wasUpdatedRef={wasUpdatedRef}></SearchMenu>:null}
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