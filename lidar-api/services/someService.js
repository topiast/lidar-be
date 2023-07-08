import { sql } from "../database/database.js";

const findAll = async () => {
  return await sql`SELECT * FROM table_in_db;`;
};

export { findAll };
