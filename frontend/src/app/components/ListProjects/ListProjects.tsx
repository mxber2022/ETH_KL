"use client";

import React, { useEffect, useState, useCallback, useContext } from 'react';
import styles from './ListProjects.module.css';
import { Identity } from "@semaphore-protocol/core"

interface Project {
  name: string;
  tagline: string;
}

const ListProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [betAmounts, setBetAmounts] = useState<{ [key: number]: string }>({});

  const [jsonData, setJsonData] = useState<any>(null);
  //const [error, setError] = useState<string | null>(null);
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




  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      try {
        const fileContent = await file.text(); // Read file content as text
        const json = JSON.parse(fileContent); // Parse the JSON content
        setJsonData(json);
        setError(null);
      } catch (err) {
        setError('Invalid JSON file.');
        setJsonData(null);
      }
    }
  };

  const handleUpload = async () => {
    // Implement your upload logic here
   // console.log('Uploading JSON data:', jsonData);
    
    const privateKey = localStorage.getItem("identity");
    const identity = new Identity()
    localStorage.setItem("identity", identity.privateKey.toString())

    //const file = event.target.files?.[0];
   // const fileContent = await file?.text();

    let response = await fetch("api/prove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        
        body: JSON.stringify({
          //@ts-ignore
            "proof": jsonData,
            "identityCommitment": {
                "commit": identity.commitment.toString()
            }
        })
    })

    if (response.status === 200) {
       
        let data = await response.json()
        localStorage.setItem("signature", data.signature.toString())
    } else {
        console.log("Some error occurred, please try again!")
    }
  };

  return (
    <>
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

      <div>
      <h1>Upload JSON File</h1>
      <input type="file" accept=".json" onChange={handleFileChange} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {jsonData && (
        <div>
          <h2>Uploaded JSON Data:</h2>
          {/* <pre>{JSON.stringify(jsonData, null, 2)}</pre> */}
          <button onClick={handleUpload}>Upload</button>
        </div>
      )}
    </div>
    </>
  );
};

export default ListProjects;
