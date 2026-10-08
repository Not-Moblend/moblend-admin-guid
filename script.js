const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();
}

const SUPABASE_FUNCTION_URL =
  "https://gbpgmfnyottoobjimebm.supabase.co/functions/v1/super-task";

let roles = [];
let isOwner = false;

const staticRoles = [
  ["act", "вњЁ", "РђРєС‚РёРІРёСЃС‚С‹", "РџРѕРґ РєРѕРЅС‚СЂРѕР»РµРј PR/РњРµРЅРµРґР¶РµСЂР°", "Р­С‚Рѕ СѓС‡Р°СЃС‚РЅРёРєРё С‡Р°С‚Р°, РєРѕС‚РѕСЂС‹Рµ РЅР°С…РѕРґСЏС‚СЃСЏ РїРѕРґ РєРѕРѕСЂРґРёРЅР°С†РёРµР№ PR/РњРµРЅРµРґР¶РµСЂР° Рё РїРѕРјРѕРіР°СЋС‚ РµРјСѓ РІ РїСЂРѕРґРІРёР¶РµРЅРёРё Рё СЂР°Р·РІРёС‚РёРё С‡Р°С‚Р°. РћРЅРё РїСЂРёРЅРёРјР°СЋС‚ СѓС‡Р°СЃС‚РёРµ РІ СЃРѕР·РґР°РЅРёРё РІРёРґРµРѕСЂРѕР»РёРєРѕРІ Рё РґСЂСѓРіРѕРіРѕ СЂРµРєР»Р°РјРЅРѕРіРѕ РєРѕРЅС‚РµРЅС‚Р°, РїРѕРјРѕРіР°СЋС‚ РѕСЂРіР°РЅРёР·РѕРІС‹РІР°С‚СЊ СЂР°Р·Р»РёС‡РЅС‹Рµ РјРµСЂРѕРїСЂРёСЏС‚РёСЏ, Р°РєС‚РёРІРЅРѕСЃС‚Рё Рё СЃРѕР±С‹С‚РёСЏ, РЅР°РїСЂР°РІР»РµРЅРЅС‹Рµ РЅР° РїСЂРёРІР»РµС‡РµРЅРёРµ Рё СѓРґРµСЂР¶Р°РЅРёРµ СѓС‡Р°СЃС‚РЅРёРєРѕРІ. РС… РѕСЃРЅРѕРІРЅР°СЏ Р·Р°РґР°С‡Р° вЂ” СЃРѕРґРµР№СЃС‚РІРѕРІР°С‚СЊ PR/РњРµРЅРµРґР¶РµСЂСѓ РІ РїРѕРІС‹С€РµРЅРёРё Р°РєС‚РёРІРЅРѕСЃС‚Рё С‡Р°С‚Р°, РµРіРѕ СѓР·РЅР°РІР°РµРјРѕСЃС‚Рё Рё РїСЂРёРІР»РµС‡РµРЅРёРё РЅРѕРІРѕР№ Р°СѓРґРёС‚РѕСЂРёРё."],
  ["sec", "рџ›ЎпёЏ", "РЎРµРєСЊСЋСЂРёС‚Рё", "РћРїРµСЂР°С‚РёРІРЅРѕРµ РїРѕРґСЂР°Р·РґРµР»РµРЅРёРµ", "Р­С‚Рѕ СЃРїРµС†РёР°Р»РёСЃС‚, РѕС‚РІРµС‡Р°СЋС‰РёР№ Р·Р° РѕР±РµСЃРїРµС‡РµРЅРёРµ Р±РµР·РѕРїР°СЃРЅРѕСЃС‚Рё Рё РїРѕСЂСЏРґРєР° РІ С‡Р°С‚Рµ. Р•РіРѕ РѕСЃРЅРѕРІРЅР°СЏ Р·Р°РґР°С‡Р° вЂ” РїСЂРµРґРѕС‚РІСЂР°С‰РµРЅРёРµ РЅР°СЂСѓС€РµРЅРёР№ РїСЂР°РІРёР», РІС‹СЏРІР»РµРЅРёРµ Рё РїСЂРµСЃРµС‡РµРЅРёРµ РІСЂРµРґРѕРЅРѕСЃРЅРѕР№ РґРµСЏС‚РµР»СЊРЅРѕСЃС‚Рё, Р° С‚Р°РєР¶Рµ РїСЂРёРјРµРЅРµРЅРёРµ СЃР°РЅРєС†РёР№ Рє РЅР°СЂСѓС€РёС‚РµР»СЏРј. Р’ РѕС‚Р»РёС‡РёРµ РѕС‚ РѕР±С‹С‡РЅРѕРіРѕ РјРѕРґРµСЂР°С‚РѕСЂР°, С‡СЊРё РѕР±СЏР·Р°РЅРЅРѕСЃС‚Рё РјРѕРіСѓС‚ РІРєР»СЋС‡Р°С‚СЊ С€РёСЂРѕРєРёР№ СЃРїРµРєС‚СЂ РјРѕРґРµСЂР°С†РёРё РєРѕРЅС‚РµРЅС‚Р°, СЃРµРєСЊСЋСЂРёС‚Рё С‡Р°СЃС‚Рѕ С„РѕРєСѓСЃРёСЂСѓРµС‚СЃСЏ РЅР° РєРѕРЅРєСЂРµС‚РЅС‹С… Р°СЃРїРµРєС‚Р°С… Р±РµР·РѕРїР°СЃРЅРѕСЃС‚Рё, С‚Р°РєРёС… РєР°Рє Р±РѕСЂСЊР±Р° СЃРѕ СЃРїР°РјРѕРј, РјРѕС€РµРЅРЅРёС‡РµСЃС‚РІРѕРј, СѓРіСЂРѕР·Р°РјРё Рё РґСЂСѓРіРёРјРё РІРёРґР°РјРё РЅРµРїСЂР°РІРѕРјРµСЂРЅРѕРіРѕ РїРѕРІРµРґРµРЅРёСЏ."]
];

