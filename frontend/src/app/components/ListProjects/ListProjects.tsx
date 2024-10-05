"use client"
// components/ProjectList.js

import React, { useEffect, useState } from 'react';

interface Project {
    name: string;
    tagline: string;
}

function ListProjects () {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('https://api.devfolio.co/api/search/projects', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        hackathon_slugs: ["ethwarsaw-hackathon-2024"],
                        q: "",
                        filter: "all",
                        prizes: [],
                        prize_tracks: [],
                        category: [],
                        from: 0,
                        size: 10,
                        hashtags: [],
                        tracks: []
                    }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();

                // Extracting name and tagline
                const extractedProjects = data.hits.hits.map((project: any)=> ({
                    name: project._source.name,
                    tagline: project._source.tagline
                }));

                setProjects(extractedProjects);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, []);

    return (
        <div>
            <h1>Projects</h1>
            <ul>
                {projects.map((project, index) => (
                    <li key={index}>
                        <h2>{project.name}</h2>
                        <p>{project.tagline}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListProjects;

