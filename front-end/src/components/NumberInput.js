import { useEffect, useState,useRef} from 'react'
import styles from '../styles/workout_builder.module.css'

export function SetsInput(props){
  const [value,setValue] = useState(props.defaultValue)
  const [error,setError] = useState(false)
  
  
const handleInputChange = async (e) => {
    const newValue = e.target.value;
    // Optionally, validate input (e.g., ensure it's a number)
    if (!isNaN(newValue) && Number(newValue)<=props.max ) {
      
      setValue(Number(newValue));
    }
    else e.target.value = value
    props.functions.onChange(props.setRef.current.value)
  };
async function handleButtonClick(event){

    if(event.target.name === 'sub'){
        if(value>props.min ) await setValue(value-1)
            
    }
    else{if(value<props.max)await setValue(value+1)}
    props.functions.onChange(props.setRef.current.value)
}
  /*useEffect(() => {
    setValue(props.defaultValue);
    }, [props.defaultValue]);
  */
    return (
   <div className={styles.number_input} style={error?{border: "solid thin red"}:null}>
   
    <button name='sub' onClick={handleButtonClick}>-</button>
    <input ref= {props.setRef} onBlur={()=>{if(value == 0) setError(true); else setError(false)}} value={value} onChange={handleInputChange} type='text'/>
    <button name="add" onClick={handleButtonClick}>+</button>
    </div>
    )
}


export function RepsInput(props){
  const [value,setValue] = useState(props.defaultValue)
  const [error,setError] = useState(false)
  var setRef = useRef(value)
  const debounceTimer = useRef(null);

  const handleInputChange = (e) => {
    const newValue = e.target.value;

    // Validate input
    if (!isNaN(newValue) && newValue <= props.max) {
      const numericValue = Number(newValue);
      setValue(numericValue);

      // Debounce the onChange call
      clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        props.functions.onChange(props.index, numericValue);
      }, 500); // 500ms delay
    }
  };
async function handleButtonClick(event){
  let newCount = value
  if (event.target.name === 'sub' && value > props.min) {
    newCount = value - 1
    setValue(newCount)
    console.log('updating reps')      
    }
    else if (event.target.name === 'add' && value < props.max) {
      newCount = value + 1
    setValue(value+1)
    }
    props.functions.onChange(props.index,Number(newCount))
} 

    return (
   <div className={styles.number_input} style={error?{border: "solid thin red"}:null}>
   
    <button name='sub' onClick={handleButtonClick}>-</button>
    <input  ref ={setRef} onBlur={()=>{if(value == 0) setError(true); else setError(false)}} value={value} onChange={handleInputChange} type='text'/> 
    <button name="add" onClick={handleButtonClick}>+</button>
    </div>
    )
}

export function DurationInput(props){
  const [value,setValue] = useState(props.defaultValue)
  const [error,setError] = useState(false)
  var hourRef = useRef(value/60)
  var minuteRef = useRef(value%60)
  var [time,setTime] = useState(props.defaultValue)


const handleInputChange = async (e) => {
    var changedProperty = e.target.name
    const newValue = Number(e.target.value);
    console.log(newValue)
    if(isNaN(newValue)) console.log('is NaN')
    // Optionally, validate input (e.g., ensure it's a number)
    if (!isNaN(newValue) && newValue<=props.max ) {
        var newTime = Number(hourRef.current.value)*60 + Number(minuteRef.current.value)
        setTime(newTime)  
    }
    props.functions.onChange(props.index,newTime)
  };

    return (
   <div className={styles.number_input} style={error?{border: "solid thin red"}:null}>
    <input name='hours' ref ={hourRef} onBlur={()=>{if(value == 0) setError(true); else setError(false)}} value={Math.floor(time/60)} onChange={handleInputChange} type='tel'/> hours: 
    <input  name='minutes' ref ={minuteRef} onBlur={()=>{if(value == 0) setError(true); else setError(false)}} value={time%60}onChange={handleInputChange} type='tel'/> min 
    </div>
    )

}