const esc = s =>
  String(s ?? "").replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));

async function api(action, data = {}) {
  const initData = tg?.initData || "";

  const response = await fetch(SUPABASE_FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, initData, ...data })
  });

  const result = await response.json();

  if (!response.ok || result.error) {
    throw new Error(result.error || "РћС€РёР±РєР° СЃРµСЂРІРµСЂР°");
  }

  return result;
}

async function loadRoles() {
  try {
    const result = await api("list");
    roles = Array.isArray(result.roles) ? result.roles : [];
  } catch (e) {
    roles = [];
    console.error(e);
  }

  home();
}

async function checkOwner() {
  try {
    const result = await api("auth");
    isOwner = !!result.is_owner;

    const manage = document.getElementById("manageBtn");
    if (manage) manage.style.display = isOwner ? "block" : "none";
  } catch (e) {
    isOwner = false;
  }
}

function allRoles() {
  return roles.map(r => ({
    id: r.id,
    key: "role-" + r.id,
    icon: "в­ђ",
    title: r.title,
    person_name: r.person_name || "",
    stars: Number(r.stars || 1),
    description: r.description || "",
    photo_url: r.photo_url || "",
    sort_order: Number(r.sort_order || 0)
  })).sort((a,b) => a.sort_order - b.sort_order);
}

