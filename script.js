let dbData = {};

/* ─── DATA ─── */
async function loadData() {
  try {
    const res = await fetch('data.json');
    if (!res.ok) throw new Error('Server error');
    dbData = await res.json();
    renderPortfolio();
    initFilters();
    termInit();
  } catch (err) {
    console.error('Failed to load:', err);
  }
}

/* ─── PORTFOLIO RENDER ─── */
function renderPortfolio(filter = 'all') {
  const p = dbData.profile || {};
  const stats = dbData.stats || [];
  const skills = dbData.skills || [];
  let projects = dbData.projects || [];
  const experience = dbData.experience || [];
  const contact = dbData.contact || [];

  if (filter !== 'all') {
    projects = projects.filter(pr => 
      (pr.tech || []).some(t => t.toLowerCase().includes(filter.toLowerCase())) ||
      pr.name.toLowerCase().includes(filter.toLowerCase())
    );
  }

  const setT = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  const setH = (id, val) => { const el = document.getElementById(id); if (el) el.innerHTML = val; };

  setT('p-tag', p.tag || '');
  setT('p-greet', p.greeting || '');
  setT('p-fn', p.firstname || '');
  setT('p-ln', p.lastname || '');
  setT('p-role', p.title || '');
  setT('p-bio', p.bio || '');
  setT('p-year', new Date().getFullYear());
  setT('p-fullname', `${p.firstname || ''} ${p.lastname || ''}`);

  const resEl = document.getElementById('p-resume');
  if (resEl) resEl.href = p.resume || '#';
  const navRes = document.getElementById('nav-resume');
  if (navRes) navRes.href = p.resume || '#';
  const ghBtn = document.getElementById('p-github');
  if (ghBtn) ghBtn.href = p.github || '#';

  // Social Links mapping for Hero buttons
  const liBtn = document.getElementById('p-linkedin');
  const waBtn = document.getElementById('p-whatsapp');
  const liData = contact.find(c => c.label === 'LinkedIn');
  const waData = contact.find(c => c.label === 'WhatsApp');
  if (liBtn && liData) liBtn.href = liData.href || '#';
  if (waBtn && waData) waBtn.href = waData.href || '#';

  const fn = (p.firstname || 'M')[0].toLowerCase();
  const ln = (p.lastname || 'P')[0].toLowerCase();


  setH('stats-wrap', stats.map(s => `
    <div class="stat-card">
      <div class="sn">${s.num}</div>
      <div class="sl">${s.label}</div>
    </div>`).join(''));

  setH('r-skills', skills.map(c => `
    <div class="sc">
      <div class="sc-h">
        <div class="sc-ico" style="background:${c.color}12;border-color:${c.color}22">${c.icon}</div>
        <span class="sc-n">${c.category}</span>
      </div>
      <div class="sc-tags">${(c.items || []).map(i => `<span class="sc-tag">${i}</span>`).join('')}</div>
    </div>`).join(''));

  setH('r-projects', projects.map(pr => `
    <div class="pc">
      ${pr.featured ? '<div class="feat-b">★ Featured</div>' : ''}
      <div class="p-img-wrap">
        <img src="${pr.image || 'https://via.placeholder.com/600x400'}" alt="${pr.name}" class="p-img">
      </div>
      <div class="pt">
        <div class="p-links">
          <a class="il" href="${pr.github}" target="_blank" title="GitHub">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </a>
          <a class="il" href="${pr.live}" target="_blank" title="Live Demo">↗</a>
        </div>
      </div>
      <div class="pn">${pr.name}</div>
      <div class="pd">${pr.desc}</div>
      <div class="pf">
        <div class="pt2">${(pr.tech || []).map(t => `<span class="tp">${t}</span>`).join('')}</div>
        <div class="ps2"><span>★ ${pr.stars}</span><span>⑂ ${pr.forks}</span></div>
      </div>
    </div>`).join(''));

  setH('r-exp', experience.map(e => `
    <div class="tli">
      <div class="tld"></div>
      <div class="tlm">
        <span class="tlp">${e.period}</span>
        ${e.current ? '<span class="tlc2">● Current</span>' : ''}
      </div>
      <div class="tlr">${e.role}</div>
      <div class="tlco">${e.company}</div>
      <div class="tldesc">${e.desc}</div>
      <div class="sc-tags" style="margin-top:14px">${(e.skills || []).map(s => `<span class="sc-tag">${s}</span>`).join('')}</div>
    </div>`).join(''));

  const contactIcons = {
    'Email': `<svg style="width:20px;height:20px;fill:#ea4335" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`,
    'GitHub': `<svg style="width:20px;height:20px;fill:#fff" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`,
    'LinkedIn': `<svg style="width:20px;height:20px;fill:#0077b5" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`,
    'WhatsApp': `<svg style="width:20px;height:20px;fill:#25D366" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`
  };

  setH('r-contact', contact.map(c => `
    <a class="cc" href="${c.href}" target="_blank">
      <div class="cc-ico">${contactIcons[c.label] || c.icon}</div>
      <div style="min-width:0;flex:1"><div class="ccl">${c.label}</div><div class="ccv">${c.value}</div></div>
    </a>`).join(''));

  const education = dbData.education || [];
  setH('r-edu', education.map(e => `
    <div class="tli">
      <div class="tld" style="border-color:var(--green);box-shadow:0 0 16px rgba(16,185,129,.4)"></div>
      <div class="tlm">
        <span class="tlp">${e.period}</span>
        <span class="tlc2" style="background:rgba(6,182,212,.07);border-color:rgba(6,182,212,.2);color:var(--accent)">⭐ ${e.grade}</span>
      </div>
      <div class="tlr">${e.degree}</div>
      <div class="tlco">${e.field} &middot; ${e.institution}</div>
      <div class="tldesc">📍 ${e.location}</div>
      <div class="sc-tags" style="margin-top:14px">${(e.highlights || []).map(h => `<span class="sc-tag">${h}</span>`).join('')}</div>
    </div>`).join(''));
}

