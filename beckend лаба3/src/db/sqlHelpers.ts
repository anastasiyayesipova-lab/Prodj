function escapeSqlString(value: string): string {
  return String(value).replace(/'/g, "''");
}

export { escapeSqlString };