const express = require('express');
const router = express.Router();
const pgp = require("pg-promise")(/*options*/);
const db = pgp("postgres://abttqpkzhupxgl:82a518aa850c1c993bed4b26d34573720194fd3e622af579d1ad9cdca98bde30@ec2-3-211-6-217.compute-1.amazonaws.com:5432/dbefpu159nrtbj");

// Login user.
router.post('/login', async function(req, res, next) {
  db.any("SELECT * FROM ajedrez.users WHERE username = $1", req.body.username)
    .then(function (data) {
      console.log("user:", data);
      if (!data.length) { // If the username was not found.
        res.send({
          success: false,
          content: null,
          message: 'Usuario no encontrado.'
        });
      }else if (req.body.password != data[0].password) { // If the username was found but the password is incorrect.
        res.send({
          success: false,
          content: null,
          message: 'Contraseña incorrecta.'
        });
      } else { // If the username was found and also the password is correct.
        res.send({
          success: true,
          content: data,
          message: '¡Logueado exitosamente!'
        });
      }
    })
    .catch(function (error) {
        console.log("ERROR:", error);
        res.send({
          success: false,
          content: null,
          message: 'Ocurrió un error.'
        });
    });
});

// Signup user.
router.post('/signup', async function(req, res, next) {
  db.any("INSERT INTO ajedrez.users(name, level, type, username, password) VALUES ($1, $2, $3, $4, $5)", [req.body.name, req.body.userLevel, req.body.userType, req.body.username, req.body.password])
    .then(function (data) {
        console.log("user:", data);
        res.send(data);
    })
    .catch(function (error) {
        console.log("ERROR:", error);
        res.send({
          success: false,
          content: null,
          message: 'Ocurrió un error.'
        });
    });
});

// Delete user.
router.delete('/users/delete', async function(req, res, next) {
  await db.any("DELETE FROM ajedrez.users WHERE id = $1", [req.body.idUser]);
  res.send({
    success: true,
    content: null,
    message: '¡Usuario eliminado exitosamente!'
  });
});

// Get users.
router.post('/users', async function(req, res, next) {
  res.send(await db.query("SELECT * FROM ajedrez.users WHERE id <> $1", [req.body.idUser]));
});

// Get challenge by user.
router.post('/challenges', async function(req, res, next) {
  res.send(await db.query("select c.id, c.challenge_date, c.is_played, c.winner_name, u1.name as user1_name, u1.id as user1_id, u2.name as user2_name, u2.id as user2_id from ajedrez.challenges c inner join ajedrez.users u1 on u1.id = c.user_id1 inner join ajedrez.users u2 on u2.id = c.user_id2 where c.user_id1 = $1 OR c.user_id2 = $1 order by c.challenge_date asc", [req.body.idUser]));
});

// Challenge playing.
router.put('/challenge-playing', async function(req, res, next) {
  await db.query("UPDATE ajedrez.challenges SET is_played = true WHERE id = $1", [req.body.challengeId]);
  res.send({
    success: true,
    content: null,
    message: 'Partido en progreso...'
  });
});

// Choosing the winner of the match.
router.put('/challenge-winner', async function(req, res, next) {
  await db.query("UPDATE ajedrez.challenges SET winner_name = $1 WHERE id = $2", [req.body.winnerName, req.body.challengeId]);
  res.send({
    success: true,
    content: null,
    message: 'Ganador guardado.'
  });
});

// Choosing the winner of the match.
router.put('/user-edit', async function(req, res, next) {
  await db.query("UPDATE ajedrez.users SET name = $1, level = $2, type = $3, username = $4 WHERE id = $5", [req.body.userName, req.body.userLevel, req.body.userType, req.body.userUsername, req.body.userId]);
  res.send({
    success: true,
    content: null,
    message: 'Usuario editado.'
  });
});

// Challenge users.
router.post('/challenge-user', async function(req, res, next) {
  db.any("INSERT INTO ajedrez.challenges(user_id1, user_id2, challenge_date) VALUES ($1, $2, $3)", [req.body.idUserChallenger, req.body.idUserOponent, req.body.challengeDate])
    .then(function (data) {
        console.log("data:", data);
        res.send({
          success: true,
          content: null,
          message: '¡Jugador desafiado exitosamente!'
        });
    })
    .catch(function (error) {
        console.log("ERROR:", error);
        res.send({
          success: false,
          content: null,
          message: 'Ocurrió un error.'
        });
    });
});

module.exports = router;
