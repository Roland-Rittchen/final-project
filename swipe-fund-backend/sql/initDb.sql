CREATE TABLE IF NOT EXISTS users (
				id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
				username varchar(30) NOT NULL UNIQUE,
				userlevel integer NOT NULL,
				password_hash varchar(60) NOT NULL
			);

CREATE TABLE IF NOT EXISTS sessions (
			id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
			token varchar(90) UNIQUE NOT NULL,
			expiry_timestamp timestamp NOT NULL DEFAULT NOW() + INTERVAL '24 hours',
			user_id integer REFERENCES users (id) ON DELETE CASCADE
		);