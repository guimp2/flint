(() => {
  'use strict';

  const CONFIG = window.MUTIRAO_CONFIG;
  const $ = (id) => document.getElementById(id);
  const clean = (value) => (value ?? '').toString().trim();
  const normalize = (value) => clean(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  const escapeHTML = (value) => String(value).replace(/[&<>'"]/g, (char) => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#039;', '"':'&quot;'
  }[char]));

  const months = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];

  const SNAPSHOT = {
    total: 27,
    knowledge: [
      ['Já uso no meu dia a dia', 11],
      ['Uso muito, já faz parte do meu trabalho', 8],
      ['Ainda não uso, mas tenho curiosidade', 6],
      ['Não informado', 2]
    ],
    occupations: [
      ['Tech / desenvolvimento / TI', 7],
      ['Música / produção musical / artistas', 6],
      ['Marketing / comunicação', 6],
      ['Administrativo / atendimento / supervisão', 3],
      ['Outros', 3],
      ['Não informado', 2]
    ],
    themes: [
      ['Automação e produtividade', 8, 'automation'],
      ['Música e produção musical', 7, 'music'],
      ['Desenvolvimento e criação de soluções', 6, 'code'],
      ['Marketing, vendas e pequenos negócios', 5, 'megaphone'],
      ['Criação de conteúdo e audiovisual', 4, 'video']
    ],
    difficulties: [
      ['Estruturar automações', 7, 'automation', 'Criar fluxos, agentes e processos automáticos.'],
      ['Transformar IA em solução prática', 6, 'ai', 'Sair da ideia e aplicar em problemas reais.'],
      ['Captar clientes e melhorar atendimento', 5, 'people', 'Automatizar relacionamento, vendas e prospecção.'],
      ['Domínio técnico em desenvolvimento', 4, 'code', 'Arquitetura, apps, código e integração.'],
      ['Integrar IA à produção musical', 4, 'music', 'Mixagem, masterização, criação e divulgação.'],
      ['Ir além do ChatGPT básico', 3, 'info', 'Conhecer outras ferramentas e usos avançados.']
    ]
  };

  const themeDefinitions = [
    { label:'Automação e produtividade', icon:'automation', regex:/automat|agente|produtiv|processo|rotina|setor|pitch|atendimento|captar cliente|facilitar|organiz|fluxo/i },
    { label:'Música e produção musical', icon:'music', regex:/musica|música|mixagem|masteriza|fonograf|faixa|artista|curador|studio|dança|danca/i },
    { label:'Desenvolvimento e criação de soluções', icon:'code', regex:/site|aplic|desenvolv|claude|arquitetura|solu[cç][aã]o|projeto|software|sistema/i },
    { label:'Marketing, vendas e pequenos negócios', icon:'megaphone', regex:/marketing|venda|negocio|negócio|trafego|tráfego|divulga|cliente|editorial|conteudo|conteúdo/i },
    { label:'Criação de conteúdo e audiovisual', icon:'video', regex:/video|vídeo|foto|fotograf|criativo|audiovisual|imagem|site|conteudo|conteúdo/i }
  ];

  const difficultyDefinitions = [
    { label:'Estruturar automações', icon:'automation', description:'Criar fluxos, agentes e processos automáticos.', regex:/automat|agente|processo|setor|fluxo/i },
    { label:'Transformar IA em solução prática', icon:'ai', description:'Sair da ideia e aplicar em problemas reais.', regex:/solu[cç][aã]o|aplic|facilitar|projeto|pratica|prática/i },
    { label:'Captar clientes e melhorar atendimento', icon:'people', description:'Automatizar relacionamento, vendas e prospecção.', regex:/cliente|captar|atendimento|venda|pitch|prospec/i },
    { label:'Domínio técnico em desenvolvimento', icon:'code', description:'Arquitetura, apps, código e integração.', regex:/desenvolv|arquitetura|site|claude|software|program/i },
    { label:'Integrar IA à produção musical', icon:'music', description:'Mixagem, masterização, criação e divulgação.', regex:/musica|música|mixagem|masteriza|fonograf|faixa/i },
    { label:'Ir além do ChatGPT básico', icon:'info', description:'Conhecer outras ferramentas e usos avançados.', regex:/chat.?gpt|entendimento|aprender|conhec|curiosidade|ferramenta/i }
  ];

  function formatDate(date) {
    return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
  }

  function svgIcon(id) {
    return `<svg aria-hidden="true"><use href="assets/icons.svg#${id}"></use></svg>`;
  }

  function setStatus(message, type = 'warn') {
    const status = $('live-status');
    status.textContent = message;
    status.dataset.type = type;
  }

  function showError(message) {
    $('error-message').textContent = message;
    $('error-panel').hidden = false;
  }

  function hideError() {
    $('error-panel').hidden = true;
  }

  function csvURL() {
    const url = new URL(`https://docs.google.com/spreadsheets/d/${CONFIG.spreadsheetId}/gviz/tq`);
    url.searchParams.set('tqx', 'out:csv');
    url.searchParams.set('sheet', CONFIG.sheetName);
    url.searchParams.set('range', CONFIG.range);
    url.searchParams.set('cacheBust', Date.now().toString());
    return url.toString();
  }

  function parseCSV(text) {
    const table = [];
    let row = [];
    let cell = '';
    let quoted = false;

    for (let i = 0; i < text.length; i += 1) {
      const char = text[i];
      const next = text[i + 1];

      if (char === '"' && quoted && next === '"') {
        cell += '"';
        i += 1;
      } else if (char === '"') {
        quoted = !quoted;
      } else if (char === ',' && !quoted) {
        row.push(cell);
        cell = '';
      } else if ((char === '\n' || char === '\r') && !quoted) {
        if (char === '\r' && next === '\n') i += 1;
        row.push(cell);
        if (row.some((item) => clean(item))) table.push(row);
        row = [];
        cell = '';
      } else {
        cell += char;
      }
    }

    if (cell || row.length) {
      row.push(cell);
      if (row.some((item) => clean(item))) table.push(row);
    }

    if (!table.length) return [];
    const headers = table.shift().map(clean);
    return table
      .map((cells) => Object.fromEntries(headers.map((header, index) => [header, clean(cells[index])])))
      .filter((record) => Object.values(record).some((value) => clean(value)));
  }

  async function fetchCSV() {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(csvURL(), { cache: 'no-store', signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return parseCSV(await response.text());
    } finally {
      clearTimeout(timer);
    }
  }

  function fetchJSONP() {
    return new Promise((resolve, reject) => {
      const callback = `mutiraoBhCallback_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
      const script = document.createElement('script');
      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error('Tempo esgotado ao consultar o Google Sheets.'));
      }, 14000);

      function cleanup() {
        clearTimeout(timeout);
        delete window[callback];
        script.remove();
      }

      window[callback] = (response) => {
        try {
          if (!response || response.status === 'error' || !response.table) {
            throw new Error(response?.errors?.[0]?.detailed_message || 'Resposta inválida do Google Sheets.');
          }
          const headers = response.table.cols.map((column, index) => clean(column.label || column.id || `Coluna ${index + 1}`));
          const records = response.table.rows.map((row) => Object.fromEntries(headers.map((header, index) => {
            const cell = row.c?.[index];
            const value = cell ? (cell.f ?? cell.v ?? '') : '';
            return [header, clean(value)];
          }))).filter((record) => Object.values(record).some((value) => clean(value)));
          cleanup();
          resolve(records);
        } catch (error) {
          cleanup();
          reject(error);
        }
      };

      const url = new URL(`https://docs.google.com/spreadsheets/d/${CONFIG.spreadsheetId}/gviz/tq`);
      url.searchParams.set('sheet', CONFIG.sheetName);
      url.searchParams.set('range', CONFIG.range);
      url.searchParams.set('tq', 'select *');
      url.searchParams.set('tqx', `out:json;responseHandler:${callback}`);
      url.searchParams.set('cacheBust', Date.now().toString());
      script.src = url.toString();
      script.onerror = () => {
        cleanup();
        reject(new Error('Falha ao carregar a consulta JSONP.'));
      };
      document.head.appendChild(script);
    });
  }

  async function fetchAppsScript() {
    if (!CONFIG.appsScriptUrl) throw new Error('URL do Apps Script não configurada.');
    const url = `${CONFIG.appsScriptUrl}${CONFIG.appsScriptUrl.includes('?') ? '&' : '?'}cacheBust=${Date.now()}`;
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Apps Script retornou HTTP ${response.status}`);
    const payload = await response.json();
    if (!Array.isArray(payload.rows)) throw new Error('Resposta inválida do Apps Script.');
    if (payload.rows.length && !Array.isArray(payload.rows[0])) return payload.rows;
    const headers = payload.headers || [];
    return payload.rows.map((cells) => Object.fromEntries(headers.map((header, index) => [header, clean(cells[index])])))
      .filter((record) => Object.values(record).some((value) => clean(value)));
  }

  async function fetchLiveRows() {
    if (CONFIG.dataMode === 'apps-script') return fetchAppsScript();
    try {
      return await fetchCSV();
    } catch (csvError) {
      console.warn('CSV indisponível, tentando JSONP:', csvError);
      return fetchJSONP();
    }
  }

  function countBy(rows, column, includeBlank = false) {
    const counts = new Map();
    rows.forEach((row) => {
      const value = clean(row[column]);
      const label = value || (includeBlank ? 'Não informado' : '');
      if (!label) return;
      counts.set(label, (counts.get(label) || 0) + 1);
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'pt-BR'));
  }

  function occupationCategory(value) {
    const text = normalize(value);
    if (!text) return 'Não informado';

    if (/desenvolv|program|power platform|analista de suporte|\bqa\b|tecnic[ao] de informatica|full.?stack|rpa|software|dados|tecnologia|\bti\b|ads|ai creator|arquitetura de solu/.test(text)) {
      return 'Tech / desenvolvimento / TI';
    }
    if (/produtor musical|curador musical|artista|musical|musica|dj|mixagem|masteriza|fonograf/.test(text)) {
      return 'Música / produção musical / artistas';
    }
    if (/publicit|marketing|trafego|jornal|comunicador|comunicadora|social media|conteudo|branding|assessoria|storymark/.test(text)) {
      return 'Marketing / comunicação';
    }
    if (/supervisor|atendimento|administr|gerente|coorden|assistente|gestor/.test(text)) {
      return 'Administrativo / atendimento / supervisão';
    }
    return 'Outros';
  }

  function occupationRanking(rows) {
    const counts = new Map();
    rows.forEach((row) => {
      const category = occupationCategory(row[CONFIG.columns.occupation]);
      counts.set(category, (counts.get(category) || 0) + 1);
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }

  function scoreDefinitions(rows, definitions) {
    const corpus = rows.map((row) => clean(row[CONFIG.columns.learning])).filter(Boolean);
    return definitions.map((definition) => ({
      ...definition,
      count: corpus.reduce((sum, answer) => sum + (definition.regex.test(answer) ? 1 : 0), 0)
    })).sort((a, b) => b.count - a.count);
  }

  function renderRanking(containerId, items) {
    const max = Math.max(...items.map((item) => item[1]), 1);
    $(containerId).innerHTML = items.map(([label, count]) => `
      <div class="ranking-row">
        <span class="ranking-label">${escapeHTML(label)}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${Math.max(5, (count / max) * 100)}%"></div></div>
        <span class="ranking-value">${count}</span>
      </div>
    `).join('');
  }

  function renderOccupations(items) {
    const max = Math.max(...items.map((item) => item[1]), 1);
    $('occupation-ranking').innerHTML = items.map(([category, count]) => `
      <div class="ranking-row">
        <span class="ranking-label">${escapeHTML(category)}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${Math.max(5, (count / max) * 100)}%"></div></div>
        <span class="ranking-value">${count}</span>
      </div>
    `).join('');
  }

  function renderThemes(themes) {
    $('themes-list').innerHTML = themes.slice(0, 5).map((theme) => `
      <div class="topic-row">
        <div class="topic-icon">${svgIcon(theme.icon)}</div>
        <span class="topic-name">${escapeHTML(theme.label)}</span>
        <span class="topic-count">${theme.count}</span>
      </div>
    `).join('');
  }

  function renderDifficulties(difficulties) {
    $('difficulties-list').innerHTML = difficulties.slice(0, 6).map((difficulty) => `
      <div class="difficulty-item">
        <div class="difficulty-icon">${svgIcon(difficulty.icon)}</div>
        <div class="difficulty-copy">
          <strong>${escapeHTML(difficulty.label)}</strong>
          <span>${escapeHTML(difficulty.description)} · ${difficulty.count} menções</span>
        </div>
      </div>
    `).join('');
  }

  function profileSummary(occupations) {
    const labels = occupations
      .filter(([label]) => label !== 'Não informado')
      .slice(0, 3)
      .map(([label]) => label
        .replace('Tech / desenvolvimento / TI', 'tecnologia')
        .replace('Música / produção musical / artistas', 'música')
        .replace('Marketing / comunicação', 'marketing')
        .replace('Administrativo / atendimento / supervisão', 'operações')
        .replace('Outros', 'perfis diversos'));
    if (!labels.length) return 'Perfis diversos';
    if (labels.length === 1) return labels[0];
    return `${labels.slice(0, -1).join(', ')} e ${labels.at(-1)}`;
  }

  function renderSnapshot() {
    const mature = SNAPSHOT.knowledge.slice(0, 2).reduce((sum, [, count]) => sum + count, 0);
    const maturityPercent = Math.round((mature / SNAPSHOT.total) * 100);

    $('email-count').textContent = SNAPSHOT.total;
    $('maturity-percent').textContent = `${maturityPercent}%`;
    $('summary-total').textContent = SNAPSHOT.total;
    $('summary-mature').textContent = mature;
    $('summary-profile').textContent = profileSummary(SNAPSHOT.occupations);
    $('summary-interest').textContent = SNAPSHOT.themes[0][0];
    renderRanking('knowledge-ranking', SNAPSHOT.knowledge);
    renderOccupations(SNAPSHOT.occupations);
    renderThemes(SNAPSHOT.themes.map(([label, count, icon]) => ({ label, count, icon })));
    renderDifficulties(SNAPSHOT.difficulties.map(([label, count, icon, description]) => ({ label, count, icon, description })));
    $('knowledge-insight').textContent = 'A maioria já chega com contato prático com IA.';
    $('occupation-insight').textContent = 'A base combina tecnologia, música e comunicação.';
  }

  function renderLive(rows) {
    const validRows = rows.filter((row) => clean(row[CONFIG.columns.email]));
    const emailCount = validRows.length;
    const knowledge = countBy(validRows, CONFIG.columns.knowledge, true);
    const occupations = occupationRanking(validRows);
    const themes = scoreDefinitions(validRows, themeDefinitions);
    const difficulties = scoreDefinitions(validRows, difficultyDefinitions);

    const matureCount = validRows.filter((row) => {
      const value = normalize(row[CONFIG.columns.knowledge]);
      return value === 'ja uso no meu dia a dia' || value === 'uso muito, ja faz parte do meu trabalho';
    }).length;
    const maturityPercent = Math.round((matureCount / Math.max(emailCount, 1)) * 100);

    $('email-count').textContent = emailCount;
    $('maturity-percent').textContent = `${maturityPercent}%`;
    $('summary-total').textContent = emailCount;
    $('summary-mature').textContent = matureCount;
    $('summary-profile').textContent = profileSummary(occupations);
    $('summary-interest').textContent = themes[0]?.label || 'Aplicação prática de IA';

    renderRanking('knowledge-ranking', knowledge);
    renderOccupations(occupations);
    renderThemes(themes);
    renderDifficulties(difficulties);

    const informedKnowledge = knowledge.filter(([label]) => label !== 'Não informado');
    const topKnowledge = informedKnowledge[0]?.[0] || 'Sem respostas';
    $('knowledge-insight').textContent = maturityPercent >= 60
      ? 'A maioria já chega com contato prático com IA.'
      : `A resposta mais frequente é “${topKnowledge}”.`;
    $('occupation-insight').textContent = `A base combina ${profileSummary(occupations)}.`;
  }

  async function update() {
    const refreshButton = $('refresh-button');
    refreshButton.disabled = true;
    setStatus('Atualizando dados ao vivo…', 'warn');
    hideError();

    try {
      const rows = await fetchLiveRows();
      if (!rows.length) throw new Error('A aba BH não retornou registros.');
      renderLive(rows);
      const time = new Date().toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' });
      setStatus(`Dados ao vivo atualizados às ${time}`, 'ok');
    } catch (error) {
      console.error(error);
      renderSnapshot();
      setStatus('Exibindo o último snapshot disponível', 'error');
      showError(`${error.message} Confira se a planilha está pública para visualização ou configure o Apps Script incluído no pacote.`);
    } finally {
      refreshButton.disabled = false;
    }
  }

  $('report-date').textContent = formatDate(new Date());
  $('refresh-button').addEventListener('click', update);
  renderSnapshot();

  const demoMode = new URLSearchParams(window.location.search).get('demo') === '1';
  if (demoMode) {
    setStatus('Modo demonstração — snapshot local', 'ok');
  } else {
    update();
    window.setInterval(update, CONFIG.refreshMs);
  }
})();
