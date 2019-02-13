const express = require('express');
const path = require('path');
const http = require('http');
//const bodyParser = require('body-parser');

const {Client} = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:admin@localhost:5432/Radiant';

// Get our API routes
//const api = require('./server/routes/api');

const app = express();

// Parsers for POST data
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, '..', 'dist/myAngularProject')));

// Set our api routes
//app.use('/api', api);

app.get('/customerList', (req, res)=>{
  const client = new Client({
  connectionString: connectionString,
})
client.connect();
       client.query('SELECT DISTINCT cust_name FROM datatable', (err, result)=>{
         if(err)
         {
           console.log(err);
           res.status(400).send(err);
         }
         res.status(200).send(result.rows);
       });
});

app.get('/productList', (req, res)=>{
  const client = new Client({
  connectionString: connectionString,
})
client.connect();
       client.query('SELECT product_name FROM products', (err, result)=>{
         if(err)
         {
           console.log(err);
           res.status(400).send(err);
         }
         res.status(200).send(result.rows);
       });
});

app.get('/productInfo', (req, res)=>{
  const client = new Client({
  connectionString: connectionString,
})
client.connect();
       client.query('SELECT * FROM products', (err, result)=>{
         if(err)
         {
           console.log(err);
           res.status(400).send(err);
         }
         res.status(200).send(result.rows);
       });
});

app.get('/lastBill', (req, res)=>{
  const client = new Client({
  connectionString: connectionString,
})
client.connect();
       client.query('SELECT invoice_no FROM datatable ORDER BY invoice_no DESC LIMIT 1', (err, result)=>{
         if(err)
         {
           console.log(err);
           res.status(400).send(err);
         }
         res.status(200).send(result.rows);
       });
});


// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist/myAngularProject/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));
