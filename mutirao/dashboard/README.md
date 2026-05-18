# Mutirão.AI — Dashboard ao vivo

Dashboard HTML estático que puxa dados do Google Sheets em tempo real usando o endpoint CSV público do Google Visualization.

## Como colocar no ar

### 1. Prepare a planilha
A planilha precisa estar acessível publicamente para leitura:

- Abra o Google Sheets.
- Clique em **Compartilhar**.
- Em **Acesso geral**, selecione **Qualquer pessoa com o link**.
- Permissão: **Leitor**.

Alternativa mais estável:

- Arquivo → Compartilhar → **Publicar na web**.
- Publique as abas usadas.

## 2. Suba o HTML
Você pode hospedar o arquivo `index.html` em qualquer hospedagem estática.

### Opção rápida: Netlify
1. Acesse netlify.com.
2. Vá em **Add new site → Deploy manually**.
3. Arraste a pasta `mutirao-dashboard` ou apenas o `index.html`.
4. O site entra no ar automaticamente.

### Opção rápida: Vercel
1. Acesse vercel.com.
2. Crie um novo projeto.
3. Suba esta pasta.
4. Deploy automático.

### Opção simples: GitHub Pages
1. Crie um repositório no GitHub.
2. Suba o `index.html` na raiz.
3. Vá em Settings → Pages.
4. Selecione branch `main` e pasta `/root`.
5. Salve.

## 3. Ajustes principais
No final do `index.html`, edite o objeto `CONFIG` se mudar ID da planilha, nome das abas ou nomes das colunas.

```js
const CONFIG = {
  spreadsheetId: "1hJHXy7LlO7hXVroqMYRFHAGB9o4B78OVgqBWGKdKxR4",
  refreshMs: 5 * 60 * 1000,
  sheets: {
    ead: "Mutirão.AI Geral",
    saoPaulo: "Instituto Kondzilla",
    fortaleza: "Fortaleza"
  },
  columns: {
    email: "E-mail",
    estado: "Estado",
    rsvp: "RSVP Evento",
    ocupacao: "Ocupação",
    aprender: "O que quer aprender"
  }
};
```

## Observações
- O dashboard conta células preenchidas na coluna `E-mail`.
- Não deduplica e-mails.
- Atualiza automaticamente a cada 5 minutos.
- O ranking de ocupação e temas usa categorização por palavras-chave no próprio HTML.
- Se aparecer erro de carregamento, normalmente é permissão da planilha.
