import { useState, useEffect, useRef } from "react";
import Header from "../components/Header/Header";
import CharacterCard from "../components/CharacterCard/CharacterCard";
import { getCharacters, searchCharacters } from "../utils/api";
import getCharacterID from "../utils/idHelplers";
import Modal from "../components/Modal/Modal";
import popularCharacters from "../data/popularCharacters.json";
import styles from "./HomePage.module.css";
import HomePageImage from "../assets/HomePageImage.jpg";

export default function HomePage() {
  const [datacharacter, setDatacharacter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const timerRef = useRef(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const popularRowref = useRef(null);

  useEffect(() => {
    getCharacters(20)
      .then((data) => {
        const dcCharacters = data.filter(
          (char) => char.publisher?.name === "DC Comics",
        );
        setDatacharacter(dcCharacters);
      })
      .catch((err) => console.error("Ошибка:", err));
  }, []);

  // Логика поиска
  useEffect(() => {
    const fetchSearch = async () => {
      const results = await searchCharacters(request);
      setSearchResults(results);
    };
    if (request.trim()) {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        fetchSearch();
        timerRef.current = null;
      }, 200);
    } else {
      setSearchResults([]);
    }
  }, [request]);

  const handleCardClick = (character) => {
    setSelectedCharacter(character);
  };

  const handleCloseModal = () => {
    setSelectedCharacter(null);
  };

  const scrollLeft = () => {
    if (popularRowref.current) {
      popularRowref.current.scrollBy({
        left: -420,
        behavior: "smooth",
      });
    }
  };
  const scrollRight = () => {
    if (popularRowref.current) {
      popularRowref.current.scrollBy({
        left: 420,
        behavior: "smooth",
      });
    }
  };

  let renderCards;
  if (request && searchResults.length === 0) {
    renderCards = <p className={styles.notFound}>Character not found</p>;
  } else if (request && searchResults.length > 0) {
    renderCards = (
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Search results</h2>
        <div className={styles.cardsGrid}>
          {searchResults.map((character) => (
            <CharacterCard
              key={character.id}
              name={character.name}
              image={character.image?.medium_url}
              id={getCharacterID(character)}
              onClick={() => handleCardClick(character)}
            />
          ))}
        </div>
      </div>
    );
  } else {
    renderCards = (
      <>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Popular characters</h2>
          <div className={styles.carouselWrapper}>
            <button
              className={styles.arrowButton}
              onClick={scrollLeft}
              aria-label="Scroll left"
            >
              ‹
            </button>
            <div className={styles.cardsRow} ref={popularRowref}>
              {popularCharacters.map((character) => (
                <CharacterCard
                  key={character.id}
                  name={character.name}
                  image={character.image?.medium_url}
                  id={character.id}
                  onClick={() => handleCardClick(character)}
                />
              ))}
            </div>
            <button
              className={styles.arrowButton}
              onClick={scrollRight}
              aria-label="Scroll right"
            >
              ›
            </button>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Other characters</h2>
          <div className={styles.cardsGrid}>
            {datacharacter.map((character) => (
              <CharacterCard
                key={character.id}
                name={character.name}
                image={character.image?.medium_url}
                id={getCharacterID(character)}
                onClick={() => handleCardClick(character)}
              />
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <Header
        searchValue={request}
        onSearchChange={setRequest}
        showSearch={true}
      />
      <section
        className={styles.hero}
        style={{ backgroundImage: `url(${HomePageImage})` }}
      >
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            DC HEROES CHRONICLES: <br />A GUIDE
          </h1>
        </div>
      </section>
      <main className={styles.mainContent}>{renderCards}</main>

      <Modal character={selectedCharacter} onClose={handleCloseModal} />
    </div>
  );
}
