import { useEffect, useState } from "react";
import styles from "../../styles/tracker.module.css";

export function TrackerInput({ index, update, saved }) {
  const [selectedValue, setSelectedValue] = useState(saved ?? "");

  useEffect(() => {
    setSelectedValue(saved ?? "");
  }, [saved]);

  function handleChange(e) {
    const newValue = e.target.value;

    if (newValue === "") {
      setSelectedValue("");
      return;
    }

    const numeric = Number(newValue);
    if (!Number.isNaN(numeric) && numeric <= 1000) {
      setSelectedValue(numeric);
      update(index, numeric);
    }
  }

  return <input className={styles.inputs} value={selectedValue} onChange={handleChange} type="number" />;
}
