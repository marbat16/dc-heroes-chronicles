import { useState, useEffect, useRef } from "react";
import CharacterCard from "../components/CharacterCard";
import { getCharacters, searchCharacters } from "../utils/api";
import { Link } from "react-router-dom";
import getCharacterID from "../utils/idHelplers";
import Modal from "../components/Modal/Modal";
import popularCharacters from "../data/popularCharacters.json";

export default function HomePage() {
  const [datacharacter, setDatacharacter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const timerRef = useRef(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  useEffect(() => {
    getCharacters(18)
      .then((data) => {
        console.log("Ответ API:", data);
        const dcCharacters = data.filter(
          (char) => char.publisher?.name === "DC Comics",
        );
        setDatacharacter(dcCharacters);
      })
      .catch((err) => console.error("Ошибка:", err));
  }, []);

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
      });
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

  let renderCards;
  if (request && searchResults.length === 0) {
    renderCards = <p>Персонаж не найден</p>;
  } else if (request && searchResults.length > 0) {
    renderCards = searchResults.map((character) => {
      return (
        <CharacterCard
          key={character.id}
          name={character.name}
          image={character.image?.medium_url}
          id={getCharacterID(character)}
          onClick={() => handleCardClick(character)}
        ></CharacterCard>
      );
    });
  } else {
    renderCards = (
      <>
        <div>
          <h2>Популярные персонажи</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
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
        </div>
        <div>
          <h2>Все персонажи</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
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
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          padding: "20px",
        }}
      >
        <h1>Comic Timeline</h1>
      </div>

      <input
        type="text"
        placeholder="Поиск персонажа..."
        onChange={(e) => setRequest(e.target.value)}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          flexWrap: "wrap",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {renderCards}
      </div>
      <Modal character={selectedCharacter} onClose={handleCloseModal} />
    </>
  );
}
