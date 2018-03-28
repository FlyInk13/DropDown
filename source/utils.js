var KeysVariations = [
    [
        ["yo", "zh", "kh", "ts", "ch", "sch", "shch", "sh", "eh", "yu", "ya", "'"],
        ["ё", "ж", "х", "ц", "ч", "щ", "щ", "ш", "э", "ю", "я", "ь"]
    ],
    [
        "abvgdezijklmnoprstufhcy",
        "абвгдезийклмнопрстуфхцы"
    ],
    [
        "qwertyuiop[]asdfghjkl;'zxcvbnm,./`",
        "йцукенгшщзхъфывапролджэячсмитьбю.ё"
    ],
    [
        ['&', '<', '>', '"', "'", '/'],
        ['&amp;', '&lt;', '&gt;', '&quot;', '&#x27;', '&#x2F;']
    ]
];

function changeKeys(str, keyIndex, inv) {
    var keys = KeysVariations[keyIndex];
    var from = inv ? 1 : 0;
    var to = inv ? 0 : 1;
    var i = 0;
    var l = keys[0].length;
    while (i++ <= l) str = str.split(keys[from][i]).join(keys[to][i]);
    return str;
}

function latinToCyr(str, inv) {
    str = changeKeys(str, 0, inv);
    str = changeKeys(str, 1, inv);
    return str;
}

function escapeHTML(str) {
    return changeKeys(str, 3);
}

function escapeRegExp(str) {
    return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
}

function createSearchReg(str) {
    str = str.toLocaleLowerCase();
    var regexp = [];
    str.split(/[,\s]/).forEach(function parseStringPart(part) {
        var ckey = changeKeys(part, 2);
        var ckeyInv = changeKeys(part, 2, 1);
        var сkeyInvLat = latinToCyr(ckeyInv);
        var сkeyInvLatInv = latinToCyr(ckey, 1);
        regexp.push(latinToCyr(part)); // rogo -> рого
        regexp.push(latinToCyr(part, 1)); // рого -> rogo
        regexp.push(ckey); // hjuj -> рого
        regexp.push(ckeyInv); // рого -> hjuj
        regexp.push(сkeyInvLat); // кщпщ -> рого
        regexp.push(сkeyInvLatInv); // кщпщ -> рого
    });
    regexp = regexp.filter(function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }).map(escapeRegExp);
    return new RegExp(regexp.join('|'), 'ig');
}

function qextend(dist, from) {
    for (var n in from) {
        if (from.hasOwnProperty(n)) {
            dist[n] = from[n];
        }
    }
    return dist;
}

function qce(tagName, opts, childs) {
    var el = document.createElement(tagName);
    qextend(el, opts);
    qextend(el.style, opts.style);
    if (!childs) return el;
    childs.forEach(function appendChild(c) {
        el.appendChild(c);
    });
    return el;
}

function stopPropagation(event) {
    event.stopPropagation();
    return false;
}


if (!Element.prototype.scrollIntoViewIfNeeded) {
    Element.prototype.scrollIntoViewIfNeeded = function scrollIntoViewIfNeeded(centerIfNeeded) {
        centerIfNeeded = arguments.length === 0 ? true : !!centerIfNeeded;

        var parent = this.parentNode,
            parentComputedStyle = window.getComputedStyle(parent, null),
            parentBorderTopWidth = parseInt(parentComputedStyle.getPropertyValue('border-top-width')),
            parentBorderLeftWidth = parseInt(parentComputedStyle.getPropertyValue('border-left-width')),
            overTop = this.offsetTop - parent.offsetTop < parent.scrollTop,
            overBottom = (this.offsetTop - parent.offsetTop + this.clientHeight - parentBorderTopWidth) > (parent.scrollTop + parent.clientHeight),
            overLeft = this.offsetLeft - parent.offsetLeft < parent.scrollLeft,
            overRight = (this.offsetLeft - parent.offsetLeft + this.clientWidth - parentBorderLeftWidth) > (parent.scrollLeft + parent.clientWidth),
            alignWithTop = overTop && !overBottom;

        if ((overTop || overBottom) && centerIfNeeded) {
            parent.scrollTop = this.offsetTop - parent.offsetTop - parent.clientHeight / 2 - parentBorderTopWidth + this.clientHeight / 2;
        }

        if ((overLeft || overRight) && centerIfNeeded) {
            parent.scrollLeft = this.offsetLeft - parent.offsetLeft - parent.clientWidth / 2 - parentBorderLeftWidth + this.clientWidth / 2;
        }

        if ((overTop || overBottom || overLeft || overRight) && !centerIfNeeded) {
            this.scrollIntoView(alignWithTop);
        }
    };
}
