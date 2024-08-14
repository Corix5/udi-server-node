import mysql from "mysql2";
//const bcrypt = require('bcryptjs');

const pool = mysql.createPool({
  host: 'database-1.c30e4wmm0g2y.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: 'udi-root',
  database: 'udi'
});


// const createAdminUser = async () => {
//   const username = 'admin';
//   const plainPassword = 'escom_2024';
//   const hashedPassword = await bcrypt.hash(plainPassword, 10);

//   const query = 'INSERT INTO admins (username, password) VALUES (?, ?)';

//   pool.query(query, [username, hashedPassword], (err) => {
//     if (err) throw err;
//     console.log('Admin user created with hashed password');
//     pool.end();
//   });
// };

//createAdminUser();

module.exports = pool.promise();