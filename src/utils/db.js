const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

function query (text, params)  {
  const start = Date.now()
  const res = await pool.query(text, params)
  const duration = Date.now() - start
  console.log('executed query', { text, duration, rows: res.rowCount })
  return res
}

function getClient()  {
  const client = await pool.connect()
  const cQuery = client.query
  const cRelease = client.release
  
  // set a timeout of 5 seconds, after which we will log this client's last query
  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!')
    console.error(`The last executed query on this client was: ${client.lastQuery}`)
  }, 5000)

  client.query = (...args) => {
    client.lastQuery = args
    return cQuery.apply(client, args)
  }
  client.release = () => {
    clearTimeout(timeout)

    client.query = cQuery
    client.release = cRelease
    return cRelease.apply(client)
  }
  return client

}

module.exports = {
  query,
  getClient
};
