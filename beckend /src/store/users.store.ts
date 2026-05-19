import { all, get, run } from "../db/dbClient";
import { escapeSqlString } from "../db/sqlHelpers";

type User = {
  id: number;
  displayName: string;
  email: string;
  role: string;
};

type UserInput = {
  name: string;
  email: string;
  role: string;
};

async function list(): Promise<User[]> {
  return await all(`
    SELECT
      id,
      displayName,
      email,
      role
    FROM users
    ORDER BY id DESC;
  `);
}

async function getById(id: string): Promise<User | undefined> {
  const userId = Number(id);

  return await get(`
    SELECT
      id,
      displayName,
      email,
      role
    FROM users
    WHERE id = ${userId};
  `);
}

async function create(data: UserInput): Promise<User> {
  const displayName = escapeSqlString(data.name);
  const email = escapeSqlString(data.email);
  const role = escapeSqlString(data.role);

  const result = await run(`
    INSERT INTO users (displayName, email, role)
    VALUES ('${displayName}', '${email}', '${role}');
  `);

  const created = await getById(String(result.lastID));

  if (!created) {
    throw new Error("Failed to create user");
  }

  return created;
}

async function update(id: string, data: UserInput): Promise<User | null> {
  const userId = Number(id);
  const displayName = escapeSqlString(data.name);
  const email = escapeSqlString(data.email);
  const role = escapeSqlString(data.role);

  const result = await run(`
    UPDATE users
    SET
      displayName = '${displayName}',
      email = '${email}',
      role = '${role}'
    WHERE id = ${userId};
  `);

  if (result.changes === 0) {
    return null;
  }

  const updated = await getById(id);
  return updated ?? null;
}

async function remove(id: string): Promise<boolean> {
  const userId = Number(id);

  const result = await run(`
    DELETE FROM users
    WHERE id = ${userId};
  `);

  return result.changes > 0;
}



export { list, getById, create, update, remove };