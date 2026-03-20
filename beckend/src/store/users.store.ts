type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type UserInput = {
  name: string;
  email: string;
  role: string;
};

let nextId = 1;
const users: User[] = [];

function list(): User[] {
  return users;
}

function getById(id: string): User | undefined {
  return users.find((u) => u.id === Number(id));
}

function create(data: UserInput): User {
  const newUser: User = {
    id: nextId++,
    name: data.name,
    email: data.email,
    role: data.role,
  };

  users.push(newUser);
  return newUser;
}

function update(id: string, data: UserInput): User | null {
  const user = users.find((u) => u.id === Number(id));
  if (!user) return null;

  user.name = data.name;
  user.email = data.email;
  user.role = data.role;

  return user;
}

function remove(id: string): boolean {
  const index = users.findIndex((u) => u.id === Number(id));
  if (index === -1) return false;

  users.splice(index, 1);
  return true;
}

export { list, getById, create, update, remove };