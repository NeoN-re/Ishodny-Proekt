class Library {
  constructor({ books, users, loans }) {
    this.books = books;
    this.users = users;
    this.loans = loans;
    this.currentUser = null;
  }

  find({ query = "", genre = "", sortKey = "", sortDir = 1 } = {}) {
    let result = [...this.books];
    const q = query.toLowerCase();

    if (q) {
      result = result.filter(b => 
        b.title.toLowerCase().includes(q) || 
        b.author.toLowerCase().includes(q)
      );
    }

    if (genre) {
      result = result.filter(b => b.genre === genre);
    }

    if (sortKey) {
      result.sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];
        if (typeof valA === "string") {
          return valA.localeCompare(valB, "ru") * sortDir;
        }
        return (valA - valB) * sortDir;
      });
    }
    return result;
  }

  takeBook(bookId) {
    if (!this.currentUser) {
      throw new Error("Войдите, чтобы взять книгу");
    }
    const book = this.books.find(b => b.id === bookId);
    if (!book) {
      throw new Error("Книга не найдена");
    }
    if (!book.available) {
      throw new Error("Книга уже выдана");
    }
    
    const maxId = this.loans.length > 0 ? Math.max(...this.loans.map(l => l.id)) : 0;
    this.loans.push({
      id: maxId + 1,
      userId: this.currentUser.id,
      bookId: book.id,
      takenAt: new Date().toISOString().slice(0, 10),
      returnedAt: null,
      rating: null
    });
    
    book.available = false;
  }

  getActiveLoans(userId) {
    return this.loans.filter(l => l.userId === userId && l.returnedAt === null);
  }
}