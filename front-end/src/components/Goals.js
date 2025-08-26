import {useEffect, useState,useRef} from 'react';
import { supabase } from "../api/supabaseClient";
import { Navbar } from "./Navbar"
import styles from '../styles/Goals.module.css';
import ChevronDown from '../media/icons/arrow_drop_down.svg'
import Trash from '../media/icons/trash.svg' 
import { LineChart, Tooltip,Line, CartesianGrid, XAxis, 
  YAxis, ReferenceLine,ResponsiveContainer } from 'recharts';
import StatusPuck from './ErrorPuck';


function GoalTracking (){
  const [targetDate, setTargetDate] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [Goals, setGoals] = useState([]);
  const [isPlanning, setIsPlanning] = useState(false);
  
  useEffect(() => {
    const fetchGoals = async () => {
      const { data, error } = await supabase
        .from('Goals')
        .select(`
      *,
      Goal_Progress (
        id,
        timeStamp,
        measurement
      )
    `);
      if (error) {
        console.error('Error fetching goals:', error);
      } else {
        setGoals(data);
      }
    }
    fetchGoals();
  }, [])
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const plan = {
      title: 'Lose Weight',
      deadline:targetDate,
      current_value:currentWeight,
      target_value:targetWeight,
    };
  
    const {data,error} = await supabase.from('Goals').insert(plan).select()
    if(error) {console.log('Error creating goal:', error);}
    if(data){
      data[0].Goal_Progress = [{
        timeStamp: new Date().toISOString(),
        measurement: Number(currentWeight)}];
      setGoals([...Goals, data[0]]);
      setIsPlanning(false);
    } 
  

   const {progressData, progressError}  = await supabase.from('Goal_Progress').insert({
      goal_id: data[0].id,
      measurement: Number(data[0].current_value),
      unit:"lbs"
    }).select()
      if (progressError) {
        console.error('Error saving initial weight:', progressError);
      } else {
        console.log('Initial weight saved:', progressData);
        }

  }

  async function deleteGoal(goal) {
  const { data, error } = await supabase.from('Goals').delete().eq('id', goal.id);
  if (error) {console.log('Error deleting goal:', error);}
  else {
    console.log('Goal deleted successfully:', data);
    setGoals((Goals) => Goals.filter((g) => g.id !== goal.id));
  }
}
   var form = (  <div className={styles.modal}>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.form_group}>
            <label htmlFor="goal">Goal(s):</label>
            <select id= {styles.goal}>
                <option value="lose-weight">Lose Weight</option>
            </select>
            
          </div>
          <div className={styles.form_group}>
            <label htmlFor="target-date">Target date:</label>
            <input
              type="date"
              id="target-date"
              placeholder="MM/DD/YYYY"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>
          <div className={styles.form_group}>
            <label htmlFor="current-weight">Current Weight:</label>
            <input
              type="text"
              id="current-weight"
              placeholder="e.g. 160 lbs"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
            />
          </div>
          <div className={styles.form_group}>
            <label htmlFor="target-weight">Target Weight:</label>
            <input
              type="text"
              id="target-weight"
              placeholder="e.g. 140 lbs"
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
            />
          </div>
          <div className={styles.buttons}>
            <button type="button" className= {styles.cancel}>
              Cancel
            </button>
            <button type="submit" className={styles.save}>
              Save
            </button>
          </div>
        </form>
      </div>)
  

  return (
    <div>
    <Navbar></Navbar>
    <div className={styles.container}>
      <button className={styles.create_btn} onClick={() => setIsPlanning(!isPlanning)}>
        Create Plan <span className={styles.plus}>+</span>
      </button>

      {isPlanning?
    form:null
      }
       {Goals.length > 0 ? Goals.map((goal, index) => {
        return (
          <GoalCard key={index} goal={goal} deleteGoal={()=>{deleteGoal(goal)}}/>
        );
       }):null}
    </div>
    </div>
  );
};

export default GoalTracking;

function GoalCard({goal, deleteGoal}) {
  const [isOpen, setIsOpen] = useState(false);
  const [weightHistory, setWeightHistory] = useState(goal.Goal_Progress);
  const weightRef = useRef(null);
  //const data = [{name: 'January' , weight: 159},{name: 'Feb' , weight: 158}, {name: 'March' , weight: 157}, {name: 'April' , weight: 156}, {name: 'May' , weight: 155}];


  async function handleSave() {
    // Here you would typically send the updated weight to your backend or state management
    const { data, error }  = await supabase.from('Goal_Progress').insert({
      goal_id: goal.id,
      measurement: Number(weightRef.current.value),
      unit:"lbs"
    }).select()
      if (error) {
        console.error('Error saving weight:', error);
      } if (data) {
        // Optionally, you can update the chart data or state here
        setWeightHistory([...weightHistory, data[0]]);
      }
  
} 


  function MyChart () {
  if(weightHistory.length===0){return <p>No data to display</p>}
  else{
  return(
    <ResponsiveContainer width="100%" height={300}>
    <LineChart width={800} height={300} data={weightHistory}>
      <CartesianGrid />
      <XAxis 
      dataKey="timeStamp"
      type="category"
      tickFormatter={(tick) => new Date(tick).toISOString().split('T')[0]}
      />
      <YAxis
      label={{ value: 'Weight (lbs)', angle: -90, position: 'insideLeft', fill: '#0072DD' }}
      dataKey="measurement"    
      domain={[goal.target_value-5, (dataMax)=> dataMax +5]}
      allowDataOverflow={true}
       />
      <Line 
      dataKey="measurement"
      stroke="#0072DD"
       />
       <ReferenceLine y={goal.target_value}  stroke='black'  strokeDasharray="5 5" label={{ value: 'Target: ' +  goal.target_value , position: 'top', fill: 'black' }} />
       <Tooltip
  content={({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'white',
          color: '#0072DD',
          border: '1px solid #ccc',
          padding: '5px',
          borderRadius: '4px'
        }}>
          <p>{`Date: ${new Date(label).toISOString().split('T')[0]}`}</p>
          <p>{`Weight: ${payload[0].value} lbs`}</p>
        </div>
      );
    }
    return null;
  }}
/>
    </LineChart>
    </ResponsiveContainer>
)
}
  }

  return (
    <div className={styles.goal_card}>
      <div className={styles.goal_card_header}>
        
      <h3 className={styles.goal_title}>Goal: {goal.title}</h3>
      <img src={Trash} 
      className={styles.trash_icon}
      onClick={deleteGoal}
      />
      </div>
      <p> <b>Deadline:</b> {new Date(goal.deadline).toISOString().split('T')[0]}</p>
      <p> <b>Current Value:</b> {goal.current_value}</p>
      <p> <b>Target Value:</b> {goal.target_value}</p>
      
      <img
        src={ChevronDown}
        onClick={() => setIsOpen(!isOpen)}
        />

        {isOpen?<div>
          <div id={styles.goal_progress_input}>
          <label> Record Weight</label>
          <input 
          type="number" 
          placeholder="Enter Weight in Pounds"
          ref={weightRef}
          />
          <button
          className={styles.goal_progress_button}
          onClick={handleSave}
          >Save</button>
          </div> 
          {<MyChart/>}
          </div>:null}
    </div>
  );
}