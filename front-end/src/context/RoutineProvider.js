import { supabase } from "../api/supabaseClient";
import { createContext, useState } from "react";
const RoutinesContext = createContext();

export const RoutinesProvider = ({ children }) => {
  const [routines, setRoutines] = useState([]);
  
  const fetchRoutines = async () => {
       const {data,error} = await supabase
       .from("Routines")
       .select()
       if(error){return{success:false,error}}
       if(data){
           setRoutines(data)
       }
    
  };

  const createRoutine = async (routine) => {
  
    const {data,error} = await supabase
    .from("Routines")
    .insert(routine)
    .select()
    if(error) {console.log(error)}
    if(data){setRoutines([...routines ,data[0]])} //addRoutine(data[0])
    
  };

  const updateRoutine = async (updatedRoutine,id) => {
    console.log("updating the routine")
    const {data,error} = await supabase
    .from('Routines')
    .update({exercises:updatedRoutine.getExIDList(),reps:updatedRoutine.getRepsList()})
    .eq('id',id)
    .select()
    if(error){console.log(error)}
    if(data) {
        setRoutines( 
          routines.map((r) => r.id == id ? data[0] : r)
    ); 
      }
  };

  const deleteRoutine = async (id) => {
    const {data,error} = await supabase
    .from('Routines')
    .delete()
    .eq('id',id)
    .select()
    if(error){alert(error.message)}
    if(data) {
      setRoutines(prev => prev.filter(r => r.id !== id));
    }
  };


  return (
    <RoutinesContext.Provider value={{ routines, createRoutine, updateRoutine, deleteRoutine, fetchRoutines }}>
      {children}
    </RoutinesContext.Provider>
  );
};

export default RoutinesContext;
