import { useState,useRef} from "react";
import {search,searchByID} from '../../utils/json-search'
import { StrengthExerciseCard } from "./ExerciseCard";

import styles from './searchMenu.module.css'
export function SearchMenu({ close, addExercise }) {
  const search_input = useRef(null);
  const [search_results, setSearchRes] = useState([]);
  const debounceTimeout = useRef(null);

  function handleSearch() {
    const results = search(search_input.current.value.toLowerCase()) || [];
    const normalized = results.map((result) => ({ ...result, reps: result.reps ?? [1] }));
    setSearchRes(normalized);
  }

  function updateSearchResultSets(index, sets) {
    setSearchRes((previous) =>
      previous.map((item, idx) => (idx === index ? { ...item, reps: sets } : item))
    );
  }

  return (
    <div id={styles.search_menu}>
      <div id={styles.search_bar}>
        <input
          onChange={() => {
            if (debounceTimeout.current) {
              clearTimeout(debounceTimeout.current);
            }
            debounceTimeout.current = setTimeout(() => {
              handleSearch();
            }, 300);
          }}
          ref={search_input}
          type="search"
        />
        <p onClick={close} id={styles.search_close}>
          X
        </p>
      </div>
      <div className={styles.exercise_list}>
        {search_results.length > 0
          ? search_results.map((result, idx) => (
              <StrengthExerciseCard
                key={result.id ?? idx}
                exerciseInfo={result}
                index={idx}
                addExercise={addExercise}
                updateSet={updateSearchResultSets}
              />
            ))
          : null}
      </div>
    </div>
  );
}
