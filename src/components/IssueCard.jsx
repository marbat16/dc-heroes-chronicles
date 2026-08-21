export default function IssueCard({ issue }) {
  return (
    <div>
      <img
        src={
          issue.image?.medium_url ||
          "https://placehold.co/300x400/333/white?text=No+Image"
        }
        alt={issue.name || "Выпуск"}
      />
      <h3>{issue.name}</h3>
      <p>{issue.cover_date}</p>
    </div>
  );
}
