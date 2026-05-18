export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).send("Method not allowed");
    }

    // Slack manda o corpo como texto puro (às vezes), então garantimos o parse
    const raw = await getRawBody(req);
    const body = JSON.parse(raw.toString("utf8"));

    // Verificação inicial do Slack
    if (body.type === "url_verification") {
      res.setHeader("Content-Type", "text/plain");
      return res.status(200).send(body.challenge);
    }

    // Processar eventos reais
    const event = body.event;
    if (event?.type === "reaction_added" && event.reaction === "calendar") {
      await fetch("https://hook.us2.make.com/w6ophjify0qdm1q9a19yrld7a5bx5jg1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    return res.status(200).send("ok");
  } catch (err) {
    console.error("Erro:", err);
    return res.status(500).send("Internal Server Error");
  }
}

// Função auxiliar: ler o corpo cru da requisição
import getRawBody from "raw-body";