function home() {
  const list = allRoles();

  document.getElementById("content").innerHTML = `
    <div class="intro">
      <h2>Р РЈРљРћР’РћР”РЎРўР’Рћ РђР”РњРРќРРЎРўР РђР¦РР</h2>
      <p>РЎРїСЂР°РІРѕС‡РЅРёРє СЃС‚СЂСѓРєС‚СѓСЂС‹, РґРѕР»Р¶РЅРѕСЃС‚РµР№ Рё РѕР±СЏР·Р°РЅРЅРѕСЃС‚РµР№ Р°РґРјРёРЅРёСЃС‚СЂР°С†РёРё С‡Р°С‚Р°.</p>
    </div>

    <h3>РЎС‚СЂСѓРєС‚СѓСЂР°</h3>

    <button class="btn" onclick="group('admin')">
      <span class="icon">рџЏ›пёЏ</span>
      <span class="txt"><b>РђРґРјРёРЅРёСЃС‚СЂР°С‚РёРІРЅРѕРµ СѓРїСЂР°РІР»РµРЅРёРµ</b><small>РћР±С‰РµРµ СѓРїСЂР°РІР»РµРЅРёРµ Рё СЃС‚СЂР°С‚РµРіРёС‡РµСЃРєРѕРµ РїР»Р°РЅРёСЂРѕРІР°РЅРёРµ</small></span>
      <span class="arrow">вЂє</span>
    </button>

    <button class="btn" onclick="group('op')">
      <span class="icon">вљ™пёЏ</span>
      <span class="txt"><b>РћРїРµСЂР°С‚РёРІРЅРѕРµ СѓРїСЂР°РІР»РµРЅРёРµ</b><small>РўРµРєСѓС‰Р°СЏ РґРµСЏС‚РµР»СЊРЅРѕСЃС‚СЊ Рё РІС‹РїРѕР»РЅРµРЅРёРµ Р·Р°РґР°С‡</small></span>
      <span class="arrow">вЂє</span>
    </button>

    <h3>РЎРїСЂР°РІРѕС‡РЅРёРє РґРѕР»Р¶РЅРѕСЃС‚РµР№</h3>

    ${list.map(r => `
      <button class="btn" onclick="role(${r.id})">
        <span class="icon">${"в­ђ".repeat(Math.max(1, Math.min(5, r.stars)))}</span>
        <span class="txt">
          <b>${esc(r.title)}</b>
          <small>${esc(r.person_name)}</small>
        </span>
        <span class="arrow">вЂє</span>
      </button>
    `).join("")}

    ${staticRoles.map(r => `
      <button class="btn" onclick="staticRole('${r[0]}')">
        <span class="icon">${r[1]}</span>
        <span class="txt"><b>${esc(r[2])}</b><small>${esc(r[3])}</small></span>
        <span class="arrow">вЂє</span>
      </button>
    `).join("")}

    <button id="manageBtn" class="manage-btn" onclick="manage()" style="display:${isOwner ? "block" : "none"}">
      вљ™пёЏ РЈРїСЂР°РІР»РµРЅРёРµ
    </button>
  `;

  scrollTo(0,0);
}

function role(id) {
  const r = allRoles().find(x => Number(x.id) === Number(id));
  if (!r) return;

  document.getElementById("content").innerHTML = `
    <button class="back" onclick="home()">в†ђ РќР°Р·Р°Рґ</button>

    <article class="card">
      ${r.photo_url ? `<img class="role-photo" src="${esc(r.photo_url)}">` : ""}
      <h2>${"в­ђ".repeat(Math.max(1, Math.min(5, r.stars)))} ${esc(r.title)}</h2>
      <small>${esc(r.person_name)}</small>
      <p>${esc(r.description)}</p>
    </article>
  `;

  scrollTo(0,0);
}

function staticRole(id) {
  const r = staticRoles.find(x => x[0] === id);
  if (!r) return;

  document.getElementById("content").innerHTML = `
    <button class="back" onclick="home()">в†ђ РќР°Р·Р°Рґ</button>
    <article class="card">
      <h2>${r[1]} ${esc(r[2])}</h2>
      <small>${esc(r[3])}</small>
      <p>${esc(r[4])}</p>
    </article>
  `;

  scrollTo(0,0);
}

