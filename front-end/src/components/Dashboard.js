import { Link } from 'react-router-dom';
import { Navbar } from "./Navbar"
// import MyThree from "./three_sample" wil be used for avatar led workouts
import styles from '../styles/dashboard.module.css'
import data_icon from '../media/icons/bar-chart.svg'
import calendar_icon from '../media/icons/calendar.svg'
import account_icon from '../media/icons/user.svg'
import AuthContext from "../context/Authprovider"
import { useContext, useEffect } from 'react';
import { WorkoutViewer } from './WorkoutViewer';

function Block(props){

return(
    <Link to={props.url} className={styles.block}>
        <h3 className={styles.block_title}>{props.title}</h3>
        {props.icon?<img className={styles.block_icon} src={props.icon}/> : null}
        {props.content?props.content:null}
    </Link>
)
}


export function Dashboard (){
    var {auth} = useContext(AuthContext)
    var TW = auth.routines[0]

   console.log(auth) 
   
    var todays_workout = <Block title="Todays Workout" content={<WorkoutViewer routine={auth.routines[0]}></WorkoutViewer>}></Block>
    var goal_tracking = <Block title = "Goal Tracking" icon= {data_icon}></Block>
    var calendar = <Block url = "/plan" title='Planner' icon={calendar_icon}></Block>
    var account = <Block title='Account' icon = {account_icon}></Block>
    
    var widgets= [todays_workout,goal_tracking,calendar,account]
    
    return (
        <div>
        <Navbar></Navbar>
        <div id= {styles.widgets_container}>
        {widgets}
        </div>
        </div>
    )
}