export default async function handler(req, res) {
  try {
    const username = req.query.username || "chatgptbrasil";
    const webhookUrl = "https://hook.us2.make.com/lmry1iek5t8c46t238iodrffa2t4stug"; // substitua pelo seu webhook Make
    const rapidKey = process.env.RAPIDAPI_KEY; // coloque sua chave no painel da Vercel

    const url = `https://instagram120.p.rapidapi.com/api/instagram/get?username=${username}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "instagram120.p.rapidapi.com",
        "x-rapidapi-key": rapidKey
      }
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("RapidAPI error:", response.status, text);
      return res.status(500).send("Failed to fetch from RapidAPI");
    }

    const data = await response.json();

    if (!data?.status || !data?.data?.media?.length) {
      console.error("No posts found for user:", username);
      return res.status(404).send("No posts found");
    }

    const latest = data.data.media[0];
    const postUrl = latest.permalink;
    const thumb = latest.media_url;
    const caption = latest.caption || "";

    // Enviar ao Make
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, postUrl, thumb, caption })
    });

    res.status(200).json({
      success: true,
      username,
      postUrl,
      thumb,
      caption
    });
  } catch (err) {
    console.error("Handler error:", err);
    res.status(500).json({ error: err.message });
  }
}
