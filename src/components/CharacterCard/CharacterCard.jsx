import styles from "./CharacterCard.module.css"; 

export default function CharacterCard({ name, image, id, onClick }) {
  return (
    <div className={styles.card} onClick={onClick}>
      <img
        src={image}
        alt={name}
        loading="lazy"
        className={styles.image}
      />
      <h3 className={styles.title}>{name}</h3>
    </div>
  );
}