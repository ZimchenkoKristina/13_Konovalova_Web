document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('review-form');
    const container = document.querySelector('.reviews');

    // --- ФУНКЦИИ ХРАНИЛИЩА (Local Storage) ---
    function getSavedReviews() {
        const data = localStorage.getItem('artur_reviews');
        return data ? JSON.parse(data) : [];
    }

    function saveReview(obj) {
        const all = getSavedReviews();
        all.push(obj);
        localStorage.setItem('artur_reviews', JSON.stringify(all));
        console.log("Успешно сохранено в память!");
    }

    // --- ОТРИСОВКА ---
    function render() {
        const saved = getSavedReviews();
        console.log("Найдено в базе:", saved.length);

        if (container && saved.length > 0) {
            const html = saved.map(r => `
                <article style="border: 5px solid gold; margin: 15px 0; padding: 15px; background: #fff; color: #000;">
                    <cite style="font-weight: bold; color: #000000;">— ${r.name}</cite>
                    <q style="display:block; margin-top: 10px; font-style: italic;">${r.text}</q>
                    ${r.img ? `<img src="${r.img}" style="max-width:180px; display:block; margin-top:10px; border: 1px solid #000;">` : ''}
                </article>
            `).join('');
            
            container.insertAdjacentHTML('beforeend', '<h3 style="color: black; margin-top:10px;">ВАШИ НОВЫЕ ОТЗЫВЫ:</h3>' + html);
        }
    }

    if (form) {
        form.onsubmit = function(e) {
            e.preventDefault();
            console.log("Форма отправлена...");

            const name = document.getElementById('review-name').value;
            const text = document.getElementById('review-text').value;
            const fileInput = document.getElementById('review-image');

            if (name.length < 2 || text.length < 5) {
                alert("Слишком короткое имя или отзыв!");
                return false;
            }

            const complete = (imgData = null) => {
                saveReview({ name, text, img: imgData });
                alert("ОТЗЫВ ОТПРАВЛЕН!");
                location.reload();
            };

            if (fileInput && fileInput.files[0]) {
                const reader = new FileReader();
                reader.onload = (ev) => complete(ev.target.result);
                reader.readAsDataURL(fileInput.files[0]);
            } else {
                complete();
            }
            return false;
        };
    }

    render();
});
