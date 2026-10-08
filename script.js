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
  ["act", "✨", "Активисты", "Под контролем PR/Менеджера", "Это участники чата, которые находятся под координацией PR/Менеджера и помогают ему в продвижении и развитии чата. Они принимают участие в создании видеороликов и другого рекламного контента, помогают организовывать различные мероприятия, активности и события, направленные на привлечение и удержание участников. Их основная задача — содействовать PR/Менеджеру в повышении активности чата, его узнаваемости и привлечении новой аудитории."],
  ["sec", "🛡️", "Секьюрити", "Оперативное подразделение", "Это специалист, отвечающий за обеспечение безопасности и порядка в чате. Его основная задача — предотвращение нарушений правил, выявление и пресечение вредоносной деятельности, а также применение санкций к нарушителям. В отличие от обычного модератора, чьи обязанности могут включать широкий спектр модерации контента, секьюрити часто фокусируется на конкретных аспектах безопасности, таких как борьба со спамом, мошенничеством, угрозами и другими видами неправомерного поведения."]
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
    throw new Error(result.error || "Ошибка сервера");
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
    icon: "⭐",
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
      <h2>РУКОВОДСТВО АДМИНИСТРАЦИИ</h2>
      <p>Справочник структуры, должностей и обязанностей администрации чата.</p>
    </div>

    <h3>Структура</h3>

    <button class="btn" onclick="group('admin')">
      <span class="icon">🏛️</span>
      <span class="txt"><b>Административное управление</b><small>Общее управление и стратегическое планирование</small></span>
      <span class="arrow">›</span>
    </button>

    <button class="btn" onclick="group('op')">
      <span class="icon">⚙️</span>
      <span class="txt"><b>Оперативное управление</b><small>Текущая деятельность и выполнение задач</small></span>
      <span class="arrow">›</span>
    </button>

    <h3>Справочник должностей</h3>

    ${list.map(r => `
      <button class="btn" onclick="role(${r.id})">
        <span class="icon">${"⭐".repeat(Math.max(1, Math.min(5, r.stars)))}</span>
        <span class="txt">
          <b>${esc(r.title)}</b>
          <small>${esc(r.person_name)}</small>
        </span>
        <span class="arrow">›</span>
      </button>
    `).join("")}

    ${staticRoles.map(r => `
      <button class="btn" onclick="staticRole('${r[0]}')">
        <span class="icon">${r[1]}</span>
        <span class="txt"><b>${esc(r[2])}</b><small>${esc(r[3])}</small></span>
        <span class="arrow">›</span>
      </button>
    `).join("")}

    <button id="manageBtn" class="manage-btn" onclick="manage()" style="display:${isOwner ? "block" : "none"}">
      ⚙️ Управление
    </button>
  `;

  scrollTo(0,0);
}

function role(id) {
  const r = allRoles().find(x => Number(x.id) === Number(id));
  if (!r) return;

  document.getElementById("content").innerHTML = `
    <button class="back" onclick="home()">← Назад</button>

    <article class="card">
      ${r.photo_url ? `<img class="role-photo" src="${esc(r.photo_url)}">` : ""}
      <h2>${"⭐".repeat(Math.max(1, Math.min(5, r.stars)))} ${esc(r.title)}</h2>
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
    <button class="back" onclick="home()">← Назад</button>
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
    <button class="back" onclick="home()">← Назад</button>

    <div class="card">
      <h2>${type === "admin" ? "🏛️ Административное управление" : "⚙️ Оперативное управление"}</h2>
      <p>${type === "admin"
        ? "Общее управление деятельности, стратегическое планирование, координация деятельности различных подразделений."
        : "Управление текущей деятельностью организации, выполнение планов и задач."}</p>
    </div>

    <h3>Должности</h3>

    ${list.map(r => `
      <button class="btn" onclick="role(${r.id})">
        <span class="icon">${"⭐".repeat(Math.max(1, Math.min(5, r.stars)))}</span>
        <span class="txt"><b>${esc(r.title)}</b><small>${esc(r.person_name)}</small></span>
        <span class="arrow">›</span>
      </button>
    `).join("")}
  `;

  scrollTo(0,0);
}

function manage() {
  if (!isOwner) return;

  document.getElementById("content").innerHTML = `
    <button class="back" onclick="home()">← Назад</button>

    <div class="card">
      <h2>⚙️ Управление</h2>
      <p>Добавление и изменение должностей.</p>

      <button class="btn" onclick="editRoleForm()">
        <span class="icon">➕</span>
        <span class="txt"><b>Добавить должность</b><small>Создать новую запись</small></span>
        <span class="arrow">›</span>
      </button>
    </div>

    <h3>Должности</h3>

    ${allRoles().map(r => `
      <div class="admin-item">
        <div>
          <b>${esc(r.title)}</b>
          <small>${esc(r.person_name)}</small>
        </div>
        <div class="admin-actions">
          <button onclick="editRoleForm(${r.id})">✏️</button>
          <button onclick="deleteRole(${r.id})">🗑️</button>
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
    <button class="back" onclick="manage()">← Назад</button>

    <div class="card">
      <h2>${r ? "✏️ Изменить должность" : "➕ Новая должность"}</h2>

      <label>Название должности</label>
      <input id="roleTitle" value="${esc(r?.title || "")}" placeholder="Например: Глав/Админ">

      <label>Имя</label>
      <input id="roleName" value="${esc(r?.person_name || "")}" placeholder="Имя">

      <label>Количество звёзд</label>
      <input id="roleStars" type="number" min="1" max="5" value="${r?.stars || 1}">

      <label>Описание</label>
      <textarea id="roleDescription" rows="7" placeholder="Описание должности">${esc(r?.description || "")}</textarea>

      <label>Порядок</label>
      <input id="roleOrder" type="number" value="${r?.sort_order ?? 0}">

      <label>Фото</label>
      <input id="rolePhoto" type="file" accept="image/*">

      <button class="save-btn" onclick="saveRole(${id || "null"})">
        💾 Сохранить
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
    alert("Укажи название должности.");
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
    alert("Сохранено.");
  } catch (e) {
    alert("Ошибка: " + e.message);
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

  if (!confirm("Удалить эту должность?")) return;

  try {
    await api("delete", { id });
    await loadRoles();
    alert("Удалено.");
  } catch (e) {
    alert("Ошибка: " + e.message);
  }
}

async function start() {
  await checkOwner();
  await loadRoles();
}

start();
