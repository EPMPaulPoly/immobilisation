import { Router, Application } from "express";
import { extractRoutes } from "../../lib/routes-introspection";

export default function adminRoutes(app: Application) {
  const router = Router();

  router.get("/routes", (req, res) => {
    res.json(extractRoutes(app));
  });

  return router;
}