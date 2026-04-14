let dbData = {};
let curColl = 'profile', editId = null;

const COLL_ICONS = {profile:'👤',stats:'📊',skills:'⚡',projects:'🚀',experience:'💼',contact:'✉️'};
const COLL_COLORS = {profile:'var(--accent)',stats:'var(--yellow)',skills:'var(--accent)',projects:'var(--accent3)',experience:'var(--accent2)',contact:'var(--green)'};
const TEMPLATES = {
  stats:      {num:"0",label:"New Stat"},
  skills:     {category:"New Category",icon:"🔧",color:"#ffffff",items:["Item 1"]},
  projects:   {name:"New Project",desc:"Description",icon:"💡",tech:["Tech"],stars:"0",forks:"0",github:"#",live:"#",featured:false},
  experience: {role:"Role",company:"Company",period:"2024 — Present",current:false,desc:"Description",skills:["Skill"]},
  contact:    {label:"Platform",value:"username",icon:"🔗",href:"#"}
};

// Data Persistence
async function loadData() {
  try {
    const res = await fetch('/api/data');
    if (!res.ok) throw new Error('Network response was not ok');
    dbData = await res.json();
    console.log('Admin Data loaded:', dbData);
    refreshAdminStats();
    openColl(curColl);
  } catch (err) {
    console.error('Failed to load data:', err);
    toast('Data load failed: ' + err.message, 'error');
  }
}

async function saveData() {
  try {
    const res = await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dbData)
    });
    if (!res.ok) throw new Error('Save failed');
    toast('Changes saved to disk ✓');
  } catch (err) {
    console.error('Save error:', err);
    toast('Save failed', 'error');
  }
}

function refreshAdminStats() {
  const keys = Object.keys(dbData);
  const docs = keys.reduce((s, k) => s + (Array.isArray(dbData[k]) ? dbData[k].length : 1), 0);
  const dDocs = document.getElementById('db-docs');
  const dCols = document.getElementById('db-cols');
  const aStats = document.getElementById('a-stats');

  if (dDocs) dDocs.textContent = docs;
  if (dCols) dCols.textContent = keys.length;
  if (aStats) {
    aStats.innerHTML = keys.map(k => `
      <div class="sb"><div class="sb-n">${Array.isArray(dbData[k]) ? dbData[k].length : 1}</div><div class="sb-l">${k}</div></div>`).join('');
  }
}

function openColl(name) {
  curColl = name;
  document.querySelectorAll('.asb').forEach(b => b.classList.remove('active'));
  const sb = document.getElementById('sb-' + name);
  if (sb) sb.classList.add('active');
  const docs = Array.isArray(dbData[name]) ? dbData[name] : [dbData[name]];
  
  const acTitle = document.getElementById('ac-title');
  const acMeta = document.getElementById('ac-meta');
  if (acTitle) acTitle.textContent = `${COLL_ICONS[name] || '📁'} ${name}`;
  if (acMeta) acMeta.textContent = `${docs.length} document${docs.length !== 1 ? 's' : ''}`;
  
  name === 'profile' ? renderProfileForm() : renderDocList(name);
}

function renderProfileForm() {
  const p = dbData.profile || {};
  const acBody = document.getElementById('ac-body');
  if (!acBody) return;
  acBody.innerHTML = `
    <div class="fg">
      <div class="fi"><label class="fl">First Name</label><input class="finp" id="pf-fn" value="${xe(p.firstname)}"></div>
      <div class="fi"><label class="fl">Last Name</label><input class="finp" id="pf-ln" value="${xe(p.lastname)}"></div>
    </div>
    <div class="fg fg1">
      <div class="fi"><label class="fl">Role / Title</label><input class="finp" id="pf-ti" value="${xe(p.title)}"></div>
    </div>
    <div class="fg fg1">
      <div class="fi"><label class="fl">Bio</label><textarea class="finp" id="pf-bi">${xe(p.bio)}</textarea></div>
    </div>
    <div class="fg">
      <div class="fi"><label class="fl">Status Tag</label><input class="finp" id="pf-tag" value="${xe(p.tag)}"></div>
      <div class="fi"><label class="fl">Greeting</label><input class="finp" id="pf-gr" value="${xe(p.greeting)}"></div>
    </div>
    <div class="fg">
      <div class="fi"><label class="fl">Resume URL</label><input class="finp" id="pf-re" value="${xe(p.resume)}"></div>
      <div class="fi"><label class="fl">GitHub URL</label><input class="finp" id="pf-gh" value="${xe(p.github)}"></div>
    </div>
    <div class="ar">
      <button class="bs" onclick="saveProfileForm()">Update Document</button>
    </div>`;
}

