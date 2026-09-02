export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Groq API Key not configured on the server' });
  }

  try {
    const { prompt, systemMsg } = req.body;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "qwen-2.5-coder-32b",
        messages: [
          { role: "system", content: systemMsg || "You are an AI movie recommendation expert for a platform called Netflick." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: `Groq API Error: ${err}` });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("API Route Error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
