import bcrypt from 'bcrypt';
import { config } from 'dotenv-safe';
import postgres from 'postgres';

config();
const sql = postgres();

export async function deleteExpiredSessions() {
  const sessions = await sql`
    DELETE FROM
      sessions
    WHERE
      expiry_timestamp < NOW()
    RETURNING *
  `;

  return sessions;
}

// QUERIES
export async function getAllUsers() {
  return await sql`SELECT * FROM users;`;
}

export async function getAllSessions() {
  return await sql`SELECT * FROM sessions;`;
}

export async function getUserById(id) {
  const resp = await sql`select * from users WHERE id = ${id};`;
  return {
    id: resp[0].id,
    username: resp[0].username,
    userlevel: resp[0].userlevel,
  };
}

export async function getUserBySessionToken(token) {
  if (!token) return undefined;
  const [user] = await sql`
    SELECT
      users.id,
      users.username
    FROM
      users,
      sessions
    WHERE
      sessions.token = ${token} AND
      sessions.user_id = users.id AND
      sessions.expiry_timestamp > now();
  `;
  return user;
}

export async function getValidSessionByToken(token) {
  if (!token) return undefined;
  const [session] = await sql`
    SELECT
      *
    FROM
      sessions
    WHERE
      token = ${token} AND
      expiry_timestamp > now();
  `;

  await deleteExpiredSessions();

  return session;
}

export async function getUserByUsername(name) {
  const [user] = await sql`
    SELECT id FROM users WHERE username = ${name};
  `;
  return user;
}

export async function getUserWithPasswordHashByUsername(name) {
  const [user] = await sql`
    SELECT
      id,
      username,
      password_hash
    FROM
      users
    WHERE
      username = ${name};
  `;
  return user;
}

// MUTATIONS

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

export async function createSession(token, userId) {
  const session = await sql`
    INSERT INTO sessions
      (token, user_id)
    VALUES
      (${token}, ${userId})
    RETURNING
      id,
      token,
      expiry_timestamp,
      user_id;
  `;

  await deleteExpiredSessions();
  // console.log('create session: ' + JSON.stringify(session));
  return session[0];
}

export async function deleteSessionByToken(token) {
  await sql`
    DELETE FROM
      sessions
    WHERE
      token = ${token};
  `;
  return;
}

export async function deleteUser(id) {
  const user = await sql`
    DELETE FROM
      users
    WHERE
      id = ${id}
    RETURNING *; `;
  return user[0];
}
