exports.up = async (sql) => {
  console.log('Initializing database users...');
  await sql`
		CREATE TABLE users (
				id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
				username varchar(30) NOT NULL UNIQUE,
				userlevel integer NOT NULL,
				account_val real NOT NULL,
				password_hash varchar(60) NOT NULL,
				session_id integer
			);
	`;
};

exports.down = async (sql) => {
  console.log('Dropping table users...');
  await sql`
    DROP TABLE "users";
  `;
};
