import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  token: null,
  userId: null,
  name: null,
  role: null,
  companyId: null,
  labId: null,
  login: () => {},
  logout: () => {},
});
