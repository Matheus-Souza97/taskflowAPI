import { Router } from "express";

import { UserController } from "@/controller/users-controller";

const userRoutes = Router()
const userController = new UserController()

userRoutes.post("/", userController.create)
userRoutes.delete("/:userId", userController.delete)

export { userRoutes }