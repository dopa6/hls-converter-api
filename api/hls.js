export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) {
    return res.status(400).send('No URL specified');
  }

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    if (!response.ok) {
      return res.status(response.status).send('Failed to fetch video');
    }

    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', response.headers.get('content-type') || 'video/mp4');

    const readableStream = response.body;
    return readableStream.pipe(res);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).send('Error fetching the video');
  }
}
