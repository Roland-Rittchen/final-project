exports.up = async (sql) => {
  console.log('Initializing database...');
  await sql`
		CREATE TABLE users (
				id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
				username varchar(30) NOT NULL UNIQUE,
				userlevel integer NOT NULL,
				password_hash varchar(60) NOT NULL
			);
	`;
};

exports.down = async (sql) => {
  console.log('Dropping tables...');
  await sql`
    DROP TABLE "user";
  `;
};
