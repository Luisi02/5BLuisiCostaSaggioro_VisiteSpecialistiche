const fs = require('fs');
const mysql = require('mysql2');
const conf = JSON.parse(fs.readFileSync('./public/conf.json'));
conf.ssl = {
   ca: fs.readFileSync(__dirname + '/ca.pem')
}
const connection = mysql.createConnection(conf);

const executeQuery = (sql) => {
   return new Promise((resolve, reject) => {
      connection.query(sql, function (err, result) {
         if (err) {
            console.error(err);
            reject();
         }
         console.log('done');
         resolve(result);
      });
   })
}

const database = {
   createTable: async () => {
      await executeQuery(`
         CREATE TABLE IF NOT EXISTS type (
         id INT PRIMARY KEY AUTO_INCREMENT,
         name varchar(20)
         )             
      `);
      return await executeQuery(`
         CREATE TABLE IF NOT EXISTS booking (
         id int PRIMARY KEY AUTO_INCREMENT,
         idType int NOT NULL,
         date DATE NOT NULL,
         hour INT NOT NULL,
         name VARCHAR(50),
         FOREIGN KEY (idType) REFERENCES type(id)
         )  
      `);
   },
   insert: async (booking) => {
      let sql = `
         INSERT INTO booking(date, hour, name)
         VALUES (
            '${booking.date}', 
            '${booking.hour}', 
            ${booking.name}
           `;
      const result = await executeQuery(sql);
      booking.type.forEach(async (element) => {
         sql = `
            INSERT INTO type(id, name) 
            VALUES (
               '${element}', 
               ${result.insertId})
         `;
         await executeQuery(sql);
      });
   },
   select: async () => {
      let sql = `
        SELECT name FROM type 
           `;
      const result = await executeQuery(sql);
      await Promise.all(result.map(async (booking) => {
         sql = ` 
            SELECT b.id, t.name type, b.date, b.hour, b.name
            FROM booking AS b
            JOIN type as t ON b.idType = t.id
            WHERE date='aaaa-mm-gg'
           `;
         const list = await executeQuery(sql);
         booking.type = list.map(p => p.plate);
      }));
      return result;
   },
   drop: async () => {
      let sql = `
            DROP TABLE IF EXISTS type
           `;
      await executeQuery(sql);
      sql = `
            DROP TABLE IF EXISTS booking
           `;
      await executeQuery(sql);
   }
}

module.exports = database;