/* ─── TERMINAL ─── */
const cmdHistory = [];
let histIdx = -1;

const COMMANDS = ['help', 'name', 'title', 'bio', 'skills', 'projects', 'experience', 'education', 'contact', 'stats', 'clear', 'whoami', 'github', 'resume', 'date', 'echo', 'ls', 'pwd', 'stack', 'abroad'];

function termInit() {
  const p = dbData.profile || {};
  const fullName = `${p.firstname || 'Meet'} ${p.lastname || 'Parmar'}`;

  termPrint(`<span class="tc-dim">┌─────────────────────────────────────────────────────────────┐</span>`);
  termPrint(`<span class="tc-dim">│</span>  <span class="tc-a" style="font-size:.95rem;font-weight:700">${fullName}'s Portfolio Terminal</span>`);
  termPrint(`<span class="tc-dim">│</span>  <span class="tc-dim">Full-Stack Developer · React · Node.js · ASP.NET C#</span>`);
  termPrint(`<span class="tc-dim">└─────────────────────────────────────────────────────────────┘</span>`);
  termPrint(``);
  termPrint(`<span class="tc-g">System</span> <span class="tc-dim">→</span> Welcome! Type <span class="tc-a">help</span> to see all commands. Press <span class="tc-a">↑↓</span> for history, <span class="tc-a">Tab</span> to autocomplete.`);
  termPrint(``);

  const input = document.getElementById('term-input');
  input.addEventListener('keydown', onTermKey);
  document.getElementById('term-body').addEventListener('click', () => input.focus({ preventScroll: true }));
  document.querySelector('.term-input-row').addEventListener('click', () => input.focus({ preventScroll: true }));
}

function onTermKey(e) {
  const input = document.getElementById('term-input');
  if (e.key === 'Enter') {
    const cmd = input.value.trim();
    if (cmd) {
      cmdHistory.unshift(cmd);
      histIdx = -1;
      termPrint(`<span class="tp-user">guest</span><span class="tc-dim">@</span><span class="tp-dir">portfolio</span><span class="tp-sym"> ~ %</span> <span class="tc-text">${esc(cmd)}</span>`);
      runCmd(cmd.toLowerCase().trim());
    } else {
      termPrint(``);
    }
    input.value = '';
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (histIdx < cmdHistory.length - 1) { histIdx++; input.value = cmdHistory[histIdx]; }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    histIdx > 0 ? (histIdx--, input.value = cmdHistory[histIdx]) : (histIdx = -1, input.value = '');
  } else if (e.key === 'Tab') {
    e.preventDefault();
    const val = input.value.toLowerCase();
    const match = COMMANDS.find(c => c.startsWith(val) && c !== val);
    if (match) input.value = match;
  }
}

