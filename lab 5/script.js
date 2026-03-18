class AnonEntity {
    #id;
    constructor(id, name, accessLevel) {
        this.#id = id;
        this.name = name;
        this.accessLevel = accessLevel;
    }

    get id() { return this.#id; }

    render(isEdit, onDelete) {
        const article = document.createElement('article');
        article.className = 'anon-card';

        const nameH3 = document.createElement('h3');
        nameH3.textContent = this.name;

        const accessP = document.createElement('p');
        accessP.innerHTML = `Уровень доступа: <b>${this.accessLevel}</b>`;

        if (isEdit) {
            nameH3.contentEditable = true;
            nameH3.oninput = () => { this.name = nameH3.textContent; registry.save(); };
            
            const accessVal = accessP.querySelector('b');
            accessVal.contentEditable = true;
            accessVal.oninput = () => { this.accessLevel = accessVal.textContent; registry.save(); };
        }

        article.append(nameH3, accessP);

        const extra = this.renderSpecial(isEdit);
        if (extra) article.appendChild(extra);

        if (isEdit) {
            const delBtn = document.createElement('button');
            delBtn.className = 'btn btn-delete';
            delBtn.textContent = 'Удалить из сети';
            delBtn.onclick = () => onDelete(this.#id);
            article.appendChild(delBtn);
        }

        return article;
    }

    renderSpecial() { return null; }
}

class RootHacker extends AnonEntity {
    constructor(id, name, accessLevel, breachPower) {
        super(id, name, accessLevel);
        this.breachPower = breachPower;
    }
    renderSpecial(isEdit) {
        const div = document.createElement('div');
        div.className = 'stats-container';
        div.innerHTML = `Сила взлома: <b>${this.breachPower}</b> террафлопс`;
        if (isEdit) {
            const b = div.querySelector('b');
            b.contentEditable = true;
            b.oninput = () => { this.breachPower = b.textContent; registry.save(); };
        }
        return div;
    }
}

class ScriptKiddie extends AnonEntity {
    constructor(id, name, accessLevel, exploitStreak) {
        super(id, name, accessLevel);
        this.exploitStreak = exploitStreak;
    }
    renderSpecial(isEdit) {
        const div = document.createElement('div');
        div.className = 'stats-container';
        div.innerHTML = `Серия эксплойтов: <b>${this.exploitStreak}</b>`;
        if (isEdit) {
            const b = div.querySelector('b');
            b.contentEditable = true;
            b.oninput = () => { this.exploitStreak = b.textContent; registry.save(); };
        }
        return div;
    }
}

class GhostUser extends AnonEntity {
    constructor(id, name, accessLevel, encryptionLevel) {
        super(id, name, accessLevel);
        this.encryptionLevel = encryptionLevel;
    }
    renderSpecial(isEdit) {
        const div = document.createElement('div');
        div.className = 'stats-container';
        div.innerHTML = `Уровень шифрования: <b>${this.encryptionLevel}</b>%`;
        if (isEdit) {
            const b = div.querySelector('b');
            b.contentEditable = true;
            b.oninput = () => { this.encryptionLevel = b.textContent; registry.save(); };
        }
        return div;
    }
}

const registry = {
    entities: [],
    isEditMode: false,

    init() {
        const saved = localStorage.getItem('anon_system_v1');
        if (saved) {
            this.entities = JSON.parse(saved).map(item => {
                if (item.type === 'RootHacker') return new RootHacker(item.id, item.name, item.accessLevel, item.breachPower);
                if (item.type === 'ScriptKiddie') return new ScriptKiddie(item.id, item.name, item.accessLevel, item.exploitStreak);
                return new GhostUser(item.id, item.name, item.accessLevel, item.encryptionLevel);
            });
        } else {
            this.entities = [
                new RootHacker(1, "ANONYMOUS_LEADER", "Ultra", 999999999999),
                new ScriptKiddie(2, "Unknown_User", "Medium", 42),
                new GhostUser(3, "Encrypted_Entity", "Zero", 100)
            ];
            this.save();
        }
        this.build();
    },

    save() {
        const raw = this.entities.map(e => ({ ...e, type: e.constructor.name, id: e.id }));
        localStorage.setItem('anon_system_v1', JSON.stringify(raw));
    },

    build() {
        const body = document.body;
        body.innerHTML = '';

        const header = document.createElement('header');
        const title = document.createElement('h1');
        title.textContent = 'ТВОЯ БАЗА АНОНИМУСОВ:';
        
        const nav = document.createElement('nav');
        const modeBtn = document.createElement('button');
        modeBtn.className = 'btn';
        modeBtn.textContent = this.isEditMode ? 'Сохранить изменения' : 'Управление анонимусами';
        modeBtn.onclick = () => { this.isEditMode = !this.isEditMode; this.build(); };

        nav.appendChild(modeBtn);

        if (this.isEditMode) {
            const addBtn = document.createElement('button');
            addBtn.className = 'btn';
            addBtn.style.marginLeft = '15px';
            addBtn.textContent = 'Добавить анонимуса';
            addBtn.onclick = () => {
                this.entities.push(new RootHacker(Date.now(), "Новый_Анон", "Undefined", 0));
                this.save();
                this.build();
            };
            nav.appendChild(addBtn);
        }

        header.append(title, nav);

        const main = document.createElement('main');
        const grid = document.createElement('section');
        grid.className = 'anon-grid';

        const onDelete = (id) => {
            this.entities = this.entities.filter(e => e.id !== id);
            this.save();
            this.build();
        };

        this.entities.forEach(entity => {
            grid.appendChild(entity.render(this.isEditMode, onDelete));
        });

        main.appendChild(grid);

        body.append(header, main);
    }
};

registry.init();
