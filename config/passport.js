const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const pool = require("../db/pool");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const { rows } = await pool.query(
          `
        SELECT id, firstname, lastname, username, password FROM users
        WHERE username = $1;
        `,
          [username],
        );
        const user = rows[0];
        if (!user) {
          return done(null, false, { message: "Invalid username or password" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Invalid username or password" });
        }

        const { password: _, ...userSafe } = user;
        return done(null, userSafe);
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const { rows } = await pool.query(
        `
      SELECT id, firstname, lastname, username FROM users
      WHERE id = $1
      `,
        [id],
      );

      done(null, rows[0] || null);
    } catch (error) {
      done(error);
    }
  });
};
