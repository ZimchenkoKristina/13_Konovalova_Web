const app = document.getElementById('app');


const APIS = {
    news: 'https://httpbin.org/get',
    create: 'https://httpbin.org/post',
    admin: 'https://httpbin.org/get'
};

async function fetchWithTimeout(url, options = {}, timeout = 15000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(function() { controller.abort(); }, timeout);
    
    try {
        const response = await fetch(url, Object.assign({}, options, { signal: controller.signal }));
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error('HTTP ' + response.status);
        }
        
        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('ТАЙМАУТ: Сервер не отвечает');
        }
        throw error;
    }
}

async function router(page) {
    document.querySelectorAll('nav a').forEach(function(a) {
        a.classList.remove('active');
    });
    const activeNav = document.getElementById('nav-' + page);
    if (activeNav) activeNav.classList.add('active');
    
    app.innerHTML = '<div class="loading">ПОДКЛЮЧЕНИЕ...</div>';
    await new Promise(function(r) { setTimeout(r, 400); });

    if (page === 'news') renderNews();
    else if (page === 'create') renderCreate();
    else if (page === 'admin') renderAdmin();
}

async function renderNews() {
    try {
        const data = await fetchWithTimeout(APIS.news + '?test=news');
        displayNews(data, 'Новости?');
    } catch (e) {
        app.innerHTML = '<div class="card" style="border-left: 4px solid var(--rbx-red)"><div style="color: var(--rbx-red); font-weight: 800;">ОШИБКА</div><div style="margin-top: 10px;">' + e.message + '</div><button onclick="router(\'news\')" style="margin-top: 15px;">ПОВТОРИТЬ</button></div>';
    }
}

function displayNews(data, title) {
    let html = '<h2>' + title + '</h2>';
    html += '<div class="card"><div style="color: var(--rbx-blue); font-size: 10px;">API ОТВЕТ</div><div style="font-weight: 800;">' + data.origin + '</div><div style="font-size: 12px; margin-top: 10px; color: #bdbebe;">Статус: подключено</div></div>';
    app.innerHTML = html;
}

function renderCreate() {
    app.innerHTML = '<h2>НАПИШИТЕ ЧТО-ТО</h2><div class="card"><input type="text" id="username" placeholder="Название"><input type="text" id="userbody" placeholder="текст"><button class="primary" onclick="handlePost()">ОТПРАВИТЬ</button><div id="post-status" style="margin-top:15px; font-size:12px;"></div><pre id="post-res" style="display:none; margin-top:10px; background: #121314; padding: 10px;"></pre></div>';
}

async function handlePost() {
    const val = document.getElementById('username').value;
    const body = document.getElementById('userbody').value;
    const resBox = document.getElementById('post-res');
    const status = document.getElementById('post-status');
    if (!val) return alert('Название');

    status.innerText = '> ОТПРАВКА...';
    status.style.color = 'var(--rbx-blue)';

    try {
        const data = await fetchWithTimeout(APIS.create, {
            method: 'POST',
            body: JSON.stringify({ title: val, body: body, userId: 1 }),
            headers: { 'Content-type': 'application/json' }
        });
        
        status.innerText = '> Отправилось!';
        status.style.color = 'var(--rbx-green)';
        resBox.style.display = 'block';
        resBox.innerText = JSON.stringify(data, null, 2);
    } catch (e) {
        status.innerText = '> ОШИБКА: ' + e.message;
        status.style.color = 'var(--rbx-red)';
    }
}

function renderAdmin() {
    app.innerHTML = '<h2>ТИМОФЕЙ</h2><div class="card" id="item-1"><div id="title-1" style="font-weight: 800;">ТИМОФЕЙ</div><div id="admin-log" style="font-size:10px; margin-top:5px; color:var(--rbx-blue)"></div><div class="btn-group"><button class="patch" onclick="handlePatch(1)">ОБНОВИТЬ</button><button class="delete" onclick="handleDelete(1)">УДАЛИТЬ</button></div></div>';
}

async function handlePatch(id) {
    const title = document.getElementById('title-' + id);
    const log = document.getElementById('admin-log');
    log.innerText = '> ОБНОВЛЕНИЕ ТИМОФЕЯ...';

    try {
        const data = await fetchWithTimeout('https://httpbin.org/patch', {
            method: 'PATCH',
            body: JSON.stringify({ name: 'УРА ТИМОФЕЙ ' + Date.now() }),
            headers: { 'Content-type': 'application/json' }
        });
        
        title.innerText = 'ТИМОФЕЙ)';
        title.style.color = 'var(--rbx-orange)';
        log.innerText = '> УРА!';
        log.style.color = 'var(--rbx-green)';
    } catch (e) {
        log.innerText = '> ОШИБКА(: ' + e.message;
        log.style.color = 'var(--rbx-red)';
    }
}

async function handleDelete(id) {
    const card = document.getElementById('item-' + id);
    const log = document.getElementById('admin-log');
    log.innerText = '> пака...';

    try {
        await fetchWithTimeout('https://httpbin.org/delete', { method: 'DELETE' });
        
        card.style.opacity = '0.3';
        card.style.pointerEvents = 'none';
        log.innerText = '> все!';
        log.style.color = 'var(--rbx-green)';
    } catch (e) {
        log.innerText = '> ОШИБКА(: ' + e.message;
        log.style.color = 'var(--rbx-red)';
    }
}

router('news');