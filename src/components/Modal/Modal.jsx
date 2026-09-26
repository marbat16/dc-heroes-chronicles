import { Link } from "react-router-dom";
import styles from "./Modal.module.css";

export default function Modal({ character, onClose }) {
  if (!character) return null;
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>
          x
        </button>
        <div className={styles.modalImageWrapper}>
          <img
            src={
              character.image?.medium_url ||
              "https://placehold.co/300x400/333/white?text=No+Image"
            }
            alt={character.name}
            className={styles.modalImage}
          />
        </div>
        <div className={styles.modalBody}>
          <h2 className={styles.modalName}>{character.name}</h2>
          <p className={styles.modalDescription}>
            {character.deck || "Описание отсутствует"}
          </p>
          <Link
            to={`/character/4005-${character.id}`}
            className={styles.modalLink}
            onClick={onClose}
          >
            Go to the timeline
          </Link>
        </div>
      </div>
    </div>
  );
}
