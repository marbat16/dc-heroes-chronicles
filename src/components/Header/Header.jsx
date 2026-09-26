import styles from "./Header.module.css";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg"


export default function Header({ searchValue, onSearchChange, showSearch }) {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        <img src={logo} alt="DC Chronicles" className={styles.logoImage} />
      </Link>

      { showSearch && (
      <div className={styles.searchWrapper}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search your hero..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      )}
    </header>
  );
}
