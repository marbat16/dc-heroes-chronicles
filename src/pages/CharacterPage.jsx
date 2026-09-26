import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCharacterByID, getIssueById } from "../utils/api";
import IssueCard from "../components/IssueCard/IssueCard";
import universesData from "../data/universesData.json";
import styles from "./CharacterPage.module.css";
import Header from "../components/Header/Header";
import Loader from "../components/Loader/Loader";

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
  const [isLoadingIssues, setIsLoadingIssues] = useState(true);

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
    setIsLoadingIssues(true);
    const IssuesPart = allIssueIds.slice(offset, offset + 20);
    const newIssues = [];
    for (const id of IssuesPart) {
      try {
        const result = await getIssueById(`4000-${id}`);
        console.log(result);
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

        if (offset + 20 >= allIssueIds.length) {
          return combined.sort(
            (a, b) => new Date(a.cover_date) - new Date(b.cover_date),
          );
        }
        return combined;
      });
    }
    setOffset((prev) => prev + 20);
    setLoadingMore(false);
    setIsLoadingIssues(false);
  };

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const data = await getCharacterByID(id);
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
      if (ids.length === 0) {
        setIsLoadingIssues(false);
      }
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

  if (loading || isLoadingIssues) {
    return (
    <div className={styles.pageWrapper}>
      <Header />
      <div className={styles.content}>
        <Loader text="Loading character..." />
      </div>
    </div>
  );
}

  if (!character) {
    return (
      <>
        <h1>Персонаж не найден</h1>
      </>
    );
  }
  const characterHeader = (
    <div className={styles.characterHeader}>
      <Link to="/" className={styles.backButton}>
        ← Home page
      </Link>
      <h1 className={styles.characterName}>{character.name}</h1>
      {character.deck && (
        <p className={styles.characterDeck}>{character.deck}</p>
      )}
    </div>
  );

  const universeNames = groupedIssue ? Object.keys(groupedIssue) : [];

  let renderIssues;
  if (groupedIssue && universeNames.length > 0) {
    renderIssues = (
      <>
        {characterHeader}
        <div className={styles.tabs}>
          {universeNames.map((name) => (
            <button
              key={name}
              onClick={() => setActiveUnivers(name)}
              className={`${styles.tab} ${activeUnivers === name ? styles.tabActive : ""}`}
            >
              {name}
            </button>
          ))}
        </div>
        <div className={styles.issuesList}>
          {activeUnivers &&
            groupedIssue[activeUnivers]?.map((issue) => {
              return <IssueCard key={issue.id} issue={issue} />;
            })}
        </div>
        {offset < allIssueIds.length && (
          <div className={styles.loadMoreBlock}>
            <p className={styles.progressText}>
              Loaded {loadedIssues.length} of {allIssueIds.length} issues
            </p>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${(loadedIssues.length / allIssueIds.length) * 100}%`,
                }}
              ></div>
            </div>
            <button onClick={loadMoreIssues} className={styles.loadMoreButton}>
              Load more
            </button>
            <p className={styles.hint}>
              To see a more complete timeline, click "Load more"*
            </p>
          </div>
        )}
      </>
    );
  } else {
    renderIssues = <p>Нет выпусков для этого персонажа</p>;
  }

  return (
    <div className={styles.pageWrapper}>
      <Header />
      <main className={styles.content}>{renderIssues}</main>
    </div>
  );
}
