import { all, get, run } from "../db/dbClient";

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
  return await get(
    `
    SELECT
      id,
      displayName,
      email,
      role
    FROM users
    WHERE id = ?;
  `,
    [Number(id)]
  );
}

async function create(data: UserInput): Promise<User> {
  const result = await run(
    `
    INSERT INTO users (displayName, email, role)
    VALUES (?, ?, ?);
  `,
    [data.name, data.email, data.role]
  );

  const created = await getById(String(result.lastID));

  if (!created) {
    throw new Error("Failed to create user");
  }

  return created;
}

async function update(id: string, data: UserInput): Promise<User | null> {
  const result = await run(
    `
    UPDATE users
    SET
      displayName = ?,
      email = ?,
      role = ?
    WHERE id = ?;
  `,
    [data.name, data.email, data.role, Number(id)]
  );

  if (result.changes === 0) {
    return null;
  }

  const updated = await getById(id);
  return updated ?? null;
}

async function remove(id: string): Promise<boolean> {
  const result = await run(
    `
    DELETE FROM users
    WHERE id = ?;
  `,
    [Number(id)]
  );

  return result.changes > 0;
}

export { list, getById, create, update, remove };