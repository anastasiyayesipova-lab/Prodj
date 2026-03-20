type Pass = {
  id: number;
  userName: string;
  reason: string;
  validDate: string;
  comment: string;
  issuer: string;
};

type PassInput = {
  userName: string;
  reason: string;
  validDate: string;
  comment: string;
  issuer: string;
};

let nextId = 1;
const passes: Pass[] = [];

function list(): Pass[] {
  return passes;
}

function getById(id: string): Pass | undefined {
  return passes.find((p) => p.id === Number(id));
}

function create(data: PassInput): Pass {
  const newPass: Pass = {
    id: nextId++,
    userName: data.userName,
    reason: data.reason,
    validDate: data.validDate,
    comment: data.comment,
    issuer: data.issuer,
  };

  passes.push(newPass);
  return newPass;
}

function update(id: string, data: PassInput): Pass | null {
  const pass = passes.find((p) => p.id === Number(id));
  if (!pass) return null;

  pass.userName = data.userName;
  pass.reason = data.reason;
  pass.validDate = data.validDate;
  pass.comment = data.comment;
  pass.issuer = data.issuer;

  return pass;
}

function remove(id: string): boolean {
  const index = passes.findIndex((p) => p.id === Number(id));
  if (index === -1) return false;

  passes.splice(index, 1);
  return true;
}

export { list, getById, create, update, remove };