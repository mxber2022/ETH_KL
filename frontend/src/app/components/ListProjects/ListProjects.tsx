"use client";

import React, { useEffect, useState } from 'react';
import styles from './ListProjects.module.css';

interface Project {
  name: string;
  tagline: string;
}

const ListProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [betAmounts, setBetAmounts] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        const projectList = data.hits.hits.map((project: any) => ({
          name: project._source.name,
          tagline: project._source.tagline,
        }));
        setProjects(projectList);
      } catch (err: any) {
        setError(err);
      }
    };

    fetchProjects();
  }, []);

  const handleBetChange = (index: number, value: string) => {
    setBetAmounts((prev) => ({ ...prev, [index]: value }));
  };

  const handleVote = (index: number) => {
    const amount = betAmounts[index] || '0'; // Default to '0' if no input
    // Implement vote functionality here
    console.log(`Voted for ${projects[index].name} with amount: ${amount}`);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.cardContainer}>
      {projects.map((project, index) => (
        <div key={index} className={styles.card}>
          <h3 className={styles.cardTitle}>{project.name}</h3>
          <p className={styles.cardTagline}>{project.tagline}</p>
          <div className={styles.betContainer}>
            <input
              type="number"
              className={styles.betInput}
              value={betAmounts[index] || ''}
              onChange={(e) => handleBetChange(index, e.target.value)}
              placeholder="Amount"
            />
            <button
              className={styles.voteButton}
              onClick={() => handleVote(index)}
            >
              Vote
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListProjects;
