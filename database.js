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
      `);
   },
   insert: async (accident) => {
      let sql = `
         INSERT INTO accident(address, date, time, injured, dead)
         VALUES (
            '${accident.address}', 
            '${accident.date}', 
            '${accident.time}', 
            ${accident.injured}, 
            ${accident.dead})
           `;
      const result = await executeQuery(sql);
      accident.plates.forEach(async (element) => {
         sql = `
            INSERT INTO plates(plate, idAccident) 
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
      await Promise.all(result.map(async (accident) => {
         sql = ` 
            SELECT b.id, t.name type, b.date, b.hour, b.name
            FROM booking AS b
            JOIN type as t ON b.idType = t.id
            SELECT plate FROM plates WHERE idAccident=${accident.id} 
           `;
         const list = await executeQuery(sql);
         accident.plates = list.map(p => p.plate);
      }));
      return result;
   },
   drop: async () => {
      let sql = `
            DROP TABLE IF EXISTS plates
           `;
      await executeQuery(sql);
      sql = `
            DROP TABLE IF EXISTS accident
           `;
      await executeQuery(sql);
   }
}

module.exports = database;