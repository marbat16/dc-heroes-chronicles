import { Link } from "react-router-dom";

export default function CharacterCard({ name, image, id, onClick }) {
  return (
    // <Link
    //   to={`/character/${id}`}
    //   style={{ textDecoration: "none", color: "inherit" }}
    // >
    <div
      onClick={onClick}
      style={{
        padding: "16px",
        border: " 1px solid #ddd",
        textAlign: "center",
        borderRadius: "8px",
        width: "250px",
        transition: "transform 0.2s",
        cursor: "pointer",
      }}
    >
      <img
        src={image}
        alt={name}
        loading="lazy"
        style={{
          borderRadius: "4px",
          width: "100%",
          height: "200px",
          objectFit: "cover",
        }}
      />
      <h3>{name}</h3>
    </div>
  );
}
