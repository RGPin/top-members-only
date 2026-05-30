const { Client } = require("pg");
const bcrypt = require("bcryptjs");

// let SQL = `
// DROP TABLE IF EXISTS posts;
// DROP TABLE IF EXISTS users;

// CREATE TABLE users (
//   id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
//   firstname VARCHAR (255) NOT NULL,
//   lastname VARCHAR (255) NOT NULL,
//   username VARCHAR (255) NOT NULL UNIQUE,
//   password VARCHAR (255) NOT NULL
// );

// CREATE TABLE posts (
//   id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
//   user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
//   content TEXT NOT NULL,
//   created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
// );

// INSERT INTO users (firstname, lastname, username, password)
// VALUES
//   ('John', 'Doe', 'johndoe', 'password123'),
//   ('Jane', 'Smith', 'janesmith', 'password321'),
//   ('Alice', 'Johnson', 'alicej', 'password213'),
//   ('Bob', 'Williams', 'bobw', 'password312'),
//   ('Jane', 'Doe', 'janedoe', 'hashed_password_123'),
//   ('John', 'Smith', 'johnsmith', 'hashed_password_456'),
//   ('Alice', 'Wonder', 'alice_w', 'hashed_password_789');

// INSERT INTO posts (user_id, content)
// VALUES
//   (1, 'Hello world! This is my first post.'),
//   (1, 'Learning PostgreSQL is actually pretty fun.'),
//   (2, 'Just finished a great cup of coffee ☕'),
//   (2, 'Anyone working on web development projects lately?'),
//   (3, 'JavaScript can be confusing sometimes.'),
//   (3, 'Finally understood async/await today!'),
//   (4, 'Building a CRUD app with Express and PostgreSQL.'),
//   (4, 'Happy coding everyone!'),
//   (5, 'Hello world! This is Jane''s first post.'),
//   (5, 'Just having some coffee and coding.'),
//   (6, 'Does anyone know a good recipe for banana bread?'),
//   (7, 'Down the rabbit hole we go! #programming');
// `;
const passwords = [
  "password123",
  "password321",
  "password213",
  "password312",
  "hashed_password_123",
  "hashed_password_456",
  "hashed_password_789",
];

async function hashPasswords(passwords) {
  const result = [];
  for (const password of passwords) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      result.push(hashedPassword);
    } catch (error) {
      console.error(error);
    }
  }
  return result;
}

async function main() {
  const client = new Client({
    connectionString: process.env.DB_URI,
  });

  try {
    console.log("Seeding...");
    const hashedPasswords = await hashPasswords(passwords);
    await client.connect();
    await client.query(`
      DROP TABLE IF EXISTS posts;
      DROP TABLE IF EXISTS users;

      CREATE TABLE users (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        firstname VARCHAR (255) NOT NULL,
        lastname VARCHAR (255) NOT NULL,
        username VARCHAR (255) NOT NULL UNIQUE,
        password VARCHAR (255) NOT NULL
      );

      CREATE TABLE posts (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(
      `
      INSERT INTO users (firstname, lastname, username, password)
      VALUES
        ('John', 'Doe', 'johndoe', $1),
        ('Jane', 'Smith', 'janesmith', $2),
        ('Alice', 'Johnson', 'alicej', $3),
        ('Bob', 'Williams', 'bobw', $4),
        ('Jane', 'Doe', 'janedoe', $5),
        ('John', 'Smith', 'johnsmith', $6),
        ('Alice', 'Wonder', 'alice_w', $7);
      `,
      hashedPasswords,
    );

    await client.query(`
      INSERT INTO posts (user_id, content)
      VALUES
        (1, 'Hello world! This is my first post.'),
        (1, 'Learning PostgreSQL is actually pretty fun.'),
        (2, 'Just finished a great cup of coffee ☕'),
        (2, 'Anyone working on web development projects lately?'),
        (3, 'JavaScript can be confusing sometimes.'),
        (3, 'Finally understood async/await today!'),
        (4, 'Building a CRUD app with Express and PostgreSQL.'),
        (4, 'Happy coding everyone!'),
        (5, 'Hello world! This is Jane''s first post.'),
        (5, 'Just having some coffee and coding.'),
        (6, 'Does anyone know a good recipe for banana bread?'),
        (7, 'Down the rabbit hole we go! #programming');
    `);

    console.log("done");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await client.end();
  }
}

main();
