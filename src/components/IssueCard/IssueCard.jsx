import { useEffect, useState } from "react";
import styles from "./IssueCard.module.css";

export default function IssueCard({ issue }) {
  const [checkboxState, setCheckboxState] = useState(false);
  useEffect(() => {
    const issueKey = localStorage.getItem(`read_${issue.id}`);
    setCheckboxState(issueKey === "true");
  }, [issue.id]);

  return (
    <div>
      <img
        src={
          issue.image?.thumb_url ||
          "https://placehold.co/300x400/333/white?text=No+Image"
        }
        alt={issue.name || "Выпуск"}
      />
      <label htmlFor={`read_${issue.id}`}>
        <span
          className={`${styles.statusText} ${checkboxState ? styles.statusVisible : ""}`}
        >
          Прочитано
        </span>
        <input
          type="checkbox"
          id={`read_${issue.id}`}
          checked={checkboxState}
          onChange={(e) => {
            setCheckboxState(e.target.checked);
            localStorage.setItem(`read_${issue.id}`, String(e.target.checked));
          }}
        />
      </label>
      <h3>{issue.name}</h3>
      <p>{issue.cover_date}</p>
    </div>
  );
}
