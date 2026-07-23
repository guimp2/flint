# Mutirão.AI — Dashboard BH ao vivo

Pacote HTML responsivo com a aparência do relatório interno de Belo Horizonte. A página consulta em tempo real a aba **`BH`** da planilha:

`https://docs.google.com/spreadsheets/d/1hJHXy7LlO7hXVroqMYRFHAGB9o4B78OVgqBWGKdKxR4/edit?usp=sharing`

## O que o dashboard calcula

- **Inscritos:** conta as células preenchidas na coluna `E-mail`, sem deduplicação.
- **Nível de conhecimento:** ranking da coluna `Já usa IA`, incluindo `Não informado`.
- **Ocupação:** agrupamento automático por categoria.
- **Temas e dificuldades:** leitura da coluna `O que quer aprender` por grupos de palavras-chave.
- **Síntese executiva:** total, maturidade da base, perfil profissional e principal interesse.

A página atualiza ao abrir, possui botão de atualização manual e repete a consulta a cada **5 minutos**.

## Estrutura do pacote

```text
mutirao-bh-live-dashboard/
├── index.html
├── styles.css
├── app.js
├── config.js
├── README.md
├── assets/
│   ├── logo-mutirao-ai.jpg
│   ├── bh-figure.svg
│   ├── icons.svg
│   ├── pattern-dots.svg
│   ├── preview.png
│   └── reference-infographic.png
└── apps-script/
    ├── Code.gs
    └── README.md
```

## Opção 1 — leitura pública direta do Google Sheets

Essa é a configuração padrão do pacote.

Na planilha:

1. Clique em **Compartilhar**.
2. Em **Acesso geral**, escolha **Qualquer pessoa com o link**.
3. Selecione a permissão **Leitor**.

O dashboard usa o endpoint público `gviz` do Google Sheets e não requer API key.

## Opção 2 — manter a planilha privada

Use o proxy opcional em Google Apps Script:

1. Abra `apps-script/README.md`.
2. Publique `apps-script/Code.gs` como Aplicativo da Web.
3. Em `config.js`, altere:

```js
dataMode: "apps-script",
appsScriptUrl: "COLE_A_URL_DO_WEB_APP_AQUI"
```

## Como colocar no ar

### Netlify Drop

1. Descompacte o ZIP.
2. Acesse `https://app.netlify.com/drop`.
3. Arraste a pasta `mutirao-bh-live-dashboard`.
4. O Netlify cria uma URL automaticamente.

### Vercel

1. Crie um projeto novo.
2. Suba a pasta inteira.
3. Framework: **Other**.
4. Não é necessário comando de build.

### GitHub Pages

1. Crie um repositório.
2. Envie todos os arquivos mantendo a estrutura de pastas.
3. Vá em **Settings → Pages**.
4. Selecione `Deploy from a branch`, branch `main`, pasta `/root`.

## Teste local

Execute dentro da pasta:

```bash
python3 -m http.server 8080
```

Abra:

`http://localhost:8080`

Para testar somente o layout com o snapshot incorporado, sem consultar a planilha:

`http://localhost:8080/?demo=1`

## Configurações rápidas

Em `config.js`:

```js
sheetName: "BH",
refreshMs: 5 * 60 * 1000
```

## Ajustar as categorias

As regras ficam em `app.js`:

- `occupationCategory()` — categorias de ocupação.
- `themeDefinitions` — temas de aprendizado.
- `difficultyDefinitions` — dificuldades.

Uma resposta pode ser associada a mais de um tema ou dificuldade. Os e-mails nunca são exibidos na interface.
