
process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const db = require("../db");
const Book = require("../models/book")

let book_isbn;

beforeEach(async function() {
    await db.query("DELETE FROM books");
    let b = await Book.create({
        isbn: "0691161518",
        amazon_url: "http://a.co/eobPtX2",
        author: "Matthew Lane",
        language: "english",
        pages: 264,
        publisher: "Princeton University Press",
        title: "Power-Up: Unlocking Hidden Math in Video Games",
        year: 2017
    })
    book_isbn = b.isbn
});

describe("POST /books", function() {
    test("can create a book", async function () {
        let b = await request(app)
            .post("/books")
            .send({
            isbn: "0345514408",
            amazon_url: "https://www.amazon.com/Know-Why-Caged-Bird-Sings/dp/0345514408",
            author: "Maya Angelou",
            language: "english",
            pages: 304,
            publisher: "Ballantine Books",
            title: "I Know Why the Caged Bird Sings",
            year: 2009
        });
        expect(b.statusCode).toBe(201);
     });
    test("invalid create book", async function() {
        let b = await request(app)
        .post("/books")
        .send({
        isbn: "0345514408",
        amazon_url: "https://www.amazon.com/Know-Why-Caged-Bird-Sings/dp/0345514408",
        author: "Maya Angelou",
        language: "english",
        pages: "test",
        publisher: "Ballantine Books",
        title: "I Know Why the Caged Bird Sings",
        year: 2009
    });
    expect(b.statusCode).toBe(500);
    })
})

describe("GET /books", function() {
    test("retrieve all books", async function () {
        let b = await request(app)
         .get("/books")
        expect(b.body.books[0]).toHaveProperty("isbn");
     });
})

describe("GET /books/:id", function() {
    test("retrieve one book", async function () {
        let b = await request(app)
         .get(`/books/${book_isbn}`)
         expect(b.body.book.isbn).toBe(book_isbn)
     });
})


describe("PUT /books/:isbn", function() {
    test("update one book", async function () {
        let b = await request(app)
         .put(`/books/${book_isbn}`)
         .send({
            isbn: "0691161518",
            amazon_url: "http://a.co/eobPtX2",
            author: "Matthew Lane",
            language: "english",
            pages: 300,
            publisher: "Princeton University Press",
            title: "Power-Up: Unlocking Hidden Math in Video Games",
            year: 2017
        });
        expect(b.body.book.pages).toBe(300)
     });
})

describe("DELETE /books/:isbn", function() {
    test("delete one book", async function () {
        let b = await request(app)
         .delete(`/books/${book_isbn}`)
        expect(b.body.message).toBe("Book deleted")
     });
})

 afterAll(async function() {
    await db.end();
});