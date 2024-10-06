import { NextResponse } from 'next/server';

export async function GET() {
  const url = 'https://api.devfolio.co/api/search/projects';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hackathon_slugs: ["ethkl-24"],
        q: '',
        filter: 'all',
        prizes: [],
        prize_tracks: [],
        category: [],
        size: 100,
        tracks: [],
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
