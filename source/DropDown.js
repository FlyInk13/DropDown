/**
 * DropDown.
 * @class
 */
function DropDown(opts) {
    if (this.constructor != DropDown) throw new Error("DropDown was called without 'new' operator");
    this.lang = { empty: 'Пусто', placeholder: 'Введите запрос' };
    this.style = { width: '320px' };
    this.classList = [];
    this.items = [];
    this.selected = {};
    this.createItem = this.render.createBasicItem;
    if (!opts) opts = {};
    if (opts.multiselect) this.value = [];
    if (opts.extended && !opts.createItem) {
        opts.createItem = this.render.createExtendedItem;
    }
    qextend(this, opts);
    this.body = qce('div', {
        className: 'dropdown ' + this.classList.join(' '),
        style: this.style
    }, [
        qce('div', { className: 'dd_value_container' }, [
            qce('div', { className: 'icon dd_open fl_r' }),
            qce('div', { className: 'dd_selected_container' }, [
                qce('input', { className: 'dd_search_input', placeholder: this.placeholder || this.lang.placeholder })
            ]),
        ]),
        qce('div', { className: 'dd_items_container' })
    ]);

    this.dom = {
        selected: this.body.querySelector('.dd_selected_container'),
        items: this.body.querySelector('.dd_items_container'),
        input: this.body.querySelector('.dd_search_input')
    };

    this.body.addEventListener('click', this.onFocus.bind(this));
    this.dom.input.addEventListener('focus', this.onFocus.bind(this));
    this.dom.input.addEventListener('blur', this.close.bind(this));
    this.dom.input.addEventListener('keydown', this.onKeyDown.bind(this));
    this.dom.input.addEventListener('input', this.onInput.bind(this));
    this.dom.items.addEventListener('scroll', this.onScroll.bind(this));
    this.setValue(this.value, 1);
    if (this.addTo) this.addTo.appendChild(this.body);
    return this;
}
/**
 * DropDown.renderItem отрисовка и вставка элемента в список.
 * @param {object} item - Данные для отрисовки.
 */
DropDown.prototype.renderItem = function renderItem(item) {
    item.title = escapeHTML(item.name);
    if (this.reg) item.title = item.title.replace(this.reg, '<b>$&</b>');
    var el = this.createItem(item);
    el.onclick = this.select.bind(this, item);
    el.addEventListener('mousedown', el.onclick);
    el.addEventListener('mouseover', this.setActive.bind(this, el));
    this.dom.items.appendChild(el);
};
/**
 * DropDown.renderList отрисовка списка.
 * @param {object} offset - Смещение.
 */
DropDown.prototype.renderList = function renderList(offset) {
    if (typeof offset != 'number') {
        offset = 0;
        this.dom.items.innerHTML = '';
        this.active = false;
    }
    var list = this.items;
    delete this.reg;
    if (this.dom.input.value) {
        this.reg = createSearchReg(this.dom.input.value);
        list = list.filter(this.search.bind(this));
    }
    if (this.multiselect) {
        list = list.filter(this.excludeSelected.bind(this));
    }
    if (!list.length) {
        return this.onEmpty(this);
    }

    this.offset = offset;
    list.slice(offset, offset + 20).forEach(this.renderItem.bind(this));
    if (!offset) this.setActive(this.dom.items.firstChild);
    this.body.classList.add('open');
};
/**
 * DropDown.excludeSelected фильтр вычитания выбранных элементов и списка на отрисовку.
 * @param {object} item - данные элемента.
 */
DropDown.prototype.excludeSelected = function excludeSelected(item) {
    return this.value !== item.id && this.value.indexOf(item.id) == -1;
};
/**
 * DropDown.search фильтр поиска.
 * @param {object} item - данные элемента.
 */
DropDown.prototype.search = function search(item) {
    var searchIn = ['id' + item.id, item.screen_name, item.name].join(' ');
    return this.reg.test(searchIn);
};
/** DropDown.close закрывает список, очищает его и скрывает поле ввода при мультивыборе. */
DropDown.prototype.close = function close() {
    this.body.classList.remove('open');
    this.dom.items.innerHTML = '';
    if (this.multiselect && this.value.length) this.dom.input.style.display = 'none';
};
/**
 * DropDown.setWarn выводит элемент с предупреждением, нужен для вывода пустого списка.
 * @param {string} title - текст для вывода.
 */
DropDown.prototype.setWarn = function setWarn(title) {
    this.dom.items.appendChild(qce('div', {
        className: 'dd_item warn',
        textContent: title,
        onmousedown: stopPropagation
    }));
};
/**
 * DropDown.setValue выбор списка.
 * @param {string} value - новое значение.
 * @param {boolean} add - оставить старые значения
 */
