import { auth } from "../lib/auth";

export async function requireAuth(req: any, res: any, next: any) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return res.status(401).json({success:false, message: "Access to API currently unauthorized use website to login" });
  }

  req.user = session.user;
  next();
}