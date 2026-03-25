const app = document.getElementById('app');
const API_URL = 'https://jsonplaceholder.typicode.com';

const MOCK_DATA = [
    { id: 1, title: "Я: НЕ ЗНАЮ ЧТО ТУТ НАПИСАТЬ" },
    { id: 2, title: "НО: ОНО ВРОДЕ РАБОТАЕТ" }
];

async function router(page) {
    document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
    const activeNav = document.getElementById(`nav-${page}`);
    if(activeNav) activeNav.classList.add('active');
    
    app.innerHTML = '<div class="loading">ПОДКЛЮЧЕНИЕ...</div>';

    await new Promise(r => setTimeout(r, 400));

    if (page === 'news') renderNews();
    else if (page === 'create') renderCreate();
    else if (page === 'admin') renderAdmin();
}

// --- GET ---
async function renderNews() {
    try {
        const res = await fetch(`${API_URL}?_limit=3`);
        if(!res.ok) throw new Error();
        const data = await res.json();
        displayNews(data, "ПОСЛЕДНИЕ ОБНОВЛЕНИЯ (ОНЛАЙН)");
    } catch (e) {
        console.warn("VPN/Internet Error. Using Mock Data.");
        displayNews(MOCK_DATA, "ОБНОВЛЕНИЯ (ОФЛАЙН)");
    }
}

function displayNews(data, title) {
    app.innerHTML = `<h2>${title}</h2>` + 
        data.map(p => `<div class="card">
            <div style="color: var(--rbx-blue); font-size: 10px; margin-bottom: 5px;">ТИМОФЕЙ: #${p.id}</div>
            <div style="font-weight: 800;">${p.title}</div>
        </div>`).join('');
}

function renderCreate() {
    app.innerHTML = `<h2>НАДО НАПИСАТЬ ЧТО-ТО ТУТ УРА</h2>
        <div class="card">
            <input type="text" id="username" placeholder="тимофей?">
            <button class="primary" onclick="handlePost()">ОТПРАВИТЬ ЧТО-НИБУДЬ</button>
            <div id="post-status" style="margin-top:15px; font-size:12px; color:var(--rbx-blue)"></div>
            <pre id="post-res" style="display:none; margin-top:10px;"></pre>
        </div>`;
}

async function handlePost() {
    const val = document.getElementById('username').value;
    const resBox = document.getElementById('post-res');
    const status = document.getElementById('post-status');
    if(!val) return alert("Там ничего нет. Надо написать что-нибудь");
    
    status.innerText = "> ОГО КРУТО...";
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({ title: val, userId: 1 }),
            headers: { 'Content-type': 'application/json' }
        });
        const data = await res.json();
        status.innerText = "> ОТВЕТ ПОЛУЧЕН: ЭТО РЕАЛЬНО ОЧЕНЬ КРУТО!:";
        resBox.style.display = 'block';
        resBox.innerText = JSON.stringify(data, null, 2);
    } catch (e) {
        status.innerText = "> ОШИБКА: ИМИТАЦИЯ ОТПРАВКИ (ОТПРАВКА ОФЛАЙН)";
        resBox.style.display = 'block';
        resBox.innerText = JSON.stringify({ id: 101, title: val, status: "OFFLINE_SUCCESS" }, null, 2);
    }
}

function renderAdmin() {
    app.innerHTML = `<h2>ТИМОФЕЙ))))</h2>
        <div class="card" id="item-1">
            <div id="title-1" style="font-weight: 800;">ТИМОФЕЙ</div>
            <div id="admin-log" style="font-size:10px; margin-top:5px; color:var(--rbx-blue)">да что ж она хочет блин...</div>
            <div class="btn-group">
                <button class="patch" onclick="handlePatch(1)">ДА(обновить)</button>
                <button class="delete" onclick="handleDelete(1)">НЕТ(удалить)</button>
            </div>
        </div>`;
}

async function handlePatch(id) {
    const title = document.getElementById(`title-${id}`);
    const log = document.getElementById('admin-log');
    log.innerText = "> ТИМОФЕЙ)";
    
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ title: 'СТАТУС: УСПЕШНО ОБНОВЛЕН' }),
            headers: { 'Content-type': 'application/json' }
        });
        const data = await res.json();
        title.innerText = data.title;
        title.style.color = 'var(--rbx-orange)';
        log.innerText = "> ЗАВЕРШЕНО УСПЕШНО";
    } catch (e) {
        title.innerText = "СТАТУС: ОБНОВЛЕН OFFLINE";
        title.style.color = 'var(--rbx-orange)';
        log.innerText = "> ОШИБКА СЕТИ: ПРИМЕНЕН ЛОКАЛЬНЫЙ ПАТЧ";
    }
}

async function handleDelete(id) {
    const card = document.getElementById(`item-${id}`);
    const log = document.getElementById('admin-log');
    log.innerText = "> НЕ ТИМОФЕЙ(...";
    
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        finalizeDelete(card, log, "> уДАЛЕНИЕ ЗАВЕРШЕНО УСПЕШНО");
    } catch (e) {
        finalizeDelete(card, log, "> ОШИБКА: ОБЪЕКТ УДАЛЕН ЛОКАЛЬНО");
    }
}

function finalizeDelete(card, log, text) {
    card.style.opacity = '0.3';
    card.style.pointerEvents = 'none';
    log.innerText = text;
}

router('news');
