# Proxy opcional com Google Apps Script

Use esta opção para manter a planilha privada.

## Publicação

1. Acesse `https://script.google.com` usando uma conta que tenha acesso à planilha.
2. Crie um novo projeto.
3. Apague o conteúdo inicial e cole o arquivo `Code.gs` deste pacote.
4. Clique em `Implantar → Nova implantação`.
5. Tipo: **Aplicativo da Web**.
6. Executar como: **Você**.
7. Quem pode acessar: **Qualquer pessoa**.
8. Autorize o acesso solicitado.
9. Copie a URL terminada em `/exec`.

## Conectar ao dashboard

Edite o arquivo `config.js` na raiz do pacote:

```js
dataMode: "apps-script",
appsScriptUrl: "https://script.google.com/macros/s/SEU_ID/exec"
```

Depois, publique novamente a página HTML.

O aplicativo da web expõe somente os valores da aba `BH`, em modo de leitura. Ele não altera a planilha.
