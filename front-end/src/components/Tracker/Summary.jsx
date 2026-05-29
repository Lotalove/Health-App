import { useNavigate } from "react-router-dom";
import styles from "../../styles/tracker.module.css";

export function Summary({ routine }) {
  const navigate = useNavigate();
  const muscleGroups = new Set();
  let totalVolume = 0;

  routine?.forEach((exercise) => {
    if (exercise.primaryMuscles?.length > 0) {
      muscleGroups.add(
        exercise.primaryMuscles[0].charAt(0).toUpperCase() + exercise.primaryMuscles[0].slice(1)
      );
    }
    exercise.weights?.forEach((weight) => {
      if (typeof weight === "number") {
        totalVolume += weight;
      }
    });
  });

  return (
    <div>
      <div id={styles.workout_summary}>
        <h1>Workout completed, good work!</h1>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h2 style={{ marginLeft: "8px", textAlign: "left", width: "fit-content" }}>
            Workout Summary:
          </h2>
          <h3
            onClick={() => navigate("/dashboard")}
            style={{ marginLeft: "auto", cursor: "pointer", marginRight: "8px" }}
          >
            Back Home
          </h3>
        </div>
        <p>
          <b>Muscles Trained: </b> {[...muscleGroups].join(", ")}
        </p>
        <p>
          <b>Total Volume: </b> {totalVolume} lbs
        </p>
      </div>
      <div id="background_overlay"></div>
    </div>
  );
}
