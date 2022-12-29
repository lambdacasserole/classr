import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { classifierRouter } from "./classifier";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  classifier: classifierRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
