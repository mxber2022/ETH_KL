"use client"

import React, { useEffect, useState } from 'react';

interface Project {
    name: string;
    tagline: string;
}

const ListProjects: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('https://api.devfolio.co/api/search/projects', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        hackathon_slugs: ['ethwarsaw-hackathon-2024'],
                        q: '',
                        filter: 'all',
                        prizes: [],
                        prize_tracks: [],
                        category: [],
                        from: 0,
                        size: 10,
                        tracks: [],
                    }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                const fetchedProjects = data.hits.hits.map((hit: any) => ({
                    name: hit._source.name,
                    tagline: hit._source.tagline,
                }));

                setProjects(fetchedProjects);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) return <div>Loading projects...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Projects</h2>
            <ul>
                {projects.map((project, index) => (
                    <li key={index}>
                        <h3>{project.name}</h3>
                        <p>{project.tagline}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListProjects;
