import { Router } from "express";
import { userRoutes } from "./user-routes";
import { sessionsRoutes } from "./sessions-routes";
import { teamsRoutes } from "./teams-routes";
import { membersRoutes } from "./members-routes";
import { taskRouter } from "./task-routes";
import { filterTaskRoutes } from "./task-filter-routes";
import { membersTaskUpdateRoutes } from "./members-task-update-routes";
import { taskHistoryRoutes } from "./task-history-routes";

const routes = Router()

routes.use("/users", userRoutes)
routes.use("/sessions", sessionsRoutes)
routes.use("/teams", teamsRoutes)
routes.use("/members", membersRoutes)
routes.use("/task", taskRouter)
routes.use("/filterTask", filterTaskRoutes)
routes.use("/membersTaskUpdate", membersTaskUpdateRoutes)
routes.use("/taskHistory", taskHistoryRoutes)

export { routes }