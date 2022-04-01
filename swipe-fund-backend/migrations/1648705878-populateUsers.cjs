const sampleUsers = [
  {
    username: 'Antje',
    userlevel: 3,
    accountVal: 2895,
    password: 'antje',
  },
  {
    username: 'Karl',
    userlevel: 3,
    accountVal: 2561,
    password: 'karl',
  },
  {
    username: 'Jose',
    userlevel: 2,
    accountVal: 2151,
    password: 'jose',
  },
  {
    username: 'Lukas',
    userlevel: 1,
    accountVal: 1214,
    password: 'lukas',
  },
  {
    username: 'Victor',
    userlevel: 1,
    accountVal: 1351,
    password: 'victor',
  },
  {
    username: 'Danny',
    userlevel: 1,
    accountVal: 1000,
    password: 'danny',
  },
];

async function loadMyModule(pw) {
  const bcrypt = await import('bcrypt');
  const passwordHash = await bcrypt.hash(pw, 12);
  return passwordHash;
}

exports.up = async (sql) => {
  // <insert magic here>
  console.log('Populate Users Table');
  for (let i = 0; i < sampleUsers.length; i++) {
    const passHash = await loadMyModule(sampleUsers[i].password);
    await sql`
			INSERT INTO users (username, userlevel, account_val, password_hash)
			VALUES (${sampleUsers[i].username}, ${sampleUsers[i].userlevel}, ${sampleUsers[i].accountVal}, ${passHash}) RETURNING id;`;
  }
};

exports.down = async () => {
  // just in case...
};
