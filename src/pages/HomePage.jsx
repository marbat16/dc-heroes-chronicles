import { useState, useEffect } from "react";
import CharacterCard from "../components/CharacterCard";
import { getCharacters } from "../utils/api";
import { Link } from "react-router-dom";
import getCharacterID from "../utils/idHelplers";

export default function HomePage() {
  const [datacharacter, setDatacharacter] = useState([]);
  const [loading, setLoading] = useState(true);

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
        {datacharacter.map((character) => {
          return (
            <CharacterCard
              key={character.id}
              name={character.name}
              image={character.image?.medium_url}
              id={getCharacterID(character)}
            ></CharacterCard>
          );
        })}
      </div>
    </>
  );
}
