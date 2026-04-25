import { auth } from "../lib/auth";

export async function requireAuth(req: any, res: any, next: any) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  req.user = session.user;
  next();
}