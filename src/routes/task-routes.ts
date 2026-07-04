import { Router } from "express";
import { TaskController } from "@/controller/task-controllers";
import { ensureAuthenticated } from "@/middleware/ensure-authenticated";
import { verifyUserAuthorization } from "@/middleware/verifyUserAutorization";


const taskRouter = Router()
const taskController = new TaskController()

taskRouter.use(ensureAuthenticated, verifyUserAuthorization(["admin"]))

taskRouter.post("/", taskController.create)
taskRouter.get("/", taskController.show)
taskRouter.put("/", taskController.update)
taskRouter.delete("/:taskId", taskController.delete)

export { taskRouter }