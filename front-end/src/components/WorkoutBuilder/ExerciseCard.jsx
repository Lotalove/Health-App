import styles from './card.module.css'
import edit_icon from '../../media/icons/pencil.svg'
import trash_icon from '../../media/icons/trash.svg'


import {useRef, useState} from 'react'

import { getExerciseImage } from '../../utils/getImages'
import {getCardioType, isCardio} from "../../utils/getExerciseType.js";
import { RepsInput, SetsInput } from './Input.jsx';


export function ExerciseCard(props){
    /**
     * props for StrengthExerciseCard
     * exerciseInfo
     */

    var sets = [...props.exerciseInfo.reps]
    var type = isCardio(props.exerciseInfo)? "cardio" : "strength"
    var addable = props.addExercise !== null
    
    function updateReps(setIDX,val){
        sets[setIDX] = val
        props.updateSet(props.index,sets)
    }

    function updateSets(val){
        props.updateSet(props.index,val)
    }
    
    function removeExercise(){
        props.removeExercise(props.index)
    }

    const formatSeconds = (totalSeconds) => {
     if (!totalSeconds || isNaN(totalSeconds)) return "0s";

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
     const seconds = Math.floor(totalSeconds % 60);

    // If it's over an hour, include hours. Otherwise, just show minutes and seconds.
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    return `${minutes}m ${seconds}s`;
    };
    
    var editable_card_buttons= (
    <div className={styles.card_buttons}>
    
    <img 
    className={styles.card_button}
    src={edit_icon}
    onClick={()=>{
        props.setEditing(!props.editing)
        props.selectExercise(props.index)    
    }}
    alt='Edit Button'
    />

    <img 
    className={styles.card_button}
    src={trash_icon}
    onClick={removeExercise}
    alt='Remove Button'
    
    />
    </div>
    )

    var addable_card_button = (
        <div className={styles.card_buttons}>
        
        <button onClick={()=>{
        props.addExercise(props.exerciseInfo)
        

    }}
         className="trigger-btn">
        Add Exercise
      </button>
        </div>
    )
    

    var body = addable?(
         <div className={styles.exercise_sets}>
                <ul style={{listStyleType:"none"}}>
                 
                <li>    💪: &nbsp; { props.exerciseInfo.primaryMuscles.join(
                    ','
                ) }
                </li>
               
                <li> 
                  Equipment: &nbsp;  { props.exerciseInfo.equipment}
                </li>  
                </ul>
            </div>
    ): (
                <div className={styles.exercise_sets}>
                <ul style={{listStyleType:"none"}}>
                { props.exerciseInfo.reps.map((rep,idx) =>{
                if (type === "strength") {
                  return (
                    <li>
                      {rep} reps {props.exerciseInfo.weights?.[idx] ? `@ ${props.exerciseInfo.weights[idx]} lbs` : ""}
                    </li>
                  )
                }
                else {
                  // Grab the raw seconds value safely
                  const totalSeconds = props.exerciseInfo.weights?.[idx];
                
                  return (
                    <li> 
                      {rep} Miles {totalSeconds ? `in ${formatSeconds(totalSeconds)}` : ""}
                    </li>
                  );
                }})}
                    
                </ul>
            </div>
    )

    return(
    <div className = {styles.exercise_card}>
        <div className={styles.card_header}>
            <p 
            className={styles.card_title}>
            {props.exerciseInfo.name}
            </p>
           
           {addable?addable_card_button:editable_card_buttons}
        </div>
        <div className={styles.card_body}>
            <img 
            className = {styles.exercise_photo} 
            src={getExerciseImage(props.exerciseInfo.images[0])}
            alt={"Image of " + props.exerciseInfo.name}
            />
           
       {body}
            <div>
        
        </div>
    </div>
    </div>
    )
}
