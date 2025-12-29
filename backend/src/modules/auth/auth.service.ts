import { User, IUser, UserRole } from "./user.model.js";
import bcrypt from "bcryptjs"; // for encrypting and matching the password

const SALT = 10;

export interface RegisterDetails {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export const registerUser = async (
  input: RegisterDetails
): Promise<SafeUser> => {
  const { name, email, password, role } = input;

  // 1)check if email already exists
  const existing = await User.findOne({ email });
  if (existing) {
    // for now we just throw a normal Error, controller will map it to 400
    throw new Error("Email is already registered");
  }

  // 2 : Hash password
  const hashedPassword = await bcrypt.hash(password, SALT);

  // 3) Create user in DB
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || "user",
  });

  // 4) safe data (no password)
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
