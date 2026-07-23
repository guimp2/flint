window.MUTIRAO_CONFIG = {
  spreadsheetId: "1hJHXy7LlO7hXVroqMYRFHAGB9o4B78OVgqBWGKdKxR4",
  sheetName: "BH",
  sheetGid: "1174937531",
  range: "A:N",
  refreshMs: 5 * 60 * 1000,

  // "public-gviz": leitura direta do Google Sheets. A planilha precisa estar pública para visualização.
  // "apps-script": use o endpoint opcional incluído na pasta /apps-script para manter a planilha privada.
  dataMode: "public-gviz",
  appsScriptUrl: "",

  columns: {
    email: "E-mail",
    knowledge: "Já usa IA",
    occupation: "Ocupação",
    learning: "O que quer aprender"
  }
};
