/**
 * Функция инициализации переключателя темы.
 */
function initTheme() {
    const btn = document.createElement('button');
    btn.id = 'theme-toggle';
    btn.innerText = '☽';
    document.body.appendChild(btn);

    btn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        // Сохраним выбор темы, чтобы не слетал при перезагрузке
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('isDark', isDark);
    });

    // Проверка сохраненной темы при загрузке
    if (localStorage.getItem('isDark') === 'true') {
        document.body.classList.add('dark-theme');
    }
}

initTheme();
