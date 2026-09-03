import type { AuthUser, User } from "../types/User";
import users from "../data/users.json";

export function toAuthUser(user: User): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

export function getSavedUsers(): User[] {
  const savedUsers = localStorage.getItem("users");

  return savedUsers ? JSON.parse(savedUsers) : [];
}

export function getAllUsers(): User[] {
  const savedUsers = getSavedUsers();

  return [...users, ...savedUsers];
}

export function authenticateUser(
  email: string,
  password: string
): User | undefined {
  const allUsers = getAllUsers();

  return allUsers.find(
    (user) => user.email === email && user.password === password
  );
}

export function saveUser(user: User): void {
  const savedUsers = getSavedUsers();

  savedUsers.push(user);

  localStorage.setItem("users", JSON.stringify(savedUsers));
}

export function logoutUser(): void {
  localStorage.removeItem("loggedInUser");
}
