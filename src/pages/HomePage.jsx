import { useState, useEffect, useRef } from "react";
import CharacterCard from "../components/CharacterCard";
import { getCharacters, searchCharacters } from "../utils/api";
import { Link } from "react-router-dom";
import getCharacterID from "../utils/idHelplers";

export default function HomePage() {
  const [datacharacter, setDatacharacter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    getCharacters(50)
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
        ></CharacterCard>
      );
    });
  } else {
    renderCards = datacharacter.map((character) => {
      return (
        <CharacterCard
          key={character.id}
          name={character.name}
          image={character.image?.medium_url}
          id={getCharacterID(character)}
        ></CharacterCard>
      );
    });
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
    </>
  );
}
