const library = new Library({ books, users, loans });
library.currentUser = users[0];

const state = {
  query: "",
  genre: "",
  sortKey: "",
  sortDir: 1
};

function createRow(book) {
  const tr = document.createElement("tr");
  tr.className = "book";
  tr.dataset.id = book.id;
  tr.dataset.genre = book.genre;
  tr.dataset.available = book.available;
  
  const btnText = book.available ? "Взять" : "Выдана";
  const disabled = book.available ? "" : "disabled";

  tr.innerHTML = `
    <td class="title">${book.title}</td>
    <td class="author">${book.author}</td>
    <td class="year">${book.year}</td>
    <td class="genre">${book.genre}</td>
    <td class="rating">${book.rating}</td>
    <td><button class="take" type="button" ${disabled}>${btnText}</button></td>
  `;
  
  const btn = tr.querySelector(".take");
  if (book.available) {
    btn.addEventListener("click", () => take(book.id));
  }
  
  return tr;
}

function renderCatalog(list) {
  const tbody = document.querySelector("#books tbody");
  tbody.replaceChildren(...list.map(createRow));
}

function renderMyBooks() {
  const ul = document.getElementById("my-list");
  if (!library.currentUser) {
    ul.replaceChildren();
    return;
  }
  
  const activeLoans = library.getActiveLoans(library.currentUser.id);
  const rows = activeLoans.map(loan => {
    const book = library.books.find(b => b.id === loan.bookId);
    const li = document.createElement("li");
    li.textContent = `${book.title} — взята ${loan.takenAt}`;
    return li;
  });
  ul.replaceChildren(...rows);
}

function refresh() {
  renderCatalog(library.find(state));
  renderMyBooks();
}

function take(bookId) {
  try {
    library.takeBook(bookId);
    refresh();
  } catch (e) {
    alert(e.message);
  }
}

const searchForm = document.getElementById("search-form");
if (searchForm) {
  searchForm.addEventListener("submit", e => e.preventDefault());
}

const qInput = document.querySelector('input[name="q"]');
if (qInput) {
  qInput.addEventListener("input", e => {
    state.query = e.target.value;
    refresh();
  });
}

const genreSelect = document.querySelector('select[name="genre"]');
if (genreSelect) {
  genreSelect.addEventListener("change", e => {
    state.genre = e.target.value;
    refresh();
  });
}

document.querySelectorAll("th[data-sort]").forEach(th => {
  th.addEventListener("click", () => {
    const key = th.dataset.sort;
    if (state.sortKey === key) {
      state.sortDir *= -1;
    } else {
      state.sortKey = key;
      state.sortDir = 1;
    }
    refresh();
  });
});

refresh();