// import type { AuthUser, User } from "../types/User";
// import users from "../data/users.json";

// export function toAuthUser(user: User): AuthUser {
//   return {
//     id: user.id,
//     name: user.name,
//     email: user.email,
//   };
// }

// export function getSavedUsers(): User[] {
//   const savedUsers = localStorage.getItem("users");

//   return savedUsers ? JSON.parse(savedUsers) : [];
// }

// export function getAllUsers(): User[] {
//   const savedUsers = getSavedUsers();

//   return [...users, ...savedUsers];
// }

// export function authenticateUser(
//   email: string,
//   password: string
// ): User | undefined {
//   const allUsers = getAllUsers();

//   return allUsers.find(
//     (user) => user.email === email && user.password === password
//   );
// }

// export function saveUser(user: User): void {
//   const savedUsers = getSavedUsers();

//   savedUsers.push(user);

//   localStorage.setItem("users", JSON.stringify(savedUsers));
// }

const AUTH_TOKEN_KEY = "token";

function getTokenStorage(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function getAuthToken(): string | null {
  const storage = getTokenStorage();
  return storage ? storage.getItem(AUTH_TOKEN_KEY) : null;
}

export function setAuthToken(token: string): void {
  const storage = getTokenStorage();
  if (storage) {
    storage.setItem(AUTH_TOKEN_KEY, token);
  }
}

export function clearAuthToken(): void {
  const storage = getTokenStorage();
  if (storage) {
    storage.removeItem(AUTH_TOKEN_KEY);
  }
}

export function logoutUser(): void {
  clearAuthToken();
}
