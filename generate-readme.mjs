// ---------------------------------------------------------------------------
// Gerador de README multilíngue do perfil do GitHub.
//
// Tudo é montado a partir de UM template. Cada idioma vira um arquivo:
// o idioma com `main: true` é o principal (README.md, exibido no perfil do
// GitHub); os demais viram README.<code>.md. A barra de idiomas no topo de
// cada página e os links entre os arquivos são gerados automaticamente.
// (No README do GitHub não há JavaScript: a "troca de aba" é a navegação
// entre esses arquivos, instantânea ao clicar no idioma.)
//
// Para adicionar um novo idioma, acrescente um objeto em LANGS e rode:
//
//     node generate-readme.mjs
// ---------------------------------------------------------------------------

import { writeFileSync } from "node:fs";

const USER = "cleiton-bp";

// Cada idioma só precisa traduzir os textos curtos — o resto é compartilhado.
// `locale` é o código que o gráfico de atividade usa para traduzir o texto
// interno (ex.: "Current Streak", "Longest Streak").
// O idioma com `main: true` é o que abre por padrão no perfil (README.md).
// Inglês fica em primeiro e como principal.
const LANGS = [
  { code: "en", main: true, name: "English", locale: "en",
    role: "Full Stack Developer", tagline: "Turning coffee into code",
    stats: "My GitHub Activity", contacts: "My Contacts" },
  { code: "pt", name: "Português", locale: "pt-BR",
    role: "Desenvolvedor Full Stack", tagline: "Transformando café em código",
    stats: "Minha Atividade no GitHub", contacts: "Meus Contatos" },
  { code: "es", name: "Español", locale: "es",
    role: "Desarrollador Full Stack", tagline: "Convirtiendo café en código",
    stats: "Mi Actividad en GitHub", contacts: "Mis Contactos" },
  { code: "fr", name: "Français", locale: "fr",
    role: "Développeur Full Stack", tagline: "Transformer le café en code",
    stats: "Mon Activité GitHub", contacts: "Mes Contacts" },
  { code: "de", name: "Deutsch", locale: "de",
    role: "Full-Stack-Entwickler", tagline: "Kaffee in Code verwandeln",
    stats: "Meine GitHub-Aktivität", contacts: "Meine Kontakte" },
  { code: "it", name: "Italiano", locale: "it",
    role: "Sviluppatore Full Stack", tagline: "Trasformo caffè in codice",
    stats: "La Mia Attività su GitHub", contacts: "I Miei Contatti" },
  { code: "zh", name: "中文", locale: "zh_Hans",
    role: "全栈开发工程师", tagline: "把咖啡变成代码",
    stats: "我的 GitHub 活动", contacts: "我的联系方式" },
  { code: "ja", name: "日本語", locale: "ja",
    role: "フルスタック開発者", tagline: "コーヒーをコードに変える",
    stats: "GitHub のアクティビティ", contacts: "連絡先" },
];

// O principal é README.md (arquivo que o GitHub exibe no perfil);
// os demais idiomas viram README.<code>.md no mesmo repositório.
const fileFor = (l) => (l.main ? `README.md` : `README.${l.code}.md`);

// --- Seletor de idioma (idioma atual em negrito + sublinhado) ---------------
function languageSelector(current) {
  return LANGS.map((l) =>
    l.code === current.code
      ? `<ins><b>${l.name}</b></ins>`
      : `<a href="./${fileFor(l)}">${l.name}</a>`
  ).join(" &nbsp;·&nbsp; ");
}

// --- Banner de digitação (texto codificado p/ URL automaticamente) ----------
function typingBanner(l) {
  const lines = [l.role, l.tagline].map(encodeURIComponent).join(";");
  return `https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=28&duration=6000&pause=1200&color=2E9EF7&center=true&vCenter=true&width=600&height=50&lines=${lines}`;
}

// --- Gráfico de atividade (streak) com adaptação automática de tema ---------
// O GitHub mostra só a imagem que casa com o tema do visitante via os
// fragmentos #gh-dark-mode-only / #gh-light-mode-only. O `locale` traduz o
// texto interno do gráfico para o idioma da página.
const streak = (locale, theme, color, mode) => `https://github-readme-streak-stats.herokuapp.com/?user=${USER}&locale=${locale}&hide_border=true&background=00000000&theme=${theme}&ring=${color}&fire=${color}&currStreakLabel=${color}#gh-${mode}-mode-only`;

function statsBlock(l) {
  return `<p align="center">
  <img src="${streak(l.locale, "tokyonight", "2E9EF7", "dark")}" alt="GitHub streak" />
  <img src="${streak(l.locale, "default", "0969da", "light")}" alt="GitHub streak" />
</p>`;
}

// --- Contatos (badges coloridos funcionam em ambos os temas) ----------------
const contactsBlock = `<p align="center">
  <a href="https://www.linkedin.com/in/cleiton-pereira-249044240/">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
  <a href="https://wa.me/5551996908049">
    <img src="https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" alt="WhatsApp" />
  </a>
  <a href="https://cleiton-bp.vercel.app/">
    <img src="https://img.shields.io/badge/Portfolio-006666?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Portfolio" />
  </a>
</p>`;

const gifBlock = `<div align="center">
  <a href="https://imgur.com/A6uiN0R">
    <img height="300em" src="https://i.imgur.com/A6uiN0R.gif" title="source: imgur.com" alt="coding" />
  </a>
</div>`;

// --- Montagem da página -----------------------------------------------------
function page(l) {
  return `<p align="center">
  ${languageSelector(l)}
</p>

<p align="center">
  <a href="https://github.com/${USER}">
    <img src="${typingBanner(l)}" alt="${l.role}" />
  </a>
</p>

<h3 align="center">${l.stats}</h3>

${statsBlock(l)}

---

<h3 align="center">${l.contacts}</h3>

${contactsBlock}

---

${gifBlock}
`;
}

for (const l of LANGS) {
  const file = fileFor(l);
  writeFileSync(file, page(l));
  console.log(`✓ ${file}`);
}
console.log(`\nGerados ${LANGS.length} arquivos.`);
