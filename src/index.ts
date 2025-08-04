import express  from "express";
import cors from "cors";
//import { createUser, getUser, updateUser, deleteUser, routeHome } from "./routes/routes.js";
import "reflect-metadata"; // Import reflect-metadata for TypeORM decorators
import { AppDataSource } from "./database/DataSource.js";
import { createUser, deleteUser, getUser, routeHome, updateUser } from "./routes/routesWithORM.js";
import { createBook, deleteBook, getBook, updateBook } from "./routes/routesBook.js";

// Initialize the Express application
async function initializeDB() {
  try {
    await AppDataSource.initialize();
    console.log("Conexión a la base de datos establecida con éxito.");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    // Puedes manejar el error o salir de la aplicación si la conexión falla
    process.exit(1);
  }
}

const app  = express();
app.use(express.json());
app.use(cors())

//User routes
app.get("/", routeHome);
app.post("/user", createUser);
app.get("/user/:id", getUser);
app.put("/user/:id", updateUser);
app.delete("/user/:id", deleteUser);

//Book routes
app.post("/book", createBook);
app.get("/book/:id", getBook);
app.put("/book/:id", updateBook);
app.delete("/book/:id", deleteBook);

const PORT = process.env.PORT || 3000;

initializeDB().catch(err => {
  console.error("Database connection failed", err);
  process.exit(1);
});

AppDataSource.initialize().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  });
});

export default app;