let lastId = "";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const body = await req.text();
    lastId = body;
    return res.status(200).send("Saved");
  }

  res.status(200).send(lastId);
}