function group(type) {
  const list = allRoles();

  document.getElementById("content").innerHTML = `
    <button class="back" onclick="home()">в†ђ РќР°Р·Р°Рґ</button>

    <div class="card">
      <h2>${type === "admin" ? "рџЏ›пёЏ РђРґРјРёРЅРёСЃС‚СЂР°С‚РёРІРЅРѕРµ СѓРїСЂР°РІР»РµРЅРёРµ" : "вљ™пёЏ РћРїРµСЂР°С‚РёРІРЅРѕРµ СѓРїСЂР°РІР»РµРЅРёРµ"}</h2>
      <p>${type === "admin"
        ? "РћР±С‰РµРµ СѓРїСЂР°РІР»РµРЅРёРµ РґРµСЏС‚РµР»СЊРЅРѕСЃС‚Рё, СЃС‚СЂР°С‚РµРіРёС‡РµСЃРєРѕРµ РїР»Р°РЅРёСЂРѕРІР°РЅРёРµ, РєРѕРѕСЂРґРёРЅР°С†РёСЏ РґРµСЏС‚РµР»СЊРЅРѕСЃС‚Рё СЂР°Р·Р»РёС‡РЅС‹С… РїРѕРґСЂР°Р·РґРµР»РµРЅРёР№."
        : "РЈРїСЂР°РІР»РµРЅРёРµ С‚РµРєСѓС‰РµР№ РґРµСЏС‚РµР»СЊРЅРѕСЃС‚СЊСЋ РѕСЂРіР°РЅРёР·Р°С†РёРё, РІС‹РїРѕР»РЅРµРЅРёРµ РїР»Р°РЅРѕРІ Рё Р·Р°РґР°С‡."}</p>
    </div>

    <h3>Р”РѕР»Р¶РЅРѕСЃС‚Рё</h3>

    ${list.map(r => `
      <button class="btn" onclick="role(${r.id})">
        <span class="icon">${"в­ђ".repeat(Math.max(1, Math.min(5, r.stars)))}</span>
        <span class="txt"><b>${esc(r.title)}</b><small>${esc(r.person_name)}</small></span>
        <span class="arrow">вЂє</span>
      </button>
    `).join("")}
  `;

  scrollTo(0,0);
}

function manage() {
  if (!isOwner) return;

  document.getElementById("content").innerHTML = `
    <button class="back" onclick="home()">в†ђ РќР°Р·Р°Рґ</button>

    <div class="card">
      <h2>вљ™пёЏ РЈРїСЂР°РІР»РµРЅРёРµ</h2>
      <p>Р”РѕР±Р°РІР»РµРЅРёРµ Рё РёР·РјРµРЅРµРЅРёРµ РґРѕР»Р¶РЅРѕСЃС‚РµР№.</p>

      <button class="btn" onclick="editRoleForm()">
        <span class="icon">вћ•</span>
        <span class="txt"><b>Р”РѕР±Р°РІРёС‚СЊ РґРѕР»Р¶РЅРѕСЃС‚СЊ</b><small>РЎРѕР·РґР°С‚СЊ РЅРѕРІСѓСЋ Р·Р°РїРёСЃСЊ</small></span>
        <span class="arrow">вЂє</span>
      </button>
    </div>

    <h3>Р”РѕР»Р¶РЅРѕСЃС‚Рё</h3>

    ${allRoles().map(r => `
      <div class="admin-item">
        <div>
          <b>${esc(r.title)}</b>
          <small>${esc(r.person_name)}</small>
        </div>
        <div class="admin-actions">
          <button onclick="editRoleForm(${r.id})">вњЏпёЏ</button>
          <button onclick="deleteRole(${r.id})">рџ—‘пёЏ</button>
        </div>
      </div>
    `).join("")}
  `;

  scrollTo(0,0);
}

