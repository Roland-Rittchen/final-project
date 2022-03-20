exports.up = async (sql) => {
  console.log('Initializing database sessions...');
  await sql`
		CREATE TABLE sessions (
			id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
			token varchar(90) UNIQUE NOT NULL,
			expiry_timestamp timestamp NOT NULL DEFAULT NOW() + INTERVAL '24 hours',
			user_id integer REFERENCES users (id) ON DELETE CASCADE
		);
	`;
};

exports.down = async (sql) => {
  console.log('Dropping table sessions...');
  await sql`
		DROP TABLE "sessions";
  `;
};