function saveProfileForm() {
  dbData.profile = {
    ...dbData.profile,
    firstname: ge('pf-fn'), lastname: ge('pf-ln'), title: ge('pf-ti'),
    bio: ge('pf-bi'), tag: ge('pf-tag'), greeting: ge('pf-gr'),
    resume: ge('pf-re'), github: ge('pf-gh')
  };
  saveData().then(() => { refreshAdminStats(); toast('Profile updated ✓'); });
}

function renderDocList(name) {
  const docs = dbData[name] || [];
  const list = docs.map(d => `
    <div class="di">
      <div class="di-l"><span class="di-id">${d._id}</span><span class="di-pv">${docPreview(d)}</span></div>
      <div class="di-act">
        <button class="dab edit" onclick="openEditModal('${name}','${d._id}')">✏</button>
        <button class="dab del" onclick="deleteDoc('${name}','${d._id}')">✕</button>
      </div>
    </div>`).join('') || '<div style="color:var(--muted);padding:14px 0">No documents.</div>';

  const acBody = document.getElementById('ac-body');
  if (acBody) {
    acBody.innerHTML = `
      <div class="doc-list">${list}</div>
      <div class="ar"><button class="bs" onclick="openInsertModal('${name}')">+ Insert Document</button></div>`;
  }
}

function docPreview(d) {
  return Object.entries(d).filter(([k]) => k !== '_id').slice(0, 2)
    .map(([k, v]) => `${k}: ${v}`).join(' · ').slice(0, 80);
}

function openEditModal(name, id) {
  curColl = name; editId = id;
  const doc = dbData[name].find(d => d._id === id);
  const mT = document.getElementById('m-title');
  const mJ = document.getElementById('m-json');
  if (mT) mT.textContent = `Edit ${name} · ${id}`;
  if (mJ) mJ.value = JSON.stringify(doc, null, 2);
  const dm = document.getElementById('doc-modal');
  if (dm) dm.classList.add('open');
}

function openInsertModal(name) {
  curColl = name; editId = null;
  const mT = document.getElementById('m-title');
  const mJ = document.getElementById('m-json');
  if (mT) mT.textContent = `Insert into ${name}`;
  if (mJ) mJ.value = JSON.stringify(TEMPLATES[name] || {}, null, 2);
  const dm = document.getElementById('doc-modal');
  if (dm) dm.classList.add('open');
}

function saveModalDoc() {
  try {
    const doc = JSON.parse(document.getElementById('m-json').value);
    if (editId) {
      const idx = dbData[curColl].findIndex(d => d._id === editId);
      dbData[curColl][idx] = { ...doc, _id: editId };
    } else {
      if (!dbData[curColl]) dbData[curColl] = [];
      doc._id = `${curColl}_${Date.now()}`;
      dbData[curColl].push(doc);
    }
    saveData().then(() => {
      closeModal('doc-modal');
      openColl(curColl);
      refreshAdminStats();
      toast('Saved ✓');
    });
  } catch (e) { toast('Invalid JSON', 'error'); }
}

function deleteDoc(name, id) {
  if (!confirm('Delete document?')) return;
  dbData[name] = dbData[name].filter(d => d._id !== id);
  saveData().then(() => { openColl(name); refreshAdminStats(); toast('Deleted'); });
}

function closeModal(id) { const el = document.getElementById(id); if (el) el.classList.remove('open'); }
function ge(id) { const el = document.getElementById(id); return el ? el.value : ''; }
function xe(s) { return (s || '').toString().replace(/"/g, '&quot;'); }
function toast(msg, type = 'success') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg; t.className = `toast ${type} show`;
  setTimeout(() => t.classList.remove('show'), 2000);
}

function exportDB() {
  const blob = new Blob([JSON.stringify(dbData, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'portfolio-db.json';
  a.click();
  toast('Exported ✓');
}

async function resetDB() {
  if (!confirm('Reset all data to defaults?')) return;
  const SEED = {
    profile:{firstname:"Alex",lastname:"Morgan",title:"// Full-Stack Developer",bio:"Bio here",tag:"Available for Work",greeting:"Hello, I'm",resume:"#",github:"#",_id:"profile_1"},
    stats:[],skills:[],projects:[],experience:[],contact:[]
  };
  dbData = SEED;
  await saveData();
  refreshAdminStats();
  openColl(curColl);
  toast('Reset to defaults ✓');
}

// Init
document.addEventListener('DOMContentLoaded', loadData);
