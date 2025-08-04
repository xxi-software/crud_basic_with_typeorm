import { Request, Response } from "express";
import { UserService } from "../database/userWithORM.js";

const userService = new UserService();

export const routeHome = (req: Request, res: Response) => {
  res.send("Hello!");
};


export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  // Here you would typically handle user creation logic, e.g., saving to a database
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }
  try {
    const user = await userService.createUser(name, email, password);
    res.status(201).json({message: "User created"})
  }
  catch(e: any) {
    res.status(500).json({message: "Internal server error", error: e.message});
  }
  
};

export const getUser = async (req: Request, res: Response) => {
  const userId =  parseInt(req.params.id);
  try {
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  const { name, email, password } = req.body;
  try {
    await userService.updateUser(userId, email, name, password);
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  try {
    await userService.deleteUser(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
