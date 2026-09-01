const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "https://comicvine.gamespot.com/api";

export const getCharacters = async (limit = 100) => {
  const startDate = "2010-01-01";
  const endDate = new Date().toISOString().split("T")[0];
  // const response = await fetch(
  //   `https://corsproxy.io/?https://comicvine.gamespot.com/api/characters/?api_key=${API_KEY}&format=json&field_list=id,name,image,deck,publisher&filter=date_last_updated,publisher:DC`,
  // );

  const response = await fetch(
    `https://cors-anywhere.herokuapp.com/https://comicvine.gamespot.com/api/characters/?api_key=${API_KEY}&format=json&field_list=id,name,image,deck,publisher&filter=date_last_updated,publisher:DC`,
  );

  // const response = await fetch(`/api/characters/?api_key=${API_KEY}&format=json&limit=10`)

  // const respons = await fetch(
  //   `${BASE_URL}/characters/?api_key=${API_KEY}&format=json&limit=${limit}&filter=publisher:DC&filed_list=id,name,image,deck`,
  // );

  const data = await response.json();
  return data.results;
};

export const getCharacterByID = async (id) => {
  const response = await fetch(
    `https://cors-anywhere.herokuapp.com/https://comicvine.gamespot.com/api/character/${id}/?api_key=${API_KEY}&format=json&field_list=publisher,id,name,image,deck,api_detail_url,description,issue_credits`,
  );

  const data = await response.json();
  return data.results;
};

export const getIssueById = async (ID) => {
  try {
    const respons = await fetch(
      `https://cors-anywhere.herokuapp.com/https://comicvine.gamespot.com/api/issue/${ID}/?api_key=${API_KEY}&format=json&field_list=id,name,cover_date,image,description,volumes,publisher`,
    );

    const data = await respons.json();
    return data.results;
  } catch (err) {
    console.error("Ошибка:", err);
    return [];
  }
};

export const searchCharacters = async (query) => {
  try {
    const respons = await fetch(
      `https://cors-anywhere.herokuapp.com/https://comicvine.gamespot.com/api/search/?api_key=${API_KEY}&format=json&query=${query}&resources=character`,
    );

    const data = await respons.json();
    const dcCharacters = data.results.filter(
      (char) => char.publisher?.name === "DC Comics",
    );
    return dcCharacters;
  } catch (err) {
    console.error("Ошибка:", err);
    return [];
  }
};
