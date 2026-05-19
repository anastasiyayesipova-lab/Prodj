import { db } from "./db";

function all(sql: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function get(sql: string): Promise<any> {
  return new Promise((resolve, reject) => {
    db.get(sql, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function run(sql: string): Promise<{ lastID: number; changes: number }> {
  return new Promise((resolve, reject) => {
    db.run(sql, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function exec(sql: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

export { all, get, run, exec };