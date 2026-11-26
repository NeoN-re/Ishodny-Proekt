function getBookRows() {
  return [...document.querySelectorAll('tr.book')];
}

function getRowByBookId(id) {
  return document.querySelector('tr.book[data-id="' + id + '"]');
}

function getAvailableTitles() {
  return [...document.querySelectorAll('tr.book[data-available="true"] .title')].map(e => e.textContent);
}

function findByAuthor(text) {
  const q = text.toLowerCase();
  return [...document.querySelectorAll('tr.book')]
    .filter(r => r.querySelector('.author').textContent.toLowerCase().includes(q))
    .map(r => r.querySelector('.title').textContent);
}

function getRowFromButton(btn) {
  return btn.closest('tr.book');
}

function readBooks() {
  return [...document.querySelectorAll('tr.book')].map(r => ({
    id: Number(r.dataset.id),
    title: r.querySelector('.title').textContent,
    author: r.querySelector('.author').textContent,
    year: Number(r.querySelector('.year').textContent),
    genre: r.querySelector('.genre').textContent,
    available: r.dataset.available === 'true',
    rating: Number(r.querySelector('.rating').textContent)
  }));
}

function getMyBookIds() {
  return [...document.querySelectorAll('#my-list li[data-book-id]')].map(li => Number(li.dataset.bookId));
}