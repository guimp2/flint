# Mutirão.AI — Dashboard BH ao vivo (+24 inscrições fixas)

Este pacote consulta em tempo real a aba **BH** da planilha:

`https://docs.google.com/spreadsheets/d/1hJHXy7LlO7hXVroqMYRFHAGB9o4B78OVgqBWGKdKxR4/edit?usp=sharing`

## Regra do total exibido

O número de inscritos mostrado no card principal e na síntese executiva é calculado assim:

```text
células preenchidas em E-mail + 24 inscrições externas
```

Exemplo: 24 inscrições na planilha aparecem como **48** no dashboard.

Os demais itens continuam calculados somente com os registros da planilha:

- ranking de `Já usa IA`;
- quantidade e percentual de maturidade;
- ocupações;
- temas;
- dificuldades.

Para alterar o número fixo, edite `config.js`:

```js
registrationDisplayOffset: 24,
```

Use `0` para remover a soma.

## Atualização

- Carrega os dados ao abrir.
- Possui atualização manual.
- Atualiza automaticamente a cada 5 minutos.

## Colocar no ar

### Netlify Drop

1. Descompacte o ZIP.
2. Acesse `https://app.netlify.com/drop`.
3. Arraste a pasta inteira.

### Vercel

1. Crie um projeto novo.
2. Envie a pasta inteira.
3. Selecione **Other** como framework.
4. Não defina comando de build.

### GitHub Pages

1. Envie os arquivos para um repositório.
2. Abra **Settings → Pages**.
3. Publique a branch `main` a partir da pasta `/root`.

## Permissão da planilha

Na configuração padrão, use:

**Compartilhar → Qualquer pessoa com o link → Leitor**

O pacote também contém a pasta `apps-script` para leitura via proxy caso a planilha precise continuar privada.
