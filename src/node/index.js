const express = require('express')
const mysql = require('mysql-await')
const { uniqueNamesGenerator, names } = require('unique-names-generator');

const app = express()
const port = 3000
const config = {
  host: 'db',
  user: 'root',
  password: 'root',
  database: 'nodedb'
}

const connection = mysql.createConnection(config)

const sqlCreateTable = `CREATE TABLE IF NOT EXISTS people(ID INT NOT NULL AUTO_INCREMENT, NAME varchar(255) NOT NULL, PRIMARY KEY(id))`

connection.query(sqlCreateTable)

app.get('/', async (req, res) => {
  const randomName = uniqueNamesGenerator({ dictionaries: [names] })
  
  await connection.awaitQuery(`INSERT INTO people(name) values ('${randomName}')`)  

  let results = await connection.awaitQuery('SELECT name FROM people');
  
  let message = `<h1>Full Cycle</h1>  
                  <h3>Lista de nomes cadastrada no banco de dados: </h3>`
  results.forEach(row => {
    message += `\n<p> - ${row.name}</p>`
  })
  res.send(message)
})

app.listen(port, () => {
  console.log(`Rodando na porta ${port}`)
})

process.on('exit', function() {
  connection.end()
})  