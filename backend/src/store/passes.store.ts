import { all, get, run } from "../db/dbClient";

type Pass = {
  id: number;
  userId: number;
  userName: string;
  reasonId: number;
  reasonName: string;
  statusId: number;
  statusName: string;
  validDate: string;
  comment: string | null;
  issuer: string;
  createdAt: string;
  deletedAt: string | null;
};

type PassInput = {
  userId: number;
  reasonId: number;
  statusId: number;
  validDate: string;
  comment: string;
  issuer: string;
};

type CurrentUser = { userId: number; role: string };

function ownerCondition(currentUser: CurrentUser) {
  return currentUser.role === "admin" ? { sql: "", params: [] } : { sql: "AND p.userId = ?", params: [currentUser.userId] };
}

async function list(currentUser: CurrentUser): Promise<Pass[]> {
  const owner = ownerCondition(currentUser);
  return await all(
    `
    SELECT
      p.id,
      p.userId,
      u.displayName AS userName,
      p.reasonId,
      r.name AS reasonName,
      p.statusId,
      s.name AS statusName,
      p.validDate,
      p.comment,
      p.issuer,
      p.createdAt,
      p.deletedAt
    FROM passes p
    JOIN users u ON u.id = p.userId
    JOIN passReasons r ON r.id = p.reasonId
    JOIN passStatuses s ON s.id = p.statusId
    WHERE p.deletedAt IS NULL
      ${owner.sql}
    ORDER BY p.createdAt DESC, p.id DESC
    LIMIT 50;
  `,
    owner.params
  );
}

async function getById(id: string, currentUser: CurrentUser): Promise<Pass | undefined> {
  const owner = ownerCondition(currentUser);
  return await get(
    `
    SELECT
      p.id,
      p.userId,
      u.displayName AS userName,
      p.reasonId,
      r.name AS reasonName,
      p.statusId,
      s.name AS statusName,
      p.validDate,
      p.comment,
      p.issuer,
      p.createdAt,
      p.deletedAt
    FROM passes p
    JOIN users u ON u.id = p.userId
    JOIN passReasons r ON r.id = p.reasonId
    JOIN passStatuses s ON s.id = p.statusId
    WHERE p.id = ?
      ${owner.sql}
      AND p.deletedAt IS NULL;
  `,
    [Number(id), ...owner.params]
  );
}

async function create(data: PassInput): Promise<Pass> {
  const createdAt = new Date().toISOString();

  const result = await run(
    `
    INSERT INTO passes (
      userId,
      reasonId,
      statusId,
      validDate,
      comment,
      issuer,
      createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?);
  `,
    [
      Number(data.userId),
      Number(data.reasonId),
      Number(data.statusId),
      data.validDate,
      data.comment || "",
      data.issuer,
      createdAt,
    ]
  );

  await run(
    `
    INSERT INTO passHistory (passId, action, createdAt)
    VALUES (?, ?, ?);
  `,
    [result.lastID, "CREATED", createdAt]
  );

  const created = await getById(String(result.lastID), { userId: data.userId, role: "admin" });

  if (!created) {
    throw new Error("Failed to create pass");
  }

  return created;
}

async function update(
  id: string,
  currentUser: CurrentUser,
  data: PassInput
): Promise<Pass | null> {
  const result = await run(
    `
    UPDATE passes
    SET
      reasonId = ?,
      statusId = ?,
      validDate = ?,
      comment = ?,
      issuer = ?
    WHERE id = ?
      ${currentUser.role === "admin" ? "" : "AND userId = ?"}
      AND deletedAt IS NULL;
  `,
    [
      Number(data.reasonId),
      Number(data.statusId),
      data.validDate,
      data.comment || "",
      data.issuer,
      Number(id),
      ...(currentUser.role === "admin" ? [] : [currentUser.userId]),
    ]
  );

  if (result.changes === 0) {
    return null;
  }

  const historyCreatedAt = new Date().toISOString();

  await run(
    `
    INSERT INTO passHistory (passId, action, createdAt)
    VALUES (?, ?, ?);
  `,
    [Number(id), "UPDATED", historyCreatedAt]
  );

  const updated = await getById(id, currentUser);
  return updated ?? null;
}

async function remove(id: string, currentUser: CurrentUser): Promise<boolean> {
  const deletedAt = new Date().toISOString();

  const result = await run(
    `
    UPDATE passes
    SET deletedAt = ?
    WHERE id = ?
      ${currentUser.role === "admin" ? "" : "AND userId = ?"}
      AND deletedAt IS NULL;
  `,
    [deletedAt, Number(id), ...(currentUser.role === "admin" ? [] : [currentUser.userId])]
  );

  if (result.changes === 0) {
    return false;
  }

  await run(
    `
    INSERT INTO passHistory (passId, action, createdAt)
    VALUES (?, ?, ?);
  `,
    [Number(id), "SOFT_DELETED", deletedAt]
  );

  return true;
}

async function getStats(currentUser: CurrentUser) {
  const owner = ownerCondition(currentUser);
  return await all(
    `
    SELECT
      p.statusId,
      COUNT(*) as count
    FROM passes p
    WHERE p.deletedAt IS NULL
      ${owner.sql}
    GROUP BY p.statusId;
  `,
    owner.params
  );
}

export { list, getById, create, update, remove, getStats };