# DropDown
Пример:
```js
var items = [];
var i = 999;
while (i--) items.push({ id: i, name: 'item' + i });
var dd1 = new DropDown({
    items: items,
    value: 995,
    placeholder: 'Введите название продукта',
    addTo: document.getElementById('demo1')
});
```
* Живые примеры: https://ifx.su/DropDown/demo/
* JSDoc: http://ifx.su/DropDown/docs/

## DropDown: Опции
* opts.items - массив с элементами { id, name, ... }
* opts.value - выбранные данные
* opts.placeholder - заглушка поля ввода
* opts.addTo - добавить к элементу
* opts.lang - строки для вывода
    * placeholder - заглушка поля ввода
    * empty - предупреждение о пустом списке
* ... - любые функции из [DropDown.prototype](source/DropDown.js) ([JSDoc](https://ifx.su/DropDown/docs/DropDown.html))

## DropDown: Результат
Отдает экземпляр DropDown
* dd.style - стили
* dd.selected - объект для хранения выбранных элементов
* dd.createItem - функция отрисовки элемента
* dd.value - выбранные значения
* dd.body - отрисованный элемент селектора
* dd.dom - важные элементы селектора
* ... - другие данные из opts

## Управление с клавиатуры:
* стрелки - перемещение по списку
* esc - закрыть
* backspace - удалить последний элемент
* enter - подтвердить выбор

## Дополнительно:
* Отрисовка любого содержимого через указание функции отрисовки
* Два предварительных шаблона для отрисовки списков (простой и с аватарками)
* Игнорирование раскладки
* Мультивыбор
* Поддержка [ie10](https://www.browserling.com/browse/win/7/ie/10/https%3A%2F%2Fifx.su%2FDropDown%2Fdemo%2F)
* Отображение только нужных элементов
