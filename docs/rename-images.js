const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');

const baseMappings = [
  {
    from: 'assets/images/home/ChatGPT Image 4 de fev. de 2026, 11_11_37.png',
    to: 'assets/images/home/home-hero-01.png',
  },
  {
    from: 'assets/images/home/home_cads/ChatGPT Image 4 de fev. de 2026, 11_23_04.png',
    to: 'assets/images/home/home_cads/home-card-01-pericia-judicial.png',
  },
  {
    from: 'assets/images/home/home_cads/ChatGPT Image 4 de fev. de 2026, 11_26_35.png',
    to: 'assets/images/home/home_cads/home-card-02-seguranca-trabalho.png',
  },
  {
    from: 'assets/images/home/home_cads/ChatGPT Image 4 de fev. de 2026, 12_38_11.png',
    to: 'assets/images/home/home_cads/home-card-03-engenharia-mecanica.png',
  },
  {
    from: 'assets/images/home/home_cads/Engenheiro analisando relatórios técnicos profissionais.png',
    to: 'assets/images/home/home_cads/home-card-04-treinamento-socorrista.png',
  },
  {
    from: 'assets/images/quem-somos/ChatGPT Image 4 de fev. de 2026, 11_12_16.png',
    to: 'assets/images/quem-somos/quem-somos-banner-01.png',
  },
  {
    from: 'assets/images/quem-somos/ChatGPT Image 4 de fev. de 2026, 11_12_25.png',
    to: 'assets/images/quem-somos/quem-somos-pericia-02.png',
  },
  {
    from: 'assets/images/quem-somos/ChatGPT Image 4 de fev. de 2026, 11_12_28.png',
    to: 'assets/images/quem-somos/quem-somos-seguranca-socorros-03.png',
  },
  {
    from: 'assets/images/servicos/ChatGPT Image 4 de fev. de 2026, 11_13_31.png',
    to: 'assets/images/servicos/servicos-card-01-projeto-estrutural.png',
  },
  {
    from: 'assets/images/servicos/ChatGPT Image 4 de fev. de 2026, 11_14_15.png',
    to: 'assets/images/servicos/servicos-card-02-consultoria-tecnica.png',
  },
  {
    from: 'assets/images/servicos/ChatGPT Image 4 de fev. de 2026, 11_14_18.png',
    to: 'assets/images/servicos/servicos-card-03-bim-modelagem.png',
  },
  {
    from: 'assets/images/contato/ChatGPT Image 4 de fev. de 2026, 11_16_07.png',
    to: 'assets/images/contato/contato-banner-01.png',
  },
];

