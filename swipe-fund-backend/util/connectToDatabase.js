import camelcaseKeys from 'camelcase-keys';
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
  const resp = await sql`SELECT * FROM users;`;
  return resp.map((user) => camelcaseKeys(user));
}

export async function getAllSessions() {
  const resp = await sql`SELECT * FROM sessions;`;
  return resp.map((session) => camelcaseKeys(session));
}

export async function getUserById(id) {
  const resp = await sql`select * from users WHERE id = ${id};`;
  return {
    id: resp[0].id,
    username: resp[0].username,
    userlevel: resp[0].userlevel,
    accountVal: resp[0].account_val,
  };
}

export async function getUserBySessionToken(token) {
  if (!token) return undefined;
  const [user] = await sql`
    SELECT
      users.id,
      users.username,
      users.level,
      users.account_val
    FROM
      users,
      sessions
    WHERE
      sessions.token = ${token} AND
      sessions.user_id = users.id AND
      sessions.expiry_timestamp > now();
  `;
  return {
    id: user[0].id,
    username: user[0].username,
    userlevel: user[0].userlevel,
    accountVal: user[0].account_val,
  };
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

  return camelcaseKeys(session);
}

export async function getUserExists(name) {
  const resp = await sql`
    SELECT 1 FROM users WHERE username = ${name};`;
  return resp;
}

export async function getUserByUsername(name) {
  const resp = await sql`
    SELECT * FROM users WHERE username = ${name};
  `;
  return {
    id: resp[0].id,
    username: resp[0].username,
    userlevel: resp[0].userlevel,
    accountVal: resp[0].account_val,
  };
}

export async function getUserWithPasswordHashByUsername(name) {
  const resp = await sql`
    SELECT
      *
    FROM
      users
    WHERE
      username = ${name};
  `;
  if (!resp[0]) {
    return undefined;
  }
  return {
    id: resp[0].id,
    username: resp[0].username,
    userlevel: resp[0].userlevel,
    accountVal: resp[0].account_val,
    passwordHash: resp[0].password_hash,
  };
}

// MUTATIONS

export async function createUser(name, level, accountVal, password) {
  // const passwordHash = await bcrypt.hash(password, 12);
  const user =
    await sql`INSERT INTO users (username, userlevel, account_val, password_hash)
  VALUES (${name}, ${level}, ${accountVal}, ${password}) RETURNING id;`;
  return {
    id: user[0].id,
    username: name,
    userlevel: level,
    accountVal: accountVal,
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
  return camelcaseKeys(session[0]);
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
  return camelcaseKeys(user[0]);
}

export async function changeUserSessionId(userId, id) {
  await sql`
    UPDATE
      users
    SET
      session_id = ${id}
    WHERE
      id = ${userId};
    `;
  // if (!resp[0]) {
  //   return false;
  // } else {
  //   return true;
  // }
  return true;
}

export async function deleteUserSessionId(userId) {
  const resp = await sql`
    UPDATE
      users
    SET
      session_id = null
    WHERE
      id = ${userId};
    `;
  return !!resp[0];
}
