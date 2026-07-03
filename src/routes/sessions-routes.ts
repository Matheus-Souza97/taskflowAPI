import { Router } from "express";
import { SessionsControllers } from "@/controller/sessions-controllers";

const sessionsRoutes = Router()
const sessionsController = new SessionsControllers()

sessionsRoutes.post("/", sessionsController.create)

export { sessionsRoutes }