function listFilesRecursive(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...listFilesRecursive(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

function normalizeRel(p) {
  return p.replace(/\\/g, '/');
}

function resolveRel(rel) {
  return path.resolve(projectRoot, rel);
}

function normalizeName(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function findFileByNormalizedName(dirRel, expectedBase) {
  const dirAbs = resolveRel(dirRel);
  if (!fs.existsSync(dirAbs)) return null;
  const entries = fs.readdirSync(dirAbs, { withFileTypes: true });
  const expectedNorm = normalizeName(expectedBase);
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const entryNorm = normalizeName(entry.name);
    if (entryNorm === expectedNorm) return entry.name;
  }
  return null;
}

function ensureOptionalServicoCard(mappings) {
  const servicosDir = resolveRel('assets/images/servicos');
  if (!fs.existsSync(servicosDir)) return mappings;

  const entries = fs.readdirSync(servicosDir, { withFileTypes: true });
  const pngFiles = entries
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.png'))
    .map((e) => e.name);

  const mappedFromNames = new Set(
    mappings
      .filter((m) => normalizeRel(m.from).startsWith('assets/images/servicos/'))
      .map((m) => path.basename(m.from))
  );

  const mappedToNames = new Set(
    mappings
      .filter((m) => normalizeRel(m.to).startsWith('assets/images/servicos/'))
      .map((m) => path.basename(m.to))
  );

  const targetName = 'servicos-card-04-gerenciamento-obras.png';
  const knownNames = new Set([...mappedFromNames, ...mappedToNames, targetName]);

  const extras = pngFiles.filter((name) => !knownNames.has(name));

  if (extras.length > 0 && !pngFiles.includes(targetName)) {
    const extra = extras.sort()[0];
    mappings.push({
      from: `assets/images/servicos/${extra}`,
      to: `assets/images/servicos/${targetName}`,
      _note: extras.length > 1 ? `Mais de um arquivo extra encontrado. Renomeando apenas ${extra}.` : undefined,
    });
  }

  return mappings;
}

const mappings = ensureOptionalServicoCard([...baseMappings]);

const renameReport = [];

for (const map of mappings) {
  let fromRel = normalizeRel(map.from);
  const toRel = normalizeRel(map.to);
  let fromAbs = resolveRel(fromRel);
  const toAbs = resolveRel(toRel);

  if (!fs.existsSync(fromAbs)) {
    const candidate = findFileByNormalizedName(path.dirname(fromRel), path.basename(fromRel));
    if (candidate) {
      fromRel = normalizeRel(path.join(path.dirname(fromRel), candidate));
      fromAbs = resolveRel(fromRel);
    }
  }

  const fromExists = fs.existsSync(fromAbs);
  const toExists = fs.existsSync(toAbs);

  let status = 'skipped';
  if (fromExists && !toExists) {
    fs.mkdirSync(path.dirname(toAbs), { recursive: true });
    fs.renameSync(fromAbs, toAbs);
    status = 'renamed';
  } else if (!fromExists && toExists) {
    status = 'already-renamed';
  } else if (fromExists && toExists) {
    status = 'conflict-exists';
  }

  renameReport.push({ from: fromRel, to: toRel, status, note: map._note });
}

const filesToUpdate = [
  'index.html',
  'servicos.html',
  'quem-somos.html',
  'contato.html',
];

const cssFiles = listFilesRecursive(resolveRel('assets/css')).filter((f) => f.toLowerCase().endsWith('.css'));
const jsFiles = listFilesRecursive(resolveRel('assets/js')).filter((f) => f.toLowerCase().endsWith('.js'));

for (const f of cssFiles.concat(jsFiles)) {
  filesToUpdate.push(path.relative(projectRoot, f));
}

function replaceAll(content, find, replace) {
  if (!find) return content;
  return content.split(find).join(replace);
}

const editedFiles = [];

for (const rel of filesToUpdate) {
  const abs = resolveRel(rel);
  if (!fs.existsSync(abs)) continue;
  const original = fs.readFileSync(abs, 'utf8');
  let updated = original;

  for (const map of mappings) {
    const fromRel = normalizeRel(map.from);
    const toRel = normalizeRel(map.to);
    const fromWin = fromRel.replace(/\//g, '\\');
    const fromFile = path.basename(fromRel);
    const toFile = path.basename(toRel);
    const fromEncoded = encodeURIComponent(fromFile);

    updated = replaceAll(updated, fromRel, toRel);
    updated = replaceAll(updated, fromWin, toRel);
    updated = replaceAll(updated, fromFile, toFile);
    updated = replaceAll(updated, fromEncoded, toFile);
  }

  if (updated !== original) {
    fs.writeFileSync(abs, updated, 'utf8');
    editedFiles.push(rel);
  }
}

const oldNames = mappings.map((m) => path.basename(m.from));
const oldEncoded = oldNames.map((n) => encodeURIComponent(n));
const remainingRefs = [];

for (const rel of filesToUpdate) {
  const abs = resolveRel(rel);
  if (!fs.existsSync(abs)) continue;
  const content = fs.readFileSync(abs, 'utf8');
  for (const name of oldNames) {
    if (content.includes(name)) {
      remainingRefs.push({ file: rel, token: name });
    }
  }
  for (const name of oldEncoded) {
    if (content.includes(name)) {
      remainingRefs.push({ file: rel, token: name });
    }
  }
}

const reportLines = [];
reportLines.push('RELATORIO DE RENOMEACAO');
reportLines.push('---');
reportLines.push('Arquivos renomeados (antigo -> novo):');
for (const r of renameReport) {
  const note = r.note ? ` (nota: ${r.note})` : '';
  reportLines.push(`- ${r.from} -> ${r.to} [${r.status}]${note}`);
}
reportLines.push('');
reportLines.push('Arquivos editados (referencias atualizadas):');
if (editedFiles.length === 0) {
  reportLines.push('- nenhum');
} else {
  for (const f of editedFiles) reportLines.push(`- ${f}`);
}
reportLines.push('');
if (remainingRefs.length === 0) {
  reportLines.push('Confirmacao: nenhuma referencia aos nomes antigos foi encontrada.');
} else {
  reportLines.push('ATENCAO: referencias antigas encontradas:');
  for (const ref of remainingRefs) reportLines.push(`- ${ref.file}: ${ref.token}`);
}

console.log(reportLines.join('\n'));



