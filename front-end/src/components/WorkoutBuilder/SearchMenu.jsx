import { useState,useRef} from "react";
import {search,searchByID} from '../../utils/json-search'
import { StrengthExerciseCard } from "./ExerciseCard";

import styles from './searchMenu.module.css'
export function SearchMenu({close,addExercise,updateSets}){

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
  
        <input 
        onChange={()=>{
               if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
              }

              // Set a new timeout for debounce
              debounceTimeout.current = setTimeout(() => {
                handleSearch();
              }, 300); // Adjust delay as needed
            }} 
        ref = {search_input} type='search'></input>

          <p onClick={close}id={styles.search_close}>X</p>
    </div>
        <div className={styles.exercise_list}>
        {search_results!= null?search_results.map((result,idx)=>{
            const exerciseData = { ...result, reps: [1] }; 
         
          return (
          <StrengthExerciseCard 
            exerciseInfo={exerciseData}
            index= {idx}
            addExercise={addExercise}
            updateSet={updateSets}
           />
          )
        }):null}
        </div>
    </div>
    )
}