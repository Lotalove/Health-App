import { Navbar } from "./Navbar"
import styles from '../styles/planner.module.css'
import arrow_left from '../media/icons/arrow-left.svg'
import arrow_right from '../media/icons/arrow-right.svg'
import { useContext, useState } from "react"
import { WorkoutBuilder } from "./WorkoutBuilder"
import AuthContext from "../context/Authprovider"


function Day(props){
    var [isSelected,setSelected] = useState(false)
    var event_popup = (
    <div 
    onClick={()=>{setSelected(!isSelected)}} 
    className={styles.calendar_event}>
        Workout
    </div>)
    
    return(
        <div onClick={()=>{
            if (!isSelected) if(props.date)setSelected(!isSelected)
        }}
        className= {styles.calendar_day}
         key={props.date}>

             <h6 className={styles.calendar_date_label} id={props.isToday?styles.today:null}>{props.day}</h6>
              {props.routineInfo?event_popup:null}
              
              {isSelected &&(
            <div id={styles.background_overlay}>
            <div id={styles.calendar_event_popup}>
            <p id={styles.popup_close} 
            onClick={()=>{setSelected(!isSelected)}}    
            >X</p>
            <WorkoutBuilder close ={()=>{setSelected(false)}} date={props.date} routineInfo={props.routineInfo?props.routineInfo:[]}></WorkoutBuilder>
          </div>
          </div>
        )}
        </div>
    )
}

function Calendar(){
var [view_mode,set_view_mode] = useState('month')
var [range,setRange] = useState(new Date())
var month_list = ["January","February","March","April","May","June","July","August","September","October","November","December"]
var {auth} = useContext(AuthContext)



var calendar_head = (
    <div id={styles.calendar_head}>
    
    <h2>{month_list[range.getMonth()] + " " + range.getFullYear()}</h2>
    
    <img  
    onClick ={()=>{
        setRange(new Date(range.getFullYear(),range.getMonth()-1), range.getDate())
        
    }} 
    src={arrow_left}></img>
    <img 
    onClick ={()=>{
        setRange(new Date(range.getFullYear(),range.getMonth()+1), range.getDate())
        
    }} src = {arrow_right}></img>

    <select onChange={(event) => set_view_mode(event.target.value)}>    
        <option value='month'>Month</option>
        <option value='week'>Week</option>
        <option value='day'>Day</option>
    </select>

    </div>
)

function findEventOnDate(date){
    let routines = auth.routines
    
   let routineDay = date.toISOString().split('T')[0];
   
   for(let i = 0;i<routines.length;i++){
    if(routineDay === routines[i].date) {return {routine:routines[i],routineIndex:i}}
    
   }
   return false
     
}
const render_day_cells = ()=>{
    if(view_mode == 'month'){

        var days = []
        var date_to_add= new Date(range.getFullYear(),range.getMonth()) //gets the first of the month
        var day_of_week = date_to_add.getDay()

        // adds a blank day if the month does not start on this day of the week
        for(var i = 0; i < day_of_week; i++ ){
            days.push(<Day></Day>)
        }
        var currentDate = date_to_add
        while(date_to_add.getMonth() == range.getMonth()){
    
        var date = date_to_add.getDate()
       var today = new Date()
       today = new Date(today.getFullYear(),today.getMonth(),today.getDate())
        var isToday = (today.toString() == currentDate.toString())
        days.push(
            <Day id={date}
            isToday={isToday}
           routineInfo ={findEventOnDate(currentDate)}
           day={date} // todo later: the date variable is actually the day so change
           date={date_to_add.toISOString().split('T')[0]}> 
         
           </Day>
             )    
        date_to_add.setDate(date_to_add.getDate()+1)
        currentDate = date_to_add
  
        }
        return days
    }
}

const render_day_lables = () => {
    const days = [];
    const date = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className={styles.calendar_day_label} key={i}>
          {date[i]}
        </div>
      );
    }
    return days;
}

return(
    <div id={styles.calendar}> 
        {calendar_head}
        <div className={styles.calendar_body}>
        {render_day_lables()}
        {render_day_cells()}
        </div>
    </div>
)
}

export function Planner(){
    return (
    <div>
        <Navbar></Navbar>
        <Calendar></Calendar>

    </div>
    )
}