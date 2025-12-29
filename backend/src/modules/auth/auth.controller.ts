import { Request, Response } from "express";
import { registerUser } from "./auth.service.js";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    console.log(name, email, password, role); //debugg
    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "name, email and password are required",
      });
    }

    const user = await registerUser({ name, email, password, role });

    return res.status(201).json({
      message: "User registered successfully !",
      user,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Registration failed !",
    });
  }
};