function editRoleForm(id = null) {
  if (!isOwner) return;

  const r = id ? allRoles().find(x => Number(x.id) === Number(id)) : null;

  document.getElementById("content").innerHTML = `
    <button class="back" onclick="manage()">в†ђ РќР°Р·Р°Рґ</button>

    <div class="card">
      <h2>${r ? "вњЏпёЏ РР·РјРµРЅРёС‚СЊ РґРѕР»Р¶РЅРѕСЃС‚СЊ" : "вћ• РќРѕРІР°СЏ РґРѕР»Р¶РЅРѕСЃС‚СЊ"}</h2>

      <label>РќР°Р·РІР°РЅРёРµ РґРѕР»Р¶РЅРѕСЃС‚Рё</label>
      <input id="roleTitle" value="${esc(r?.title || "")}" placeholder="РќР°РїСЂРёРјРµСЂ: Р“Р»Р°РІ/РђРґРјРёРЅ">

      <label>РРјСЏ</label>
      <input id="roleName" value="${esc(r?.person_name || "")}" placeholder="РРјСЏ">

      <label>РљРѕР»РёС‡РµСЃС‚РІРѕ Р·РІС‘Р·Рґ</label>
      <input id="roleStars" type="number" min="1" max="5" value="${r?.stars || 1}">

      <label>РћРїРёСЃР°РЅРёРµ</label>
      <textarea id="roleDescription" rows="7" placeholder="РћРїРёСЃР°РЅРёРµ РґРѕР»Р¶РЅРѕСЃС‚Рё">${esc(r?.description || "")}</textarea>

      <label>РџРѕСЂСЏРґРѕРє</label>
      <input id="roleOrder" type="number" value="${r?.sort_order ?? 0}">

      <label>Р¤РѕС‚Рѕ</label>
      <input id="rolePhoto" type="file" accept="image/*">

      <button class="save-btn" onclick="saveRole(${id || "null"})">
        рџ’ѕ РЎРѕС…СЂР°РЅРёС‚СЊ
      </button>
    </div>
  `;

  scrollTo(0,0);
}

async function saveRole(id) {
  if (!isOwner) return;

  const title = document.getElementById("roleTitle").value.trim();
  const person_name = document.getElementById("roleName").value.trim();
  const stars = Number(document.getElementById("roleStars").value || 1);
  const description = document.getElementById("roleDescription").value.trim();
  const sort_order = Number(document.getElementById("roleOrder").value || 0);
  const file = document.getElementById("rolePhoto").files[0];

  if (!title) {
    alert("РЈРєР°Р¶Рё РЅР°Р·РІР°РЅРёРµ РґРѕР»Р¶РЅРѕСЃС‚Рё.");
    return;
  }

  let photo_url = id ? (allRoles().find(r => Number(r.id) === Number(id))?.photo_url || "") : "";

  try {
    if (file) {
      const base64 = await fileToBase64(file);

      const upload = await api("upload", {
        fileName: file.name,
        contentType: file.type,
        base64
      });

      photo_url = upload.publicUrl;
    }

    const data = {
      title,
      person_name,
      stars,
      description,
      sort_order,
      photo_url
    };

    if (id) {
      await api("update", { id, data });
    } else {
      await api("create", { data });
    }

    await loadRoles();
    alert("РЎРѕС…СЂР°РЅРµРЅРѕ.");
  } catch (e) {
    alert("РћС€РёР±РєР°: " + e.message);
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = String(reader.result);
      resolve(result.split(",")[1]);
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function deleteRole(id) {
  if (!isOwner) return;

  if (!confirm("РЈРґР°Р»РёС‚СЊ СЌС‚Сѓ РґРѕР»Р¶РЅРѕСЃС‚СЊ?")) return;

  try {
    await api("delete", { id });
    await loadRoles();
    alert("РЈРґР°Р»РµРЅРѕ.");
  } catch (e) {
    alert("РћС€РёР±РєР°: " + e.message);
  }
}

async function start() {
  await checkOwner();
  await loadRoles();
}

start();
