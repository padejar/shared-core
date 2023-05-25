import { routes as applicationRoutes } from "../application";
import { routes as authRoutes } from "../auth";
import { PageRoute } from "../common/types/PageRoute";
import { routes as kitchenSinkRoutes } from "../kitchen-sink";
import { routes as userRoutes } from "../user";

const privateRoutes: PageRoute[] = [...applicationRoutes, ...userRoutes];
const publicRoutes: PageRoute[] = [...authRoutes, ...kitchenSinkRoutes];

export { privateRoutes, publicRoutes };
