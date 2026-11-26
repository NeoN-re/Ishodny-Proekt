// 2.1 Текст и разметка
document.querySelector('h1').textContent = 'Библиотека колледжа';
document.getElementById('year').textContent = new Date().getFullYear();

const auth = document.getElementById('auth');
auth.textContent = 'Здравствуйте, Анна!';
auth.insertAdjacentHTML('beforeend', '<a href="#">Выйти</a>');

const authText = document.getElementById('auth');
authText.textContent = 'Здравствуйте, <b>Анна</b>!';
authText.insertAdjacentHTML('beforeend', '<a href="#">Выйти</a>');

// textContent выводит теги буквально, innerHTML разбирает <b> как разметку
const authHtml = document.getElementById('auth');
authHtml.innerHTML = 'Здравствуйте, <b>Анна</b>!';
authHtml.insertAdjacentHTML('beforeend', '<a href="#">Выйти</a>');

// 2.2 Атрибуты и data-*
console.log([...document.querySelectorAll('th[data-sort]')].map(th => th.dataset.sort));
document.querySelectorAll('.take').forEach(btn => {
  btn.title = btn.disabled ? 'Книга выдана' : 'Взять книгу';
});

const row6 = document.querySelector('#books tbody tr[data-id="6"]');
row6.dataset.available = 'true';
const btn6 = row6.querySelector('.take');
btn6.disabled = false;
btn6.textContent = 'Взять';

// 2.2 Уровень B
function typed(obj) {
  const out = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === 'true') out[key] = true;
    else if (value === 'false') out[key] = false;
    else if (value !== '' && !Number.isNaN(Number(value))) out[key] = Number(value);
    else out[key] = value;
  }
  return out;
}
console.log(typed({ ...document.querySelector('#books tbody tr').dataset }));

// 2.3 Классы и стили
document.querySelectorAll('#books tbody tr').forEach(r => {
  if (Number(r.cells[4].textContent) >= 4.5) r.classList.add('highlight');
});

const login = document.getElementById('login');
login.classList.remove('hidden');
login.classList.add('hidden');

const firstRow = document.querySelector('#books tbody tr');
console.log(firstRow.classList.contains('highlight'), '|', firstRow.className);

const unavailableRows = document.querySelectorAll('#books tbody tr[data-available="false"]');
unavailableRows.forEach(r => { r.style.opacity = '0.5'; });
unavailableRows.forEach(r => { r.style.removeProperty('opacity'); });

// 2.3 Уровень B
document.querySelectorAll('#books tbody tr').forEach((r, i) => {
  if (i % 2 === 0) r.classList.add('odd');
});
const zebraStyle = document.createElement('style');
zebraStyle.textContent = '.odd { background: #f4f4f4; }';
document.head.append(zebraStyle);

// 2.4 Создаём и перемещаем элементы
const makeLi = text => {
  const li = document.createElement('li');
  li.textContent = text;
  return li;
};

const myList = document.getElementById('my-list');
myList.append(makeLi('Гиперион'));
myList.prepend(makeLi('Война и мир'));
myList.firstElementChild.after(makeLi('Собачье сердце'));
myList.lastElementChild.remove();
myList.children[1].replaceWith(makeLi('Солярис'));

const booksTbody = document.querySelector('#books tbody');
const copyRow = booksTbody.firstElementChild.cloneNode(true);
copyRow.dataset.id = '7';
copyRow.querySelector('.title').textContent = 'Копия';
booksTbody.append(copyRow);

// 2.4 Уровень B
myList.insertAdjacentHTML('beforebegin', '<li>beforebegin</li>');
myList.insertAdjacentHTML('afterbegin', '<li>afterbegin</li>');
myList.insertAdjacentHTML('beforeend', '<li>beforeend</li>');
myList.insertAdjacentHTML('afterend', '<li>afterend</li>');

// 2.5 Каталог из массива
const catalogTbody = document.querySelector('#books tbody');

function createRow(book) {
  const tr = document.createElement('tr');
  tr.className = 'book';
  tr.dataset.id = book.id;
  tr.dataset.genre = book.genre;
  tr.dataset.available = book.available;

  tr.innerHTML =
    '<td class="title"></td><td class="author"></td><td class="year"></td>' +
    '<td class="genre"></td><td class="rating"></td><td><button class="take" type="button"></button></td>';

  for (const key of ['title', 'author', 'year', 'genre', 'rating']) {
    tr.querySelector('.' + key).textContent = book[key];
  }

  const btn = tr.querySelector('.take');
  btn.textContent = book.available ? 'Взять' : 'Выдана';
  btn.disabled = !book.available;
  btn.title = book.available ? 'Взять книгу' : 'Книга выдана';
  return tr;
}

function renderCatalog(list) {
  catalogTbody.replaceChildren(...list.map(createRow));
}

renderCatalog(books);
renderCatalog(books.filter(b => b.available));
renderCatalog(books.filter(b => b.genre === 'Роман'));
renderCatalog([...books].sort((a, b) => b.year - a.year));
renderCatalog([]);
renderCatalog([{ id: 99, title: '<i>Тест</i>', author: 'Автор', year: 2000, genre: 'Роман', available: true, rating: 4.0 }]);

// 2.5 Уровень B
function createRowStars(book) {
  const tr = createRow(book);
  const cell = tr.querySelector('.rating');
  const value = Number(book.rating);
  const full = Math.round(value);
  cell.dataset.value = value;
  cell.innerHTML = '<span class="star">' + '★'.repeat(full) + '☆'.repeat(5 - full) + '</span>';
  if (value >= 4.7) cell.classList.add('top');
  return tr;
}

function renderCatalogStars(list) {
  catalogTbody.replaceChildren(...list.map(createRowStars));
}
renderCatalogStars(books);

// 2.6 «Мои книги» из loans
function renderMyBooks(userId) {
  const items = loans
    .filter(l => l.userId === userId && l.returnedAt === null)
    .map(l => {
      const book = books.find(b => b.id === l.bookId);
      const li = document.createElement('li');
      li.textContent = `${book.title} — взята ${l.takenAt}`;
      return li;
    });
  document.getElementById('my-list').replaceChildren(...items);
}

renderMyBooks(1);
renderMyBooks(2);
renderMyBooks(99);

// 2.6 Уровень B
function renderHistory(userId) {
  document.getElementById('history')?.remove();

  const ul = document.createElement('ul');
  ul.id = 'history';
  loans
    .filter(l => l.userId === userId && l.returnedAt !== null)
    .forEach(l => {
      const book = books.find(b => b.id === l.bookId);
      const li = document.createElement('li');
      li.textContent = `${book.title} — ${'★'.repeat(l.rating)}${'☆'.repeat(5 - l.rating)}`;
      ul.append(li);
    });

  const myList = document.getElementById('my-list');
  myList.after(ul);
  myList.after(Object.assign(document.createElement('h3'), { textContent: 'История' }));
}
renderHistory(1);
