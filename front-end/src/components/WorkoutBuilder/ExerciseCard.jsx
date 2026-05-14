import styles from './card.module.css'
import edit_icon from '../../media/icons/pencil.svg'
import trash_icon from '../../media/icons/trash.svg'


import {useRef, useState} from 'react'

import { getExerciseImage } from '../../utils/getImages'
import {getCardioType} from "../../utils/getExerciseType.js";
import { RepsInput, SetsInput } from './Input.jsx';


export function StrengthExerciseCard(props){
    /**
     * props for StrengthExerciseCard
     * exerciseInfo
     */
    var [editing, setEditing] = useState(props.exerciseInfo.reps != null ? false : true)

    console.log(props.addExercise)
    var sets = [...props.exerciseInfo.reps]

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
    var editable_card_buttons= (
    <div className={styles.card_buttons}>
    
    <img 
    className={styles.card_button}
    src={edit_icon}
    onClick={()=>{setEditing(!editing)}}
    />

    <img 
    className={styles.card_button}
    src={trash_icon}
    onClick={removeExercise}
    
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
    


    return(
    <div className = {styles.exercise_card}>
        <div className={styles.card_header}>
            <p 
            className={styles.card_title}>
            {props.exerciseInfo.name}
            </p>
           
           {props.addExercise == null?editable_card_buttons:addable_card_button}
        </div>
        <div className={styles.card_body}>
            <img 
            className = {styles.exercise_photo} 
            src={getExerciseImage(props.exerciseInfo.images[0])}
            />
            <div className={styles.exercise_sets}>
                <label>Sets</label>
                {!editing?<p> {sets.length } </p>
                :<SetsInput 
                    defaultValue={sets.length}
                    sets={sets}
                    min={1}
                    max = {10}
                    update = {updateSets}
                />
                } 
                <label>Reps</label>
                {sets.map((set, index) => {
    if (!editing) {
        return <p className={styles.set_rep_count} key={index}>{set} reps</p>;
    } else {
        return (
          <RepsInput 
            key = {`Exercise ${props.index} Set ${index} `}
            defaultValue={set}
            min={1}
            max = {100}
            index = {index}
            sets={sets}
            update = {updateReps}
            />
        );
    }
})}
            </div>
            

            <div>
        
        </div>
    </div>
    </div>
    )
}

export function CardioExerciseCard({exerciseInfo}){
const type = getCardioType(exerciseInfo)
       
       console.log(type)
        return (
            <div className={styles.exercise_sets}>
               <label>{type=='timed'?'Duration':'Miles'}</label>
                {/* {sets?.map((rep, index) =>
                    editing ? (
                        type == 'timed'?  <DurationInput key={index} min="0.1" max="100" index={index} functions={{ onChange: changeRepCount }} defaultValue={rep} />: <RepsInput key={index} min="1" max="100" index={index} functions={{ onChange: changeRepCount }} defaultValue={rep} />
                    ) : (
                        <p key={index}>{rep} {type=='timed'?'Minutes':'Miles'}</p>
                    )
                )} */}
            </div>
        );
}