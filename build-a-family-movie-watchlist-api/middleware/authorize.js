export function authorizeModification(req, res, next) {
  const { role, id } = req.user ?? {};
  const targetId = req.params?.userId;
  const isOwner = String(targetId) === String(id);
  const allowed = role === "parent" || (role === "child" && isOwner);

  if (!allowed) {
    return res.status(403).json({ error: "Access denied" });
  }

  return next();
}