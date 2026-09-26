import { useEffect, useState } from "react";
import styles from "./IssueCard.module.css";

export default function IssueCard({ issue }) {
  const [checkboxState, setCheckboxState] = useState(false);
  useEffect(() => {
    const issueKey = localStorage.getItem(`read_${issue.id}`);
    setCheckboxState(issueKey === "true");
  }, [issue.id]);

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          src={
            issue.image?.thumb_url ||
            "https://placehold.co/300x400/333/white?text=No+Image"
          }
          alt={issue.name || "Выпуск"}
          loading="lazy"
          className={styles.image}
        />
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{issue.name || `#${issue.id}`}</h3>
        <p className={styles.date}>
          {issue.cover_date
            ? new Date(issue.cover_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Date unknown"}
        </p>
        {issue.issue_number && (
          <p className={styles.issueNumber}>#{issue.issue_number}</p>
        )}
      </div>
      <label htmlFor={`read_${issue.id}`} className={styles.readLabel}>
        <span
          className={`${styles.statusText} ${checkboxState ? styles.statusVisible : ""}`}
        >
          Read
        </span>
        <input
          className={styles.checkbox}
          type="checkbox"
          id={`read_${issue.id}`}
          checked={checkboxState}
          onChange={(e) => {
            setCheckboxState(e.target.checked);
            localStorage.setItem(`read_${issue.id}`, String(e.target.checked));
          }}
        />
        <span className={styles.checkboxCustom}></span>
      </label>
    </div>
  );
}
