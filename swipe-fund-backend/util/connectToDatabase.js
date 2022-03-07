import bcrypt from 'bcrypt';
import { config } from 'dotenv-safe';
import postgres from 'postgres';

config();
const sql = postgres();

export async function getAllUsers() {
  return await sql`select * from users`;
}

export async function getUserById(id) {
  const resp = await sql`select * from users WHERE id = ${id}`;
  return {
    id: resp[0].id,
    username: resp[0].username,
    userlevel: resp[0].userlevel,
  };
}

export async function createUser(name, level, password) {
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await sql`INSERT INTO users (username, userlevel, password_hash)
  VALUES (${name}, ${level}, ${passwordHash}) RETURNING id;`;
  return {
    id: user[0].id,
    username: name,
    userlevel: level,
  };
}
