"use client";

import React, { useEffect, useState, useCallback } from "react";
import styles from "./ListProjects.module.css";
import { Identity } from "@semaphore-protocol/core";

interface Project {
  name: string;
  tagline: string;
}

const ListProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [betAmounts, setBetAmounts] = useState<{ [key: number]: string }>({});
  const [jsonData, setJsonData] = useState<any>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        const projectList = data.hits.hits.map((project: any) => ({
          name: project._source.name,
          tagline: project._source.tagline,
        }));
        setProjects(projectList);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchProjects();
  }, []);

  const handleBetChange = (index: number, value: string) => {
    setBetAmounts((prev) => ({ ...prev, [index]: value }));
  };

  const handleVote = (index: number) => {
    const amount = betAmounts[index] || "0";
    console.log(`Voted for ${projects[index].name} with amount: ${amount}`);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      try {
        const fileContent = await file.text();
        const json = JSON.parse(fileContent);
        setJsonData(json);
        setError(null);
      } catch (err) {
        setError("Invalid JSON file.");
        setJsonData(null);
      }
    }
  };

  const handleUpload = async () => {
    const { privateKey, publicKey, commitment } = new Identity();
    console.log("privateKey: ", privateKey);
    console.log("publicKey: ", publicKey);

    let response = await fetch("/api/prove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        proof: jsonData,
        identityCommitment: {
          commit: commitment.toString(),
        },
      }),
    });

    if (response.status === 200) {
      const data = await response.json();
      localStorage.setItem("signature", data.signature.toString());
      setSignature(data.signature.toString());
      setResponseMessage("Proof uploaded successfully!");
    } else {
      setResponseMessage("Some error occurred, please try again!");
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
    <br/><br/><br/><br/><br/><br/><br/><br/>
      <div className={styles.uploadSection}>
        <h1>Upload Proof of Hacker JSON File</h1>
        <input
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className={styles.fileInput}
        />
        {error && <p className={styles.errorText}>{error}</p>}
        {jsonData && (
          <div>
    
            <button onClick={handleUpload} className={styles.uploadButton}>
              Upload
            </button>
          </div>
        )}
        {responseMessage && <p className={styles.responseText}>{responseMessage}</p>}
        {signature && (
          <div className={styles.signatureSection}>
            <h2>Signature:</h2>
            <p>{signature}</p>
          </div>
        )}
      </div>

      <div className={styles.cardContainer}>
        {projects.map((project, index) => (
          <div key={index} className={styles.card}>
            <h3 className={styles.cardTitle}>{project.name}</h3>
            <p className={styles.cardTagline}>{project.tagline}</p>
            <div className={styles.betContainer}>
              <input
                type="number"
                className={styles.betInput}
                value={betAmounts[index] || ""}
                onChange={(e) => handleBetChange(index, e.target.value)}
                placeholder="Amount"
              />
              <button className={styles.voteButton} onClick={() => handleVote(index)}>
                Vote
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ListProjects;
