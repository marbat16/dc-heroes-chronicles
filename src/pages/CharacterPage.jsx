import { Link, useAsyncError, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCharacterByID, getIssueById } from "../utils/api";
import IssueCard from "../components/IssueCard";
import universesData from "../data/universesData.json";
import { all } from "axios";

export default function CharacterPage() {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeUnivers, setActiveUnivers] = useState();
  const [groupedIssue, setGroupedIssue] = useState(null);
  const [offset, setOffset] = useState(0);
  const [allIssueIds, setAllIssuesIds] = useState([]);
  const [loadedIssues, setLoadedIssues] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);

  function issuesUnivers(listIssues, universes) {
    const group = {};
    const other = [];

    listIssues.forEach((issue) => {
      const issueYear = new Date(issue.cover_date).getFullYear();
      let assigned = false;
      for (const universe of universes) {
        if (issueYear >= universe.startYear && universe.endYear === null) {
          if (!group[universe.name]) {
            group[universe.name] = [];
          }
          group[universe.name].push(issue);
          assigned = true;
          break;
        }
        if (issueYear >= universe.startYear && issueYear <= universe.endYear) {
          if (!group[universe.name]) {
            group[universe.name] = [];
          }
          group[universe.name].push(issue);
          assigned = true;
          break;
        }
      }

      if (!assigned) {
        other.push(issue);
      }
    });

    if (other.length > 0) {
      group["Другие"] = other;
    }
    return group;
  }

  const loadMoreIssues = async () => {
    if (loadingMore || offset >= allIssueIds.length) return;
    setLoadingMore(true);
    const IssuesPart = allIssueIds.slice(offset, offset + 10);
    const newIssues = [];
    for (const id of IssuesPart) {
      try {
        const result = await getIssueById(`4000-${id}`);

        if (result && result.id) {
          newIssues.push(result);
        } else {
          console.warn("Выпуск с ID " + `4000-${id}` + " не найден");
        }
      } catch (err) {
        console.error("Ошибка загрузки выпуска:", id, err);
      }
    }
    if (newIssues.length > 0) {
      const sortedNew = newIssues.sort(
        (a, b) => new Date(a.cover_date) - new Date(b.cover_date),
      );
      setLoadedIssues((issues) => {
        const combined = [...issues, ...sortedNew];

        if (offset + 10 >= allIssueIds.length) {
          return combined.sort(
            (a, b) => new Date(a.cover_date) - new Date(b.cover_date),
          );
        }
        return combined;
      });
    }
    setOffset((prev) => prev + 10);
    setLoadingMore(false);
  };

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const data = await getCharacterByID(id);
        console.log("Ищи Publisher", data);
        setCharacter(data);
      } catch (err) {
        console.error("Ошибка загрузки:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCharacter();
  }, [id]);

  useEffect(() => {
    if (character?.issue_credits) {
      const ids = character.issue_credits.map((issue) => issue.id);
      setAllIssuesIds(ids);
      console.log("character.issue_credits:", character.issue_credits);
    }
  }, [character]);

  useEffect(() => {
    if (allIssueIds.length > 0 && loadedIssues.length === 0) {
      loadMoreIssues();
    }
  }, [allIssueIds]);

  useEffect(() => {
    if (loadedIssues.length === 0) return;
    const grouped = issuesUnivers(loadedIssues, universesData);
    setGroupedIssue(grouped);
    if (grouped) {
      if (!activeUnivers || !grouped[activeUnivers]) {
        setActiveUnivers(Object.keys(grouped)[0]);
      }
    }
  }, [loadedIssues]);

  if (loading) {
    return <h1>Загрузка...</h1>;
  }

  if (!character) {
    return (
      <>
        <h1>Персонаж не найден</h1>
      </>
    );
  }

  const universeNames = groupedIssue ? Object.keys(groupedIssue) : [];

  return groupedIssue && universeNames.length > 0 ? (
    <>
      <div>
        {universeNames.map((name) => (
          <button
            key={name}
            onClick={() => setActiveUnivers(name)}
            style={{
              fontWeight: activeUnivers === name ? "bold" : "normal",
              borderBottom:
                activeUnivers === name ? "2px solid #e63946" : "none",
            }}
          >
            {name}
          </button>
        ))}
      </div>
      <div>
        {activeUnivers &&
          groupedIssue[activeUnivers]?.map((issue) => {
            console.log("ID выпуска:", issue.id, issue.name);
            return <IssueCard key={issue.id} issue={issue} />;
          })}
      </div>
      <div>
        {offset < allIssueIds.length && (
          <button onClick={loadMoreIssues}>Загрузить ещё</button>
        )}
      </div>
    </>
  ) : (
    <p>Нет выпусков для этого персонажа</p>
  );
}
