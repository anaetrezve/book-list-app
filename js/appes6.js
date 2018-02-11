// Same app with ES6 version

// Book constructor
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}


// UI constructor
class UI {

  addBookToList (book) {
    const list = document.getElementById('book-lists');
  
    // Creating tr (table row) element
    const tr = document.createElement('tr');
    // Creating td or table column (table data) and append to tr
    tr.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="delete">X</a></td>
    `;
    
    list.appendChild(tr);
  };

  clearFields (title, author, isbn) {
    title.value = '';
    author.value = '';
    isbn.value = '';
  
    // Setting focus to title field
    title.focus();
  };

  showAlert (msg, cls) {
    // creating div for show alert
    const div = document.createElement('div');
    // Adding class to div
    div.className = `alert ${cls}`;
    // adding message to div
    div.textContent = `${msg}`;
  
    // selecting form 
    const form = document.querySelector('#book-form');
    form.insertAdjacentElement('beforebegin', div);
  
    setTimeout(() => {
      document.querySelector('.alert').remove();
    }, 3000);
  };

}

// Local storage Class
class Store {
  // Getting book from local storage
  static getBooks() {
    let books;
    if (localStorage.getItem('books') !== null) {
      books = JSON.parse(localStorage.getItem('books'));
    } else {
      books = [];
    }

    return books;
  }

  // Display books to UI
  static displayBook() {
    const books = Store.getBooks();
    const ui = new UI();

    books.forEach(book => {
      ui.addBookToList(book);
    });
  }

  // Add book to local storage
  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    // Adding to local storage
    localStorage.setItem('books', JSON.stringify(books));
  }

  // Remove book from local storage
  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach((item, index) => {
      if(item.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    // Adding updated array to local storage
    localStorage.setItem('books', JSON.stringify(books));
  }
}

// Document Load Event
document.addEventListener('DOMContentLoaded', Store.displayBook);

// Event listeners
document.getElementById('book-form').addEventListener('submit', e => {
  e.preventDefault();
  // Getting form values
  const title = document.getElementById('title');
  const author = document.getElementById('author');
  const isbn = document.getElementById('isbn');
  
  // Creating book object
  const book = new Book(title.value, author.value, isbn.value);
  
  // Creating UI object
  const ui = new UI();

  // validating fields
  if (title.value === "" || author.value === "" || isbn.value === "") {
    ui.showAlert('Please Fill all fields!', 'error');
  } else {
    // Adding book to the list
    ui.addBookToList(book);
    // Add book to local storage
    Store.addBook(book);
    // show success message
    ui.showAlert('Book Added Successfully!', 'success');
    // Clearing fields
    ui.clearFields(title, author, isbn);
  }
});

// Delete book list event
document.querySelector('#book-lists').addEventListener('click', (e) => {
  e.preventDefault();
  if(e.target.className === 'delete') {
    // deleting book list
    e.target.parentElement.parentElement.remove();
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  }
});