import { useEffect, useState } from "react";
import styles from "../../styles/tracker.module.css";
import { getCardioType } from "../../utils/getExerciseType";
import { TrackerInput } from "./TrackerInput";
import { TimeDurationInput } from "./TimeDurationInput";
import trash_icon from "../../media/icons/trash.svg";

export function ExerciseTable({ exercise, exIndex, removeExercise, updateReps, updateWeights, updateCompletions, origin }) {
  const [sets, setSets] = useState(exercise.reps ?? [1]);
  const [weights, setWeights] = useState(exercise.weights ?? new Array(sets.length).fill(null));
  const [completedArr, setCompletedArr] = useState(exercise.completions ?? new Array(sets.length).fill(false));
  const type = getCardioType(exercise);
  
  useEffect(() => {
    const nextSets = exercise.reps ?? [1];
    setSets(nextSets);
    setWeights(exercise.weights ?? new Array(nextSets.length).fill(null));
    setCompletedArr(exercise.completions ?? new Array(nextSets.length).fill(false));
  }, [exercise]);

  function deleteExercise() {
    removeExercise(exIndex);
  }

  function addSet() {
    const updatedSets = [...sets, 1];
    const updatedWeights = [...weights, null];
    const updatedCompletions = [...completedArr, false];

    setSets(updatedSets);
    setWeights(updatedWeights);
    setCompletedArr(updatedCompletions);
    updateReps(exIndex, updatedSets);
    updateWeights(exIndex, updatedWeights);
    updateCompletions(exIndex, updatedCompletions);
  }

  function removeSet(idx) {
    const updatedSets = [...sets];
    updatedSets.splice(idx, 1);

    const updatedWeights = [...weights];
    updatedWeights.splice(idx, 1);

    const updatedCompletions = [...completedArr];
    updatedCompletions.splice(idx, 1);

    setSets(updatedSets);
    setWeights(updatedWeights);
    setCompletedArr(updatedCompletions);
    updateReps(exIndex, updatedSets);
    updateWeights(exIndex, updatedWeights);
    updateCompletions(exIndex, updatedCompletions);
  }

  function updateSetWeight(index, weight) {
    const nextWeights = [...weights];
    nextWeights[index] = weight;
    console.log("updating weight to: ", weight , " lb(s)")
    setWeights(nextWeights);
    updateWeights(exIndex, nextWeights);
  }

  function updateCompletionArr(index, status) {
    const nextCompletions = [...completedArr];
    nextCompletions[index] = status;
    setCompletedArr(nextCompletions);
    updateCompletions(exIndex, nextCompletions);
  }

  function updateRepsValue(index, reps) {
    const nextSets = [...sets];
    nextSets[index] = reps;
    setSets(nextSets);
    updateReps(exIndex, nextSets);
  }

  const distTableHeaders = (
    <tr>
      <th>Distance (Miles)</th>
      <th>Duration</th>
      <th>Completed?</th>
    </tr>
  );

  const distTableRows = sets.map((reps, index) => (
    <tr key={`distance-${index}`}>
      <td>
        <TrackerInput index={index} saved={reps} update={updateRepsValue} />
      </td>
      <td>
        <TimeDurationInput index={index} saved={weights[index]} update={updateSetWeight} />
      </td>
      <td>
        <input
          type="checkbox"
          checked={completedArr[index]}
          onChange={(e) => updateCompletionArr(index, e.target.checked)}
        />
      </td>
    </tr>
  ));

  return (
    <div className={styles.exTable}>
      <div style={{ display: "inline-block", alignSelf: "flex-start", width: "100%" }}>
        <p className={styles.exerciseLabel}>{exercise.name}</p>
        <div className={styles.exerciseSettings}>
          {origin === "tracker" ?<img 
          className={styles.card_button}
          src={trash_icon}
          alt="Delete exercise"
          onClick={deleteExercise} /> : null}
        </div>
      </div>
      <table>
        <tbody>
        {type === "distance" ? distTableHeaders : (
          <tr>
        
            <th>Reps</th>
            <th>Weight</th>
            { origin === "tracker"?<th>Mark Complete</th>:null}
            <th></th>
          </tr>
        )}
        {type === "distance" ? distTableRows : sets.map((reps, index) => (
          <tr key={`set-${index}`}>
    
            <td>
              <TrackerInput index={index} saved={reps} update={updateRepsValue} />
            </td>
            <td>
              <TrackerInput index={index} saved={weights[index]} update={updateSetWeight} />
            </td>
            {origin === "tracker"? <td>
              <input
                type="checkbox"
                checked={completedArr[index]}
                onChange={(e) => updateCompletionArr(index, e.target.checked)}
              />
            </td>:null
            }
            <td>
              <img 
              className={styles.card_button}
              src={trash_icon}
              alt="Delete Set"
              onClick={()=>{removeSet(index)}} /> </td>
          </tr>
        ))}
        </tbody>
      </table>
      <div onClick={addSet} className={styles.addExercise}>
        + Add Set
      </div>
    </div>
  );
}