function runCmd(raw) {
  const parts = raw.split(/\s+/);
  const cmd = parts[0];
  const args = parts.slice(1).join(' ');
  const p = dbData.profile || {};

  const handlers = {
    help: () => {
      termPrint(`
<span class="tc-a"> Command       Description</span>
<span class="tc-dim"> ──────────    ─────────────────────────────────────</span>
 <span class="tc-g">whoami</span>        Full intro — name, role, status, stack
 <span class="tc-g">name</span>          My full name
 <span class="tc-g">title</span>         My current role/title
 <span class="tc-g">bio</span>           About me paragraph
 <span class="tc-g">stack</span>         My complete tech stack
 <span class="tc-g">skills</span>        Skill categories with items
 <span class="tc-g">projects</span>      All my projects
 <span class="tc-g">experience</span>    Work history
 <span class="tc-g">contact</span>       Get in touch
 <span class="tc-g">stats</span>         Key career stats
 <span class="tc-g">abroad</span>        Why hire me internationally
 <span class="tc-g">github</span>        Open GitHub profile
 <span class="tc-g">resume</span>        Open/download resume
 <span class="tc-g">date</span>          Current time
 <span class="tc-g">echo [text]</span>   Print text
 <span class="tc-g">ls</span>            List page sections
 <span class="tc-g">clear</span>         Clear terminal`);
    },

    whoami: () => {
      termPrint(`
  <span class="tc-a">Name    </span>  ${p.firstname || ''} ${p.lastname || ''}
  <span class="tc-a">Role    </span>  ${p.title || ''}
  <span class="tc-a">Status  </span>  <span class="tc-g">${p.tag || ''}</span>
  <span class="tc-a">Stack   </span>  React · Node.js · ASP.NET C# · AJAX · JS
  <span class="tc-a">GitHub  </span>  <a href="${p.github || '#'}" target="_blank" class="tc-p">${p.github || 'N/A'}</a>`);
    },

    name: () => termPrint(`  <span class="tc-g">▸</span>  <span class="tc-text" style="font-weight:600">${p.firstname || ''} ${p.lastname || ''}</span>`),
    title: () => termPrint(`  <span class="tc-g">▸</span>  <span class="tc-a">${p.title || 'N/A'}</span>`),
    bio: () => termPrint(`  <span class="tc-g">▸</span>  <span class="tc-text">${p.bio || 'No bio.'}</span>`),

    stack: () => {
      termPrint(`
  <span class="tc-a">Frontend  </span>  <span class="tc-text">React.js · HTML5 · CSS3 · JavaScript (ES6+) · AJAX · jQuery</span>
  <span class="tc-a">Backend   </span>  <span class="tc-text">Node.js · Express.js · ASP.NET Core · C# · REST APIs · MVC</span>
  <span class="tc-a">Database  </span>  <span class="tc-text">MS SQL Server · MySQL · MongoDB · Entity Framework · LINQ</span>
  <span class="tc-a">Tools     </span>  <span class="tc-text">Git · GitHub · Visual Studio · VS Code · Postman · IIS</span>`);
    },

    skills: () => {
      const skills = dbData.skills || [];
      if (!skills.length) return termPrint(`<span class="tc-dim">No skill data.</span>`);
      let out = `  <span class="tc-a">Tech Skills</span>\n`;
      skills.forEach(c => {
        out += `\n  <span class="tc-p">${c.icon}  ${c.category}</span>\n`;
        out += `     <span class="tc-text">${(c.items || []).join('  ·  ')}</span>`;
      });
      termPrint(out);
    },

    projects: () => {
      const projs = dbData.projects || [];
      if (!projs.length) return termPrint(`<span class="tc-dim">No projects.</span>`);
      let out = `  <span class="tc-a">Projects</span>\n`;
      projs.forEach((pr, i) => {
        out += `\n  <span class="tc-g">${i + 1}.</span> <span class="tc-text" style="font-weight:600">${pr.name}</span>${pr.featured ? '  <span class="feat-inline">★ Featured</span>' : ''}\n`;
        out += `     <span class="tc-dim">${pr.desc}</span>\n`;
        out += `     <span class="tc-a">Tech:</span> <span class="tc-text">${(pr.tech || []).join(' · ')}</span>\n`;
        if (pr.github && pr.github !== '#') out += `     <span class="tc-a">Link:</span> <a href="${pr.github}" target="_blank" class="tc-p">${pr.github}</a>`;
      });
      termPrint(out);
    },

    experience: () => {
      const exps = dbData.experience || [];
      if (!exps.length) return termPrint(`<span class="tc-dim">No experience.</span>`);
      let out = `  <span class="tc-a">Work Experience</span>\n`;
      exps.forEach(e => {
        out += `\n  <span class="tc-g">${e.role}</span> <span class="tc-dim">@</span> <span class="tc-a">${e.company}</span>${e.current ? ` <span class="tc-g" style="font-size:.75rem">[Current]</span>` : ''}\n`;
        out += `  <span class="tc-dim">Period: ${e.period}</span>\n`;
        out += `  <span class="tc-text">${e.desc}</span>\n`;
        if (e.skills?.length) out += `  <span class="tc-dim">${e.skills.join(' · ')}</span>`;
      });
      termPrint(out);
    },

    education: () => {
      const edu = dbData.education || [];
      if (!edu.length) return termPrint(`<span class="tc-dim">No education data.</span>`);
      let out = `  <span class="tc-a">Education</span>\n`;
      edu.forEach(e => {
        out += `\n  <span class="tc-g">${e.degree}</span>\n`;
        out += `  <span class="tc-a">  ${e.field}</span>\n`;
        out += `  <span class="tc-dim">  ${e.institution} · ${e.location}</span>\n`;
        out += `  <span class="tc-dim">  ${e.period} · </span><span class="tc-g">${e.grade}</span>\n`;
        if (e.highlights?.length) out += `  <span class="tc-dim">  Subjects: ${e.highlights.join(', ')}</span>`;
      });
      termPrint(out);
    },

    contact: () => {
      const contacts = dbData.contact || [];
      if (!contacts.length) return termPrint(`<span class="tc-dim">No contact info.</span>`);
      let out = `  <span class="tc-a">Contact</span>\n`;
      contacts.forEach(c => {
        out += `\n  ${c.icon}  <span class="tc-p">${c.label}</span>  <a href="${c.href}" target="_blank" class="tc-text">${c.value}</a>`;
      });
      termPrint(out);
    },

    stats: () => {
      const stats = dbData.stats || [];
      if (!stats.length) return termPrint(`<span class="tc-dim">No stats.</span>`);
      let out = `  <span class="tc-a">Stats</span>\n`;
      stats.forEach(s => {
        out += `\n  <span class="tc-g" style="font-size:1.1rem">${s.num}</span>  <span class="tc-text">${s.label}</span>`;
      });
      termPrint(out);
    },

    abroad: () => {
      termPrint(`
  <span class="tc-a" style="font-weight:700">Why hire me for abroad roles?</span>

  <span class="tc-g">✔</span>  <span class="tc-text">Proficient in industry-standard stacks used globally</span>
     <span class="tc-dim">React · Node.js · ASP.NET Core C# · SQL Server</span>

  <span class="tc-g">✔</span>  <span class="tc-text">Experience building enterprise-grade full-stack applications</span>

  <span class="tc-g">✔</span>  <span class="tc-text">Clean, maintainable code following SOLID principles & MVC architecture</span>

  <span class="tc-g">✔</span>  <span class="tc-text">Fast learner, self-motivated and comfortable working remotely</span>

  <span class="tc-g">✔</span>  <span class="tc-text">Open to relocation and international work environments</span>

  <span class="tc-a">→</span>  Type <span class="tc-a">contact</span> to reach out or <span class="tc-a">resume</span> to download my CV.`);
    },

    github: () => {
      if (p.github && p.github !== '#') {
        window.open(p.github, '_blank');
        termPrint(`  <span class="tc-g">▸</span>  Opening: <a href="${p.github}" target="_blank" class="tc-a">${p.github}</a>`);
      } else termPrint(`<span class="tc-dim">GitHub not set. Update in admin panel.</span>`);
    },

    resume: () => {
      if (p.resume && p.resume !== '#') {
        window.open(p.resume, '_blank');
        termPrint(`  <span class="tc-g">▸</span>  Opening resume…`);
      } else termPrint(`<span class="tc-dim">Resume URL not set. Please update it in the </span><a href="/admin" class="tc-a">admin panel</a><span class="tc-dim">.</span>`);
    },

    date: () => termPrint(`  <span class="tc-g">▸</span>  <span class="tc-text">${new Date().toLocaleString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>`),

    echo: () => termPrint(`  <span class="tc-text">${esc(args)}</span>`),

    ls: () => termPrint(`  <span class="tc-a">skills/</span>  <span class="tc-p">projects/</span>  <span class="tc-a">experience/</span>  <span class="tc-p">contact/</span>  <span class="tc-g">terminal/</span>`),

    pwd: () => termPrint(`  <span class="tc-dim">/home/guest/portfolio/meet-parmar</span>`),

    clear: () => { clearTerminal(); return; }
  };

  if (handlers[cmd]) {
    handlers[cmd]();
  } else {
    termPrint(`  <span class="tc-err">zsh: command not found: ${esc(cmd)}</span>`);
    termPrint(`  <span class="tc-dim">Type <span class="tc-a">help</span> to see available commands.</span>`);
  }
  termPrint(``);
}

function termPrint(html) {
  const body = document.getElementById('term-body');
  const line = document.createElement('div');
  line.className = 'tl';
  line.innerHTML = html;
  body.appendChild(line);
  body.scrollTop = body.scrollHeight;
}

function initFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderPortfolio(btn.dataset.filter);
    });
  });
}

function clearTerminal() {
  document.getElementById('term-body').innerHTML = '';
  document.getElementById('term-input').value = '';
  termPrint(`<span class="tc-dim">Terminal cleared. Type <span class="tc-a">help</span> for commands.</span>`);
  termPrint(``);
}

function esc(s) {
  return (s || '').toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

document.addEventListener('DOMContentLoaded', loadData);
