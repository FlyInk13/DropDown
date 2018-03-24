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
    return str.replace(/[|*+$?.^-{}()[/\]\\]/g, "\\$&");
}

function createSearchReg(str) {
    str = str.toLocaleLowerCase();
    var regexp = [];
    str.split(/[,.\s]/).forEach(function parseStringPart(part) {
        var lat = latinToCyr(part);
        var latInv = latinToCyr(part, 1);
        var invKey = changeKeys(part, 2);
        var invKeyLat = latinToCyr(changeKeys(part, 2, 1));
        regexp.push(escapeRegExp(lat)); // rogo -> рого
        regexp.push(escapeRegExp(latInv)); // рого -> rogo
        regexp.push(escapeRegExp(invKey)); // hjuj -> рого
        regexp.push(escapeRegExp(invKeyLat)); // кщпщ -> рого
    });
    return new RegExp(regexp.join('|'), 'ig');
}
