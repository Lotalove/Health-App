import { useEffect, useState, useRef, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "../Navbar";
import styles from "../../styles/tracker.module.css";

import { searchByID } from "../../utils/json-search";
import { SearchMenu } from "../WorkoutBuilder/SearchMenu";
import { getTodaysDate } from "../../utils/getDate";
import useAuth from "../../hooks/useAuth";
import RoutineContext from "../../context/RoutineProvider";
import { ExerciseTable } from "./ExerciseTable";
import { Summary } from "./Summary";

export function Tracker() {
  const { auth } = useAuth();
  const { createRoutine, updateRoutine, deleteRoutine } = useContext(RoutineContext);
  const location = useLocation();
  const [routine, setRoutine] = useState([]);
  const [isAdding, setAdding] = useState(false);
  const [isFinished, setFinished] = useState(false);
  const [confirmState, setConfirmState] = useState("No");
  const routineRef = useRef(routine);
  const date = location.state?.date ?? getTodaysDate();

  useEffect(() => {
    if (!location.state) return;
    convertRoutine(location.state);
  }, [location.state]);

  async function saveWorkout() {
    const isNew = !location.state;

       var exercises = routine.map((exercise)=>{
            return exercise.id
        })
        var reps = routine.map((exercise)=>{
            return exercise.reps
        })
        var newRoutine = {date,exercises:exercises,reps:reps,weight_matrix:null,completion_matrix:null,user_id:auth.user.id}
        
    if (isNew) {
      await createRoutine(newRoutine);
    } else {
      if (routine.length === 0) {
        await deleteRoutine(newRoutine,location.state.id);
      } else {
        await updateRoutine(newRoutine, location.state.id);
      }
    }

    setFinished(true);
  }

  function convertRoutine(savedRoutine) {
    const newExercises = savedRoutine.exercises.map((exerciseId, index) => {
      const exerciseObj = searchByID(exerciseId);
      exerciseObj.reps = savedRoutine.reps[index];
      exerciseObj.weights = savedRoutine.weight_matrix?.[index] ?? new Array(exerciseObj.reps?.length ?? 1).fill(null);
      exerciseObj.completions = savedRoutine.completion_matrix?.[index] ?? new Array(exerciseObj.reps?.length ?? 1).fill(false);

      return exerciseObj;
    });

    console.log(newExercises)
    setRoutine(newExercises);
    routineRef.current = newExercises;
  }

  function closeSearchMenu() {
    setAdding(false);
  }

  function addExercise(exercise) {
  
    const nextExercise = {
      ...exercise,
      reps: exercise.reps ?? [1],
      weights: exercise.weights ?? new Array(exercise.reps?.length ?? 1).fill(null),
      completions: exercise.completions ?? new Array(exercise.reps?.length ?? 1).fill(false),
    };

  
    setRoutine([...routine,nextExercise]);
    setAdding(false);
  }


 function removeExercise(exerciseIndex) {
  var newRoutine = routine.filter((_, index) => index !== exerciseIndex);
  
  setRoutine(newRoutine);
}

  function updateExerciseReps(exerciseIndex, reps) {
    var newRoutine = [...routine];
    newRoutine[exerciseIndex].reps = reps;
    setRoutine(newRoutine)
  }

  function updateExerciseWeights(exerciseIndex, weights) {
    var newRoutine = [...routine];
    newRoutine[exerciseIndex].weights = weights;
    setRoutine(newRoutine)
    
  }

  function updateExerciseCompletions(exerciseIndex, completions) {
    var newRoutine = [...routine];
    newRoutine[exerciseIndex].setCompletion = completions;
    setRoutine(newRoutine)
  }

  return (
    <div id={styles.trackerPage}>
      <Navbar />
      {isFinished ? <Summary routine={routine} /> : null}
      <div className={styles.tracker}>
        <div id={styles.trackerHeader}>
          <h3>Tracking workout</h3>
          <div id={styles.finishButtonContainter}>
            {confirmState === "Pending" ? (
              <button
                id={styles.cancelButton}
                onClick={() => {
                  setConfirmState("No");
                }}
              >
                Cancel
              </button>
            ) : null}
            {confirmState === "No" ? (
              <button id={styles.finishButton} onClick={() => setConfirmState("Pending")}>Finish Workout</button>
            ) : (
              <button id={styles.finishButton} onClick={saveWorkout}>Finish Workout</button>
            )}
          </div>
        </div>
        <h4>{date}</h4>
        {routine.map((exercise, index) => (
          <ExerciseTable
            key={exercise.id ?? index}
            exIndex={index}
            exercise={exercise}
            removeExercise={removeExercise}
            updateReps={updateExerciseReps}
            updateWeights={updateExerciseWeights}
            updateCompletions={updateExerciseCompletions}
          />
        ))}
      </div>
      {isAdding ? <SearchMenu close={closeSearchMenu} addExercise={addExercise} /> : null}
      <button disabled={isFinished} id={styles.addButton} onClick={() => setAdding(true)}>
        Add Exercise
      </button>
    </div>
  );
}
