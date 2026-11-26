// 1.1 Паспорт страницы (BOM)
console.log(location.href);
console.log(location.pathname.split('/').pop());
console.log(navigator.language);
console.log(window.innerWidth, window.innerHeight);
console.log(navigator.onLine);

const userName = prompt('Ваше имя');
console.log(userName === null ? 'Аноним' : userName);

setTimeout(() => { location.hash = '#my'; }, 3000);
setTimeout(() => { location.hash = '#catalog'; }, 6000);

// 1.1 Уровень B
let seconds = 0;
const timerId = setInterval(() => {
  seconds++;
  console.log(`Вы на странице ${seconds} с`);
  if (seconds === 10) clearInterval(timerId);
}, 1000);

// 1.2 Карта страницы (дерево)
const nav = document.querySelector('nav');
console.log('nav.childNodes:', nav.childNodes.length, '| nav.children:', nav.children.length);

// childNodes считает все узлы (элементы + текстовые узлы и переносы строк),
// children — только дочерние элементы
const main = document.querySelector('main');
for (const el of [document.getElementById('my-list'), document.getElementById('my'), main]) {
  console.log(`${el.id || el.tagName.toLowerCase()}: childNodes = ${el.childNodes.length}, children = ${el.children.length}`);
}

const myList = document.getElementById('my-list');
console.log('first nodeType:', myList.firstChild.nodeType);
console.log('last nodeType:', myList.lastChild.nodeType);

// 1.2 Уровень B
function countNodes(node) {
  const result = { 1: 0, 3: 0 };
  const walk = n => {
    result[n.nodeType] = (result[n.nodeType] || 0) + 1;
    n.childNodes.forEach(walk);
  };
  walk(node);
  return result;
}
console.log(countNodes(main));

// 1.3 Навигация по таблице
const table = document.getElementById('books');
console.log([...table.tHead.rows[0].cells].map(c => c.textContent));
console.log(table.tBodies[0].rows[2].cells[1].textContent);
for (const row of table.tBodies[0].rows) {
  console.log(`${row.cells[0].textContent} — ${row.cells[2].textContent}`);
}
console.log(table.tBodies[0].lastElementChild.cells[0].textContent);

let currentRow = table.tBodies[0].firstElementChild;
while (currentRow) {
  console.log(currentRow.dataset.id);
  currentRow = currentRow.nextElementSibling;
}

// 1.3 Уровень B
let oldestRow = null;
for (const row of table.tBodies[0].rows) {
  if (!oldestRow || Number(row.cells[2].textContent) < Number(oldestRow.cells[2].textContent)) {
    oldestRow = row;
  }
}
console.log(`${oldestRow.cells[0].textContent} (${oldestRow.cells[2].textContent})`);

// 1.4 Поиск селекторами
console.log([...document.querySelectorAll('#books tbody .title')].map(e => e.textContent));
console.log(document.querySelectorAll('#books tbody tr[data-available="true"]').length);
console.log([...document.querySelectorAll('#books tbody tr[data-available="false"] .title')].map(e => e.textContent));
console.log([...document.querySelectorAll('#books tbody tr[data-genre="Фантастика"]')].map(r => r.querySelector('.title').textContent));
console.log([...document.querySelectorAll('#books tbody tr')]
  .filter(r => r.cells[1].textContent.toLowerCase().includes('булгаков'))
  .map(r => r.querySelector('.title').textContent));
console.log(document.querySelector('#books tbody tr:last-child'));
console.log(document.querySelectorAll('#books tbody tr:nth-child(even)'));
console.log([...document.querySelectorAll('th[data-sort]')].map(th => th.dataset.sort));
console.log(document.querySelectorAll('a[href^="#"]'));
console.log(document.querySelectorAll('#add-form [required]'));

// 1.4 Уровень B
function titlesByGenre(genre) {
  return [...document.querySelectorAll(`#books tbody tr[data-genre="${genre}"] .title`)]
    .map(e => e.textContent);
}
console.log(titlesByGenre('Роман'));
console.log(titlesByGenre('Фантастика'));
console.log(titlesByGenre('Повесть'));

// 1.5 Очистка таблицы (после F5 для каждого способа)
// document.querySelector('#books tbody').replaceChildren();
// document.querySelectorAll('#books tbody tr').forEach(r => r.remove());
