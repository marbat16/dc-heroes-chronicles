import { Link } from "react-router-dom";
import "./Modal.css";

export default function Modal({ character, onClose }) {
  if (!character) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          x
        </button>
        <img
          src={
            character.image?.medium_url ||
            "https://placehold.co/300x400/333/white?text=No+Image"
          }
          alt={character.name}
          className="modal-image"
        />
        <h2 className="modal-name">{character.name}</h2>
        <p className="modal-description">
          {character.deck || "Описание отсутствует"}
        </p>
        <Link
          to={`/character/4005-${character.id}`}
          className="modal-link"
          onClick={onClose}
        >
          Перейти к хронологии
        </Link>
      </div>
    </div>
  );
}