DropDown.prototype.setValue = function setValue(value, add) {
    if (this.multiselect) {
        if (!add) this.value.forEach(this.valueRemove.bind(this));
        this.value = value;
        this.value.forEach(this.selectById.bind(this));
        this.close();
    } else if (this.value) {
        this.value = value;
        this.selectById(this.value);
    }
};
/**
 * DropDown.setActive подсвечивает элемент списка.
 * @param {object} el - элемент для подсвечивания.
 */
DropDown.prototype.setActive = function setActive(el) {
    if (this.active) this.active.classList.remove('active');
    this.active = false;
    if (!el) el = this.dom.items.firstChild;
    if (!el || el.classList.contains('empty')) return;
    el.classList.add('active');
    el.scrollIntoViewIfNeeded();
    this.active = el;
};
/**
 * DropDown.addValue добавляет выбранное значение.
 * @param {object} item - элемент для добавления.
 */
DropDown.prototype.addValue = function addValue(item) {
    if (this.value.indexOf(item.id) == -1) this.value.push(item.id);
    this.dom.input.value = '';
    this.selected[item.id] = qce('div', {
        className: 'dd_selected_item',
        textContent: item.name,
        onclick: this.valueRemove.bind(this, item.id)
    });
    this.dom.selected.insertBefore(this.selected[item.id], this.dom.input);
    this.renderList();
};
/**
 * DropDown.select выбрает значение.
 * @param {object} item - элемент для выбора.
 */
DropDown.prototype.select = function select(item) {
    if (this.multiselect) return this.addValue(item);
    this.value = item.id;
    this.dom.input.value = item.name;
    this.close();
};
/**
 * DropDown.selectById выбрает значение по id.
 * @param {object} id - элемент для выбора.
 */
DropDown.prototype.selectById = function select(id) {
    var item = this.items.find(function findById(i) {
        return i.id == id;
    });
    if (this.multiselect) return this.addValue(item);
    this.value = item.id;
    this.dom.input.value = item.name;
    this.close();
};
/**
 * DropDown.valueRemove функция для удаления выбранного из списка.
 * @param {object} id - id элемента для удаления.
 * @param {object} event
 */
DropDown.prototype.valueRemove = function valueRemove(id, event) {
    var i = this.value.indexOf(id);
    if (i > -1) this.value.splice(i, 1);
    if (!this.value.length) this.dom.input.style.display = 'block';
    if (this.selected[id]) {
        this.selected[id].outerHTML = '';
        delete this.selected[id];
    }
    if (!event) return false;
    return event.stopPropagation();
};
/**
 * DropDown.onKeyDown управление с клавиатуры.
 * @param {object} event
 */
DropDown.prototype.onKeyDown = function onKeyDown(event) {
    switch (event.keyCode) {
        case 40: // вниз
            this.setActive(this.active.nextSibling);
            return event.preventDefault();
        case 38: // вверх
            this.setActive(this.active.previousSibling || this.dom.items.lastElementChild);
            return event.preventDefault();
        case 13: // ввод
            if (this.active) this.active.onclick();
            break;
        case 27: // esc
            this.dom.input.blur();
            break;
        case 8: // backspace
            if (this.dom.input.value.length || !this.multiselect) return;
            var id = this.value.pop();
            if (id) {
                this.valueRemove(id);
                this.renderList();
            }
            break;
    }
};
/** DropDown.onEmpty функция вызываемая при пустом списке. */
DropDown.prototype.onEmpty = function onEmpty() {
    return this.setWarn(this.lang.empty);
};
/** DropDown.onScroll функция вызываемая при прокрутке, добавляет элементы в список. */
DropDown.prototype.onScroll = function onScroll() {
    var list = this.dom.items;
    var scrollBottom = list.scrollHeight - list.scrollTop - list.clientHeight;
    if (scrollBottom <= 50) this.renderList(this.offset + 20);
};
/** DropDown.onFocus функция вызываемая при активации поля ввода. */
DropDown.prototype.onFocus = function onFocus() {
    this.body.classList.add('open');
    this.dom.input.style.display = 'block';
    this.renderList();
    this.dom.input.focus();
};
/** DropDown.onInput функция при вводе. */
DropDown.prototype.onInput = function onInput() {
    this.renderList();
};


DropDown.prototype.render = {
    /** DropDown.render.createBasicItem функция для отрисовки простого списка. */
    createBasicItem: function (item) {
        return qce('div', {
            innerHTML: item.title,
            className: 'dd_item'
        });
    },
    /** DropDown.render.createExtendedItem функция для отрисовки списка с аватарками. */
    createExtendedItem: function (item) {
        return qce('div', {
            className: 'dd_item'
        }, [
            qce('div', { className: 'dd_item_icon fl_l' }, [
                qce('img', { src: item.photoSrc })
            ]),
            qce('div', { className: 'dd_item_name', innerHTML: item.title }),
            qce('div', { className: 'dd_item_descr', textContent: item.descr })
        ]);
    }
};
