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

  const addRoutine = (routine) => {
    setRoutines([... routines, routine]);
    console.log(routine)
  };

  const updateRoutineLocally = (updatedRoutine) => {
    setRoutines(prev => 
      prev.map(r => r.id === updatedRoutine.id ? updatedRoutine : r)
    );
  };

  const deleteRoutine = (id) => {
    setRoutines(prev => prev.filter(r => r.id !== id));
  };


  return (
    <RoutinesContext.Provider value={{ routines, addRoutine, updateRoutineLocally, deleteRoutine, fetchRoutines }}>
      {children}
    </RoutinesContext.Provider>
  );
};

export default RoutinesContext;
