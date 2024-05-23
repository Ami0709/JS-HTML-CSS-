document.addEventListener('DOMContentLoaded', function() {
    const addBookForm = document.getElementById('addBookForm');
    const bookListTableBody = document.getElementById('bookListTableBody')
    const searchForm = document.getElementById('searchForm');
    const searchBookListTableBody = document.getElementById('searchBookListTableBody');
    const borrowedBookTableBody = document.getElementById('borrowedBookTable').getElementsByTagName('tbody')[0];
    const availabilityForm = document.getElementById('availabilityForm');
    const availableBookTableBody = document.querySelector('.available-book-list tbody');
  
    addBookForm.addEventListener('submit', function(event) {
        event.preventDefault();
  
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const publicationYear = document.getElementById('publicationYear').value;
        const isbn = document.getElementById('isbn').value;
  
        if (!title || !author || !publicationYear || !isbn) {
            alert("Please fill in all fields.");
            return;
        }
  
        const newBook = new Book(
            library.books.length + 1,
            title,
            author,
            parseInt(publicationYear),
            true,
            7,
            isbn
        );
  
        try {
            library.addBook(newBook);
            library.updateBookListTable();
            localStorage.setItem('books', JSON.stringify(library.books));
        } catch (error) {
            alert(error.message);
        }
        addBookForm.reset();
    });
  
    const storedBooks = localStorage.getItem('books');
    if (storedBooks) {
        library.books = JSON.parse(storedBooks);
        library.updateBookListTable();
    }
  
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const query = document.getElementById('book-details').value;
        const result = library.searchBook(query);
        if (result) {
            updateSearchResults([result]);
        } else {
            alert('Book not found!');
        }
    });
  
    function updateSearchResults(results) {
        searchBookListTableBody.innerHTML = '';
        results.forEach(book => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${book.id}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.publicationYear}</td>
                <td>${book.availability ? 'Available' : 'Not Available'}</td>
                <td>${book.maxDays}</td>
                <td>${book.isbn}</td>
            `;
            searchBookListTableBody.appendChild(newRow);
        });
    }
  
    const borrowForm = document.getElementById('borrowForm');
    borrowForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const bookId = parseInt(document.getElementById('book-id').value);
        try {
            const borrowedBook = library.borrowBookById(bookId, borrowedBookTableBody);
            alert(`Book "${borrowedBook.bookTitle}" with ID ${borrowedBook.bookId} has been borrowed.`);
        } catch (error) {
            alert(error.message);
        }
    });
  
    const returnForm = document.getElementById('returnForm');
    returnForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const isbn = document.getElementById('isbn').value;
        try {
            library.returnBookByISBN(isbn);
            alert(`Book with ISBN ${isbn} has been returned.`);
            library.updateBookListTable();
        } catch (error) {
            alert(error.message);
        }
    });
  
    availabilityForm.addEventListener('submit', function(event) {
        event.preventDefault();
        bookAvailabilityCheck();
    });
  
    function bookAvailabilityCheck() {
        const bookId = parseInt(document.getElementById('book-id-name').value);
        const book = library.books.find(b => b.id === bookId);
        if (book) {
            if (book.availability) {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${book.id}</td>
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.publicationYear}</td>
                    <td>${book.isbn}</td>
                `;
                availableBookTableBody.appendChild(newRow);
            } else {
                alert("Book is already borrowed. Please choose another book.");
            }
        } else {
            alert("Book is already borrowed. Please choose another book.");
        }
    }
  
    // Add an event listener for the 'unload' event
    window.addEventListener('unload', function() {
        // Clear all data stored in local storage
        localStorage.clear();
    });
  });
  
  // Book class
  class Book {
    constructor(id, title, author, publicationYear, availability, maxDays, isbn) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.publicationYear = publicationYear;
        this.availability = availability;
        this.maxDays = maxDays;
        this.isbn = isbn;
    }
  }
  
  // User class
  class User {
    constructor(userId, bookId, bookTitle, borrowedDate) {
        this.userId = userId;
        this.bookId = bookId;
        this.bookTitle = bookTitle;
        this.borrowedDate = borrowedDate;
    }
  }
  
  // Library class
  class Library {
    constructor() {
        this.books = [];
        this.users = [];
    }
  
    // Add book
    addBook(book) {
        if (book.publicationYear < 1995 || book.publicationYear > 2020) {
            throw new Error("Invalid publication year");
        }
  
        const isbnRegex = /^\d{3}-\d{5}-\d-\d{3}$/;
        if (!isbnRegex.test(book.isbn)) {
            throw new Error("Invalid ISBN");
        }
  
        this.books.push(book);
    }
  
    // Search book
    searchBook(query) {
        const params = query.split(" ");
        const title = params[0];
        const author = params[1];
        const publicationYear = params[2];
  
        for (let book of this.books) {
            if (book.title === title &&
                book.author === author &&
                book.publicationYear == publicationYear) {
                return book;
            }
        }
        return null;
    }
  
    // Borrow book by ID
    borrowBookById(id, borrowedBookTableBody) { 
        const bookIndex = this.books.findIndex(b => b.id === id);
        if (bookIndex === -1) {
            throw new Error("Invalid Book Id");
        }
    
        const book = this.books[bookIndex];
        if (!book.availability) {
            throw new Error("Book not available");
        }
        book.availability = false;
        const borrowedBook = this.books.splice(bookIndex, 1)[0];
    
        const userId = Date.now();
        const borrowedDate = new Date();
        const user = new User(userId, borrowedBook.id, borrowedBook.title, borrowedDate);
        this.users.push(user);
    
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${borrowedBook.id}</td>
            <td>${borrowedBook.title}</td>
            <td>${borrowedBook.author}</td>
            <td>${borrowedBook.publicationYear}</td>
            <td>${borrowedBook.isbn}</td>
            <td>${borrowedDate.toLocaleDateString()}</td> <!-- Display borrowed date -->
        `;
        borrowedBookTableBody.appendChild(newRow);
    
        return user;
    }
  
    // Return book by ISBN
    returnBookByISBN(isbn) {
        const borrowedUserIndex = this.users.findIndex(u => {
            const book = this.books.find(b => b.id === u.bookId && b.isbn === isbn);
            return book !== undefined;
        });
    
        if (borrowedUserIndex === -1) {
            throw new Error("Book with the provided ISBN is not borrowed");
        }
    
        const borrowedUser = this.users[borrowedUserIndex];
        const borrowedBookIndex = this.books.findIndex(b => b.id === borrowedUser.bookId && b.isbn === isbn);
    
        const borrowedBookRow = borrowedBookTableBody.querySelector(`tr:nth-child(${borrowedBookIndex + 1})`);
        if (borrowedBookRow) {
            borrowedBookRow.remove();
        }
        const borrowedBook = this.books[borrowedBookIndex];
        borrowedBook.availability = true;
        this.users.splice(borrowedUserIndex, 1);
        this.books.splice(borrowedBookIndex, 1);
        return borrowedBook;
    }
  
    // Due Date Check
    dueDateCheck(id) {
        const bookIndex = this.books.findIndex(b => b.id === id);
        if (bookIndex === -1) {
            throw new Error("Invalid Book Id");
        }
    
        const borrowedBook = this.books[bookIndex];
        if (borrowedBook.availability) {
            throw new Error("Book not borrowed");
        }
    
        const dueDate = new Date(borrowedBook.borrowedDate);
        dueDate.setDate(dueDate.getDate() + borrowedBook.maxDays);
    
        return {
            id: borrowedBook.id,
            title: borrowedBook.title,
            author: borrowedBook.author,
            publicationYear: borrowedBook.publicationYear,
            dueDate: dueDate
        };
    }
    
    // Update book list table
    updateBookListTable() {
        const bookListTableBody = document.getElementById('bookListTableBody');
        bookListTableBody.innerHTML = '';
    
        this.books.forEach(book => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${book.id}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.publicationYear}</td>
                <td>${book.availability ? 'Available' : 'Not Available'}</td>
                <td>${book.maxDays}</td>
                <td>${book.isbn}</td>
            `;
            bookListTableBody.appendChild(newRow);
        });
    }
  }
  
  // Create library
  const library = new Library();
  