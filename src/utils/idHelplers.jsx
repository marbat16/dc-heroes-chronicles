export default function getCharacterID(character) {
  if (character.api_detail_url) {
    const parts = character.api_detail_url.split("/").filter(Boolean);
    return parts[parts.length - 1] || null;
  }
  if (character.id) {
    return `4005-${character.id}`;
  }
  return null;
}
