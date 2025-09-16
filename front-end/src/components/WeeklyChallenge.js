import { useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";
import { Navbar } from "./Navbar";
import styles from "../styles/challanges.module.css";

function ChallengeOptions() {
  return (
    <div>
        <p>Light walker</p>
    </div>
  )
}

export function WeeklyChallenge() {
  const [challenges,setChallanges] = useState([])
  const [completedChallenges, setCompletedChallenges] = useState([])
  const [week,setWeek] = useState(1)
  const [thisWeekChallenges,setThisWeekChallenges] = useState([])
  async function handleChallengeCompletion(index) {
  
    const updatedCompletedChallenges = [...completedChallenges];

    updatedCompletedChallenges[index] = !updatedCompletedChallenges[index];
    setCompletedChallenges(updatedCompletedChallenges);
  const { data, error } = await supabase
  .from("Challange_Progress")
  .upsert(
    {
      challenge_name: "light walker",
      completions: updatedCompletedChallenges,
    },
    {
    onConflict: ["user_id", "challenge_name"], // composite constraint
    }).select();
  if (error) {
    console.error(error);
  } else {
    console.log("Challenge progress updated:", data);

  
  }
   
  
  }


 useEffect(() => {
    const getChallengeData = async () => {
      const { data, error } = await supabase.from("Challenges").select("*");
      if (error) {
        console.error("Error fetching challenge data:", error);
      } else {
        setChallanges(data);
        // Initialize with false values, but don't overwrite if progress exists
        setCompletedChallenges(new Array(data.length).fill(false));
        console.log(data);

        // Now, fetch and apply user progress
        const getChallengeProgress = async () => {
          const { data: progressData, error: progressError } = await supabase
            .from("Challange_Progress")
            .select("*")
            .eq("challenge_name", "light walker")
            .limit(1);
          if (progressError) {
            console.error("Error fetching challenge progress:", progressError);
          } else if (progressData) {
            console.log(progressData)
            if (progressData.length == 0){
              var weekOfChallange = 1
            
            }
            else{
              setCompletedChallenges(progressData[0].completions);
            var weekOfChallange = Math.floor((new Date() - new Date(progressData[0].started_at)) / (1000 * 60 * 60 * 24 * 7))+1;
          }
          
            setWeek(weekOfChallange)
            setThisWeekChallenges(
              
            data.filter((challenge, idx) => {
              challenge.idx = idx; // mutates the object (not always ideal)
              return challenge.week === weekOfChallange;
            })
          )

          }

        };
        getChallengeProgress();
      }
    };

    getChallengeData();
  }, []);


  function goToLastWeek() {
    if (week > 1) {
      setWeek(week - 1);
      setThisWeekChallenges(challenges.filter((challenge) => challenge.week === week - 1))
    }
  }

  function goToNextWeek() {
    setWeek(week + 1);
    setThisWeekChallenges(challenges.filter((challenge) => challenge.week === week + 1))
  }
  return (

    <div>
        <Navbar />        
      <h2>Weekly Challenge</h2>
      <p>Complete the tasks below to earn points!</p>
      <div className={styles.challengeList}>
        <div className={styles.challengeHeader}>
          <button onClick={goToLastWeek}> - </button>
          <p> Week {week}</p>
          <button onClick={goToNextWeek}>+</button>
        </div>
        {thisWeekChallenges.map((challenge) => {
        return <div 
        className={styles.challengeItem}
         key={challenge.id+challenge.program}
         onClick={() => {handleChallengeCompletion(challenge.idx)}}
         >
          <label >{challenge.title}</label>
          <input type="checkbox" 
          readOnly 
          checked={completedChallenges[challenge.idx]} />
          </div>
  })}
        
      </div>
    </div>
  );
}

