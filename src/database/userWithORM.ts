import { Entity, PrimaryGeneratedColumn, Column, Repository } from "typeorm";
import { AppDataSource } from "./DataSource.js";
import bcrypt from "bcrypt";

//Definición de la entidad Usuario
@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "varchar", length: 100, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 100 })
  password!: string;
}

// 2. Servicio CRUD usando Repository Pattern
export class UserService {
  private userRepository: Repository<User>;
  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async createUser(name: string, email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ name, email, password: hashedPassword });
    await this.userRepository.save(user);
    return user;
  };

  async getUserById(id: number): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id });
    return user;
  };

  async updateUser(id: number, name?: string, email?: string, password?: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) return null;

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;

    await this.userRepository.save(user);
    return user;
  };

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}