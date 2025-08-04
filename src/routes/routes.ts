import { Request, Response } from "express";
import UserCRUD from "../database/user.js";

export const routeHome = (req: Request, res: Response) => {
  res.send("Hello!");
};


export const createUser = (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  // Here you would typically handle user creation logic, e.g., saving to a database
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }
  const userCRUD = new UserCRUD();
  userCRUD.createUser({ name, email, password })
    .then(() => {
      res.status(201).json({ message: "User created successfully", user: { name, email } });
    })
    .catch((error) => {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Internal server error" });
    });
};

export const getUser = (req: Request, res: Response) => {
  const userId =  parseInt(req.params.id);
  const userCRUD = new UserCRUD();
  userCRUD.getUserById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: `User details for ID ${userId}`, user });
    })
    .catch((error) => {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal server error" });
    });
};

export const updateUser = (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  const { name, email, password } = req.body;
  const userCRUD = new UserCRUD();
  userCRUD.updateUser(userId, { name, email, password })
    .then(() => {
      res.status(200).json({ message: `User with ID ${userId} updated successfully`, user: { id: userId, name, email } });
    })
    .catch((error) => {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Internal server error" });
    });
};

export const deleteUser = (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  const userCRUD = new UserCRUD();
  userCRUD.deleteUser(userId)
    .then(() => {
      res.status(200).json({ message: `User with ID ${userId} deleted successfully` });
    })
    .catch((error) => {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Internal server error" });
    });
};
