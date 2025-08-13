import {useEffect, useState,useRef} from 'react';
import { supabase } from "../api/supabaseClient";
import { Navbar } from "./Navbar"
import '../styles/Goals.css';
import ChevronDown from '../media/icons/arrow_drop_down.svg'
import { LineChart, Line, CartesianGrid, XAxis, YAxis,ResponsiveContainer } from 'recharts';

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
    if(error) {console.log(error)}
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
        console.error('Error saving weight:', progressError);
      } else {
        console.log('Weight saved successfully:', progressData);
        // Optionally, you can update the chart data or state here
      }

  }

   var form = (  <div className="modal">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="goal">Goal(s):</label>
            <select id="goal">
                <option value="lose-weight">Lose Weight</option>
                <option value="gain-muscle">Gain Muscle</option>
                <option value="maintain-weight">Maintain Weight</option>
                <option value="improve-endurance">Improve Endurance</option>
                <option value="increase-flexibility">Increase Flexibility</option>
            </select>
            
          </div>
          <div className="form-group">
            <label htmlFor="target-date">Target date:</label>
            <input
              type="date"
              id="target-date"
              placeholder="MM/DD/YYYY"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="current-weight">Current Weight:</label>
            <input
              type="text"
              id="current-weight"
              placeholder="e.g. 160 lbs"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="target-weight">Target Weight:</label>
            <input
              type="text"
              id="target-weight"
              placeholder="e.g. 140 lbs"
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
            />
          </div>
          <div className="buttons">
            <button type="button" className="cancel">
              Cancel
            </button>
            <button type="submit" className="save">
              Save
            </button>
          </div>
        </form>
      </div>)
  

  return (
    <div>
    <Navbar></Navbar>
    <div className="container">
      <button className="create-btn" onClick={() => setIsPlanning(!isPlanning)}>
        Create Plan <span className="plus">+</span>
      </button>
      {isPlanning?
    form:null
      }
       {Goals.length > 0 ? Goals.map((goal, index) => {
        return (
          <GoalCard key={index} goal={goal} />
        );
       }):null}
    </div>
    </div>
  );
};

export default GoalTracking;

function GoalCard({ goal }) {
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
      dataKey="measurement"    
      domain={[(dataMin)=> dataMin -5, (dataMax)=> dataMax +5]}
      allowDataOverflow={true}
       />
      <Line 
      dataKey="measurement"
      stroke="#009fe3"
       />
    </LineChart>
    </ResponsiveContainer>
)
}
  }

  return (
    <div className="goal-card">
      <h3>Goal: {goal.title}</h3>
      <p>Deadline: {goal.deadline}</p>
      <p>Current Value: {goal.current_value}</p>
      <p>Target Value: {goal.target_value}</p>
      
      <img
        src={ChevronDown}
        onClick={() => setIsOpen(!isOpen)}
        />

        {isOpen?<div>
          <div id='goal-progress-input'>
          <label> Record Weight</label>
          <input 
          type="number" 
          placeholder="Enter Weight in Pounds"
          ref={weightRef}
          />
          <button
          className='goal-progress-button'
          onClick={handleSave}
          >Save</button>
          </div> 
          <p>My Chart</p>
          {<MyChart/>}
          </div>:null}
    </div>
  );
}

