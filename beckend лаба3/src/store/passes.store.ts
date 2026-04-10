import { all, get, run } from "../db/dbClient";
import { escapeSqlString } from "../db/sqlHelpers";

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

async function list(): Promise<Pass[]> {
  return await all(`
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
    ORDER BY p.createdAt DESC, p.id DESC
    LIMIT 10;
  `);
}

async function getById(id: string): Promise<Pass | undefined> {
  const passId = Number(id);

  return await get(`
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
    WHERE p.id = ${passId}
      AND p.deletedAt IS NULL;
  `);
}

async function create(data: PassInput): Promise<Pass> {
  const userId = Number(data.userId);
  const reasonId = Number(data.reasonId);
  const statusId = Number(data.statusId);
  const validDate = escapeSqlString(data.validDate);
  const comment = escapeSqlString(data.comment || "");
  const issuer = escapeSqlString(data.issuer);
  const createdAt = new Date().toISOString();

  const result = await run(`
    INSERT INTO passes (
      userId,
      reasonId,
      statusId,
      validDate,
      comment,
      issuer,
      createdAt
    ) VALUES (
      ${userId},
      ${reasonId},
      ${statusId},
      '${validDate}',
      '${comment}',
      '${issuer}',
      '${createdAt}'
    );
  `);

  await run(`
    INSERT INTO passHistory (passId, action, createdAt)
    VALUES (${result.lastID}, 'CREATED', '${createdAt}');
  `);

  const created = await getById(String(result.lastID));

  if (!created) {
    throw new Error("Failed to create pass");
  }

  return created;
}

async function update(id: string, data: PassInput): Promise<Pass | null> {
  const passId = Number(id);
  const userId = Number(data.userId);
  const reasonId = Number(data.reasonId);
  const statusId = Number(data.statusId);
  const validDate = escapeSqlString(data.validDate);
  const comment = escapeSqlString(data.comment || "");
  const issuer = escapeSqlString(data.issuer);

  const result = await run(`
    UPDATE passes
    SET
      userId = ${userId},
      reasonId = ${reasonId},
      statusId = ${statusId},
      validDate = '${validDate}',
      comment = '${comment}',
      issuer = '${issuer}'
    WHERE id = ${passId}
      AND deletedAt IS NULL;
  `);

  if (result.changes === 0) {
    return null;
  }

  const historyCreatedAt = new Date().toISOString();

  await run(`
    INSERT INTO passHistory (passId, action, createdAt)
    VALUES (${passId}, 'UPDATED', '${historyCreatedAt}');
  `);

  const updated = await getById(id);
  return updated ?? null;
}

async function remove(id: string): Promise<boolean> {
  const passId = Number(id);
  const deletedAt = new Date().toISOString();


  const result = await run(`
    UPDATE passes
    SET deletedAt = '${deletedAt}'
    WHERE id = ${passId}
      AND deletedAt IS NULL;
  `);

  if (result.changes === 0) {
    return false;
  }

  await run(`
    INSERT INTO passHistory (passId, action, createdAt)
    VALUES (${passId}, 'SOFT_DELETED', '${deletedAt}');
  `);

  return true;
}

async function getStats() {
  return await all(`
    SELECT
      statusId,
      COUNT(*) as count
    FROM passes
    WHERE deletedAt IS NULL
    GROUP BY statusId;
  `);
}

export { list, getById, create, update, remove, getStats };