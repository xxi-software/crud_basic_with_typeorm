import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

// Definición de la interfaz de Usuario
interface User {
    id?: number;
    name: string;
    email: string;
    password: string;
}

class UserCRUD {
    private pool: mysql.Pool;

    constructor() {
        // Configuración de la conexión a la base de datos
        this.pool = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'crud_ts',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

    // Crear un nuevo usuario (con hash de contraseña)
    async createUser(user: User): Promise<void> {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const connection = await this.pool.getConnection();
        
        try {
            await connection.execute(
                'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                [user.name, user.email, hashedPassword]
            );
        } finally {
            connection.release();
        }
    }

    // Obtener usuario por ID (sin contraseña)
    async getUserById(id: number): Promise<Omit<User, 'password'> | null> {
        const connection = await this.pool.getConnection();
        
        try {
            const [rows] = await connection.execute(
                'SELECT id, name, email FROM users WHERE id = ?',
                [id]
            );
            
            const users = rows as any[];
            return users.length > 0 ? users[0] : null;
        } finally {
            connection.release();
        }
    }

    // Actualizar usuario
    async updateUser(id: number, updateData: Partial<User>): Promise<void> {
        const connection = await this.pool.getConnection();
        
        try {
            // Actualizar contraseña solo si se proporciona
            if (updateData.password) {
                updateData.password = await bcrypt.hash(updateData.password, 10);
            }
            
            const fields = Object.keys(updateData)
                .map(key => `${key} = ?`)
                .join(', ');
            
            const values = Object.values(updateData);
            values.push(id);
            
            await connection.execute(
                `UPDATE users SET ${fields} WHERE id = ?`,
                values
            );
        } finally {
            connection.release();
        }
    }

    // Eliminar usuario
    async deleteUser(id: number): Promise<void> {
        const connection = await this.pool.getConnection();
        
        try {
            await connection.execute(
                'DELETE FROM users WHERE id = ?',
                [id]
            );
        } finally {
            connection.release();
        }
    }

    // Autenticar usuario (verificar email y contraseña)
    async authenticate(email: string, password: string): Promise<User | null> {
        const connection = await this.pool.getConnection();
        
        try {
            const [rows] = await connection.execute(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );
            
            const users = rows as User[];
            if (users.length === 0) return null;
            
            const user = users[0];
            const passwordMatch = await bcrypt.compare(password, user.password);
            
            return passwordMatch ? user : null;
        } finally {
            connection.release();
        }
    }
}

export default UserCRUD;
