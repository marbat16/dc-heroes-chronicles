const API_KEY = import.meta.env.VITE_API_KEY;

export const getCharacters = async (limit = 10) => {
  const response = await fetch(
    `/api/characters/?api_key=${API_KEY}&format=json&field_list=id,name,image,deck,publisher&limit=${limit}&filter=date_last_updated,publisher:DC`,
  );

  const data = await response.json();
  return data.results;
};

export const getCharacterByID = async (id) => {
  const response = await fetch(
    `/api/character/${id}/?api_key=${API_KEY}&format=json&field_list=publisher,id,name,image,deck,api_detail_url,issue_credits`,
  );

  const data = await response.json();
  return data.results;
};

export const getIssueById = async (ID) => {
  try {
    const respons = await fetch(
      `/api/issue/${ID}/?api_key=${API_KEY}&format=json&field_list=id,name,cover_date,image`,
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
      `/api/search/?api_key=${API_KEY}&format=json&query=${query}&resources=character`,
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
