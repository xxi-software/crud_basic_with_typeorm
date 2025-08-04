import { Request, Response } from "express";
import { BookService } from "../database/book.js";

const bookService = new BookService();

export const routeHome = (req: Request, res: Response) => {
  res.send("Hello!");
};


export const createBook = async (req: Request, res: Response) => {
  const { title, author, genre, date_published } = req.body;
  // Here you would typically handle book creation logic, e.g., saving to a database
  if (!title || !author || !genre || !date_published) {
    return res.status(400).json({ message: "Title, author, genre, and date published are required." });
  }
  try {
    const book = await bookService.createBook(title, author, genre, date_published);
    res.status(201).json({message: "Book created"})
  }
  catch(e: any) {
    res.status(500).json({message: "Internal server error", error: e.message});
  }
  
};

export const getBook = async (req: Request, res: Response) => {
  const bookId =  parseInt(req.params.id);
  try {
    const book = await bookService.getBookById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  const bookId = parseInt(req.params.id);
  const { title, author, genre, date_published } = req.body;
  try {
    await bookService.updateBook(bookId, title, author, genre, date_published);
    res.status(200).json({ message: "Book updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  const bookId = parseInt(req.params.id);
  try {
    await bookService.deleteBook(bookId);
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
