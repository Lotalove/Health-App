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
  const { createRoutine, updateRoutine, deleteRoutine,fetchTodaysRoutine } = useContext(RoutineContext);
  const location = useLocation();
  const [routine, setRoutine] = useState([]);
  const [isAdding, setAdding] = useState(false);
  const [isFinished, setFinished] = useState(false);
  const [confirmState, setConfirmState] = useState("No");
  const routineRef = useRef(routine);
  const date = location.state?.date ?? getTodaysDate();

useEffect(() => {
  // 1. Define one unified async function to handle the logic
  const handleRoutineData = async () => {
    let data;


    if (location.state) {
      data = location.state;
    } else {
      // 3. If not, await the fetch here!
      data = await fetchTodaysRoutine(date); 
    }

    console.log(data);
    
    if (data) {
      convertRoutine(data);
    }
  };


  handleRoutineData();

}, [location.state, date]); 

  async function saveWorkout() {
    const isNew = !location.state;

    const exercises = routine.map((exercise) => exercise.id);
    const reps = routine.map((exercise) => exercise.reps);

    // Preserve explicit null matrices if they are intentionally absent.
    // Otherwise, fall back to the UI values stored on the exercise.
    const weight_matrix = routine.map(
      (exercise) => exercise.weight_matrix ?? exercise.weights ?? null
    );
    const completion_matrix = routine.map(
      (exercise) => exercise.completion_matrix ?? exercise.completions ?? null
    );

    const newRoutine = {
      date,
      exercises,
      reps,
      weight_matrix,
      completion_matrix,
      user_id: auth.user.id,
    };

    if (isNew) {
      await createRoutine(newRoutine);
    } else {
      if (routine.length === 0) {
        await deleteRoutine(newRoutine, location.state.id);
      } else {
        await updateRoutine(newRoutine, location.state.id);
      }
    }

    setFinished(true);
  }

  function convertRoutine(savedRoutine) {
    const newExercises = savedRoutine.exercises.map((exerciseId, index) => {
      const exerciseObj = {
        ...searchByID(exerciseId),
      };

      exerciseObj.reps = savedRoutine.reps[index];

      // Normalize loaded saved data to both UI field names and persistence field names.
      const weights =
        savedRoutine.weight_matrix?.[index] ?? new Array(exerciseObj.reps?.length ?? 1).fill(null);
      const completions =
        savedRoutine.completion_matrix?.[index] ?? new Array(exerciseObj.reps?.length ?? 1).fill(false);

      exerciseObj.weights = weights;
      exerciseObj.weight_matrix = weights;
      exerciseObj.completions = completions;
      exerciseObj.completion_matrix = completions;

      return exerciseObj;
    });

    setRoutine(newExercises);
    routineRef.current = newExercises;
  }

  function closeSearchMenu() {
    setAdding(false);
  }

  function addExercise(exercise) {
    const defaultReps = exercise.reps ?? [1];
    const weights =
      exercise.weights ?? exercise.weight_matrix ?? new Array(defaultReps.length).fill(null);
    const completions =
      exercise.completions ?? exercise.completion_matrix ?? new Array(defaultReps.length).fill(false);

    const nextExercise = {
      ...exercise,
      reps: defaultReps,
      weights,
      weight_matrix: weights,
      completions,
      completion_matrix: completions,
    };

    setRoutine([...routine, nextExercise]);
    setAdding(false);
  }


  function removeExercise(exerciseIndex) {
    const newRoutine = routine.filter((_, index) => index !== exerciseIndex);
    setRoutine(newRoutine);
  }

  function updateExerciseReps(exerciseIndex, reps) {
    const newRoutine = [...routine];
    newRoutine[exerciseIndex].reps = reps;
    setRoutine(newRoutine);
  }

  function updateExerciseWeights(exerciseIndex, weights) {
    const newRoutine = [...routine];
    newRoutine[exerciseIndex].weights = weights;
    newRoutine[exerciseIndex].weight_matrix = weights;
    setRoutine(newRoutine);
  }

  function updateExerciseCompletions(exerciseIndex, completions) {
    const newRoutine = [...routine];
    newRoutine[exerciseIndex].completions = completions;
    newRoutine[exerciseIndex].completion_matrix = completions;
    setRoutine(newRoutine);
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
