const { Client } = require("pg");

const SQL = `
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  firstname VARCHAR (255) NOT NULL,
  lastname VARCHAR (255) NOT NULL,
  username VARCHAR (255) NOT NULL UNIQUE,
  password VARCHAR (255) NOT NULL
);
`;

async function main() {
  try {
    console.log("Seeding...");
    const client = new Client({
      connectionString: process.env.DB_URI,
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log("Done");
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

main();
