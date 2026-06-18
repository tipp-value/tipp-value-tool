const CACHE_DURATION = 30 * 60; // 30 Minuten in Sekunden

exports.handler = async (event) => {
  const sport = event.queryStringParameters?.sport || 'soccer_fifa_world_cup';
  const API_KEY = process.env.ODDS_API_KEY;

  if (!API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured' }) };
  }

  const url = `https://api.the-odds-api.com/v4/sports/${encodeURIComponent(sport)}/odds` +
    `?apiKey=${API_KEY}&regions=eu,uk&markets=h2h&oddsFormat=decimal`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=60`,
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
