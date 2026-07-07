# Mutirão.AI — Dashboard ao vivo Salvador

Dashboard HTML estático que puxa dados em tempo real da aba **Salvador** desta planilha:

https://docs.google.com/spreadsheets/d/1hJHXy7LlO7hXVroqMYRFHAGB9o4B78OVgqBWGKdKxR4/edit?usp=sharing

## O que ele calcula

1. Total de inscritos: conta células preenchidas na coluna `E-mail`.
2. Ranking da coluna `Já usa IA`.
3. Ranking da coluna `Ocupação`, agrupado por categoria.
4. Apanhado semântico da coluna `O que quer aprender`.

## Importante

A planilha precisa estar com permissão:

**Qualquer pessoa com o link pode visualizar**.

Sem isso, o navegador não consegue puxar o CSV público do Google Sheets.

## Como colocar no ar

### Opção rápida — Netlify

1. Acesse https://app.netlify.com/drop
2. Arraste a pasta `mutirao-salvador-live-dashboard` ou o ZIP descompactado.
3. O Netlify gera um link público automaticamente.

### Opção rápida — Vercel

1. Crie um projeto novo na Vercel.
2. Suba esta pasta.
3. Framework: `Other`.
4. Deploy.

### Opção GitHub Pages

1. Crie um repositório no GitHub.
2. Suba o arquivo `index.html`.
3. Vá em Settings → Pages.
4. Source: `Deploy from branch`.
5. Branch: `main`, folder `/root`.
6. Salve.

## Atualização dos dados

O dashboard atualiza automaticamente a cada **5 minutos**.

Para mudar esse tempo, edite no `index.html`:

```js
refreshMs: 5 * 60 * 1000
```

## Como trocar a aba

No `index.html`, altere:

```js
sheetName: "Salvador"
```

## Como trocar a planilha

No `index.html`, altere:

```js
spreadsheetId: "1hJHXy7LlO7hXVroqMYRFHAGB9o4B78OVgqBWGKdKxR4"
```
