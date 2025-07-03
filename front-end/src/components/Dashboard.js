import { Link } from 'react-router-dom';
import { Navbar } from "./Navbar"
// import MyThree from "./three_sample" wil be used for avatar led workouts
import styles from '../styles/dashboard.module.css'
import data_icon from '../media/icons/bar-chart.svg'
import calendar_icon from '../media/icons/calendar.svg'
import account_icon from '../media/icons/user.svg'
import AuthContext from "../context/Authprovider"
import { useContext, useEffect, useState } from 'react';
import { WorkoutViewer } from './WorkoutViewer';
import { getNextRoutine } from '../utils/getRoutine';
import { supabase } from '../api/supabaseClient';

function Block(props){

return(
    <Link to={props.url} state={props.state} className={styles.block}>
        <h3 className={styles.block_title}>{props.title}</h3>
        {props.icon?<img className={styles.block_icon} src={props.icon}/> : null}
        {props.content?props.content:null}
    </Link>
)
}


export function Dashboard (){
    var [routine,setRoutine] = useState(null)
    var TW = getNextRoutine(routine)
    const [fetchError,setFetchError] = useState(null)
    useEffect(()=>{
        const fetchRoutines = async ()=>{
            const {data,error} = await supabase
            .from("Routines")
            .select()
            if(error){setFetchError(error)}
            if(data){
                setRoutine(data)
            }
        }
        fetchRoutines()
    },[])



    var todays_workout = <Block title="Log Next Workout" url={"/track"}  state ={TW} content={TW?<WorkoutViewer routine={TW}></WorkoutViewer>:<p>No Future Workouts Scheduled, Click to log unschedueld workout</p>}></Block>
    var goal_tracking = <Block title = "Goal Tracking" icon= {data_icon}></Block>
    var calendar = <Block url = "/plan" title='Planner' icon={calendar_icon}></Block>
    var account = <Block title='Account' icon = {account_icon}></Block>
    
    var widgets= [todays_workout,goal_tracking,calendar,account]
    
    return (
        <div>
        <Navbar></Navbar>
        {fetchError?<p>there was an issue retrieving data</p>:null}
        <div id= {styles.widgets_container}>
        {widgets}
        </div>
        </div>
    )
}