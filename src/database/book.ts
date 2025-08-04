import { Entity, PrimaryGeneratedColumn, Column, Repository } from "typeorm";
import { AppDataSource } from "./DataSource.js";

//Definición de la entidad Usuario
@Entity("books")
export class Book {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100 })
  title!: string;

  @Column({ type: "varchar", length: 100, unique: true })
  author!: string;

  @Column({ type: "varchar", length: 100 })
  genre!: string;

  @Column({ type: "date" })
  date_published!: Date;
}

// 2. Servicio CRUD usando Repository Pattern
export class BookService {
  private bookRepository: Repository<Book>;
  constructor() {
    this.bookRepository = AppDataSource.getRepository(Book);
  }

  async createBook(title: string, author: string, genre: string, date_published: Date): Promise<Book> {
    const book = this.bookRepository.create({ title, author, genre, date_published });
    await this.bookRepository.save(book);
    return book;
  };

  async getBookById(id: number): Promise<Book | null> {
    const book = await this.bookRepository.findOneBy({ id });
    return book;
  };

  async updateBook(id: number, title?: string, author?: string, genre?: string, date_published?: Date): Promise<Book | null> {
    const book = await this.bookRepository.findOneBy({ id });
    if (!book) return null;

    if (title) book.title = title;
    if (author) book.author = author;
    if (genre) book.genre = genre;
    if (date_published) book.date_published = date_published;

    await this.bookRepository.save(book);
    return book;
  };

  async deleteBook(id: number): Promise<void> {
    await this.bookRepository.delete(id);
  }
}