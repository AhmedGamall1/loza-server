import express from "express";
import {
  //   addAdmin,
  //   deleteUser,
  //   getAllAdmins,
  //   getAllUsers,
  getUserInfo,
  login,
  logout,
  register,
  //   removeAdmin,
  socialAuth,
} from "../controllers/user.controller.js";
import { isAuthenticatd } from "../middlewares/auth/isAuthenticated.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/logout", isAuthenticatd, logout);
userRouter.get("/me", isAuthenticatd, getUserInfo);
userRouter.post("/social-auth", socialAuth);

export default userRouter;
