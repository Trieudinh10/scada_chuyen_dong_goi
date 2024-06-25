const dotenv = require('dotenv');

//.ENV
dotenv.config();

const mysql = require('mysql2/promise');
// // create the connection to database
// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE
//   });

// So sánh dữ liệu giữa hai bảng
const query = `
SELECT t1.*
FROM table1 t1
LEFT JOIN table2 t2 ON t1.id = t2.id
WHERE t2.id IS NULL
UNION ALL
SELECT t2.*
FROM table2 t2
LEFT JOIN table1 t1 ON t2.id = t1.id
WHERE t1.id IS NULL;
`;

  // create the connection to database
const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

  module.exports = connection;