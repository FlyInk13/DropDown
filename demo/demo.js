
function jsonp(url, callback) {
    var rid = 'f' + Math.random().toString(16).substr(2);
    jsonp[rid] = function onRes(r) {
        callback(r);
        delete jsonp[rid];
    };
    document.head.appendChild(qce('script', {
        src: url + '&callback=jsonp.' + rid,
        onload: function onScriptLoaded(e) {
            e.target.outerHTML = '';
        }
    }));
}

function api(method, data, callback) {
    var url = 'https://api.vk.com/method/?v=5.45';
    for (var name in data) {
        if (data.hasOwnProperty(name)) {
            url += '&' + encodeURIComponent(name) + ' ' + encodeURIComponent(data[name]);
        }
    }
    jsonp(url, callback);
}


var demo1, demo2, demo3, demo4, demo5;
window.addEventListener('load', function onLoad() {
    // demo1
    var items = [];
    var i = 9999;
    while (i--) items.push({ id: i, name: 'item' + i });
    demo1 = new DropDown({
        items: items,
        value: 995,
        classList: [],
        placeholder: 'Введите название продукта',
        addTo: document.getElementById('demo1')
    });
    // demo2
    demo2 = new DropDown({
        items: [
            { id: 1, name: 'Пицца' },
            { id: 2, name: 'Суши' },
            { id: 3, name: 'Роллы' },
            { id: 4, name: 'Мемы' }
        ],
        classList: ['separated'],
        value: [1, 2],
        multiselect: 1,
        placeholder: 'Введите название продукта',
        addTo: document.getElementById('demo2')
    });
    // demo3
    demo3 = new DropDown({
        items: [],
        classList: ['separated', 'extended', 'rounded'],
        multiselect: 1,
        extended: 1,
        placeholder: 'Введите id пользователя',
        onEmpty: function onEmpty(dd) {
            if (!dd.reg) return dd.setWarn('Начните вводить запрос');
            if (dd.loaded == dd.dom.input.value) return dd.setWarn('По данному запросу пусто');
            var user_ids = dd.reg.toString().split(/[/|]/).filter(function checkLink(l) {
                return /^[\w.]+$/.test(l);
            });
            user_ids.pop();
            api('users.get', {
                user_ids: user_ids,
                fields: 'photo_100,home_town,screen_name,city'
            }, function setItems(r) {
                if (!r.response) r.response = [];
                dd.items = dd.items.concat(r.response.filter(function excludeExist(x) {
                    return !dd.items.find(function checkId(y) {
                        return x.id == y.id;
                    });
                }).map(function u2i(u) {
                    return {
                        id: u.id,
                        screen_name: u.screen_name,
                        name: u.first_name + ' ' + u.last_name,
                        photoSrc: u.photo_100,
                        descr: u.city ? u.city.title : u.home_town
                    };
                }));
                dd.renderList();
                dd.loaded = dd.dom.input.value;
            });
        },
        addTo: document.getElementById('demo3')
    });
    // demo4
    demo4 = new DropDown({
        items: [
            { id: 1, name: 'Красный', color: 'red' },
            { id: 2, name: 'Синий', color: 'blue' },
            { id: 3, name: 'Зеленый', color: 'green' },
            { id: 4, name: 'Черный', color: 'black' }
        ],
        createItem: function createItem(item) {
            return qce('div', {
                innerHTML: item.title,
                style: { background: item.color, color: '#fff', padding: '12px' }
            });
        },
        multiselect: 1,
        placeholder: 'Введите цвет',
        addTo: document.getElementById('demo4')
    });
    // demo5
    demo5 = new DropDown();
    document.getElementById('demo5').appendChild(demo5.body);
});
