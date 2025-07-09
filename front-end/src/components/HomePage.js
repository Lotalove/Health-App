import logo from '../media/icons/Fittest_Logo.jpg'
import styles from '../styles/home.module.css'
import { useNavigate } from "react-router-dom";

export function HomePage(){
    const navigate = useNavigate();     
    return(
        <div>
           <div id="navbar" style={{backgroundColor:'white'}}>
                   <img id={styles.logo}  src={logo}/>
                   <div id={styles.loginButton}>
                    <button 
                    onClick={()=>{navigate("/login")}}
                    className='button'
                    >Login
                   </button>
                   </div>
            </div>
        <div id={styles.mainBlock}>
            <p id={styles.hook}>Reach Your Goals. Become Your Fittest Self.</p>
            <p id={styles.subHook}>Planning workouts, staying consistent, and tracking progress has never been easier. 
Fittest Self helps you build routines, generate personalized workouts, and stay on track—every step of the way.</p>
            <button
              onClick={()=>{navigate("/login")}}
            > 
            Get Started</button>

            <h1 className={styles.subHeading}>Features</h1>
            <div id={styles.features}>

            <div className={styles.featureBlock}>
                <h3 className={styles.featureBlockTitle}>Plan Workouts</h3>
                <p >Build workout routines choosing from 800+ exercises and stretches</p>
            </div>

             <div className={styles.featureBlock}>
                <h3 className={styles.featureBlockTitle}>Generate  Routines</h3>
                <p >Use our algorithm to generate a workout personalized to your goals and available equipment</p>
            </div>

             <div className={styles.featureBlock}>
                <h3 className={styles.featureBlockTitle}>Track Progress</h3>
                <p>Track your personal records and progress towards your goals.</p>
            </div>

            </div>
</div>
            <h1 className={styles.subHeading}>Demo</h1>
            <video width="80%" muted playsinline autoPlay  controls>
            <source src="vids/Demo.mp4" type="video/mp4"></source>
            </video>

            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
            <link href="https://fonts.googleapis.com/css2?family=Lalezar&display=swap" rel="stylesheet"></link>
        </div>
    )
}