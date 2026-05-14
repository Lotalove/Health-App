import { useState,useEffect } from 'react'
import styles from './card.module.css'

export function RepsInput(props){
/**
 * Props for RepsInput:
 * - defaultValue: initial rep value
 * - min: minimum allowed number
 * - max: maximum allowed number
 * - index: which set this input belongs to
 * - sets: current array of rep counts
 * - update: function called with updated rep count array
 */
    const [value,setValue] = useState(props.defaultValue)
    const [error,setError] = useState(null)
    const [showError,setShowError] = useState(false)
    

    
  useEffect(() => {
  if (!error) return;
  const timer = setTimeout(() => setShowError(false), 500)
  return () => clearTimeout(timer)
}, [error])


    function reduceReps(){
      var newValue = Math.max(props.min,Number(value)-1)
      props.update(props.index,newValue)
      setValue(newValue)
    }
    function increaseReps(){
      var newValue = Math.min(props.max,Number(value)+1)
      props.update(props.index,newValue)
      setValue(newValue)
    }

function setReps(e) {
  var newValue = e.target.value

  if (newValue === "") {
    setValue("")
    return
  }

  const parsed = Number(newValue)
  if (Number.isNaN(parsed)) {
    return
  }
  
  newValue = Math.max(props.min,Math.min(props.max,parsed)) 
  props.update(props.index,newValue)
  setValue(newValue)
}
    return (
   <div className={styles.number_input} style={error?{border: "solid thin red"}:null}>
    {showError?<div className={styles.input_error}> {error.message}</div>:null}
    <button name='sub' onClick={reduceReps}>-</button>
    <input 
    type='text'
    inputMode='numeric'
    pattern='[0-9]*'
    value={value}
    onChange={setReps}
    onBlur={
      ()=>{
            /* this onBlur deals with case where user leaves box empty and clicks out*/
        if(value === "") {
          props.update(props.index,props.min)
          setValue(props.min)

        }
        }
      }
    /> 
    <button name="add" onClick={increaseReps}>+</button>
    </div>
    )
}

export function SetsInput(props){
/**
 * Props for RepsInput:
 * - defaultValue: initial rep value
 * - min: minimum allowed number
 * - max: maximum allowed number
 * - index: which set this input belongs to
 * - sets: current array of rep counts
 * - update: function called with updated rep count array
 */
    const [value,setValue] = useState(props.defaultValue)
    const [error,setError] = useState(null)
    const [showError,setShowError] = useState(false)
    

    
  useEffect(() => {
  if (!error) return;
  const timer = setTimeout(() => setShowError(false), 500)
  return () => clearTimeout(timer)
}, [error])


    function reduceSets(){

      var newValue = Math.max(props.min,Number(value)-1)
      if (newValue === value) return
      var newSetsArray = [...props.sets]
      newSetsArray.pop()
      props.update(newSetsArray)
      setValue(newValue)
    }
    function increaseSets(){
      var newValue = Math.min(props.max,Number(value)+1)
      if (newValue === value) return
      var newSetsArray = [...props.sets]
      newSetsArray.push(1)
      props.update(newSetsArray)
      setValue(newValue)
    }


    return (
   <div className={styles.number_input} style={error?{border: "solid thin red"}:null}>
    {showError?<div className={styles.input_error}> {error.message}</div>:null}
    <button name='sub' onClick={reduceSets}>-</button>
    <p className={styles.set_value}>{value}</p>
    <button name="add" onClick={increaseSets}>+</button>
    </div>
    )
}