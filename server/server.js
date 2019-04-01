const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const converter = require('number-to-words');

const {Client} = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:admin@localhost:5432/Radiant';
const client = new Client({
connectionString: connectionString,
});
client.connect();

// Get our API routes
//const api = require('./server/routes/api');

const app = express();

// Parsers for POST data
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, '..', 'dist/myAngularProject')));

// Set our api routes
//app.use('/api', api);

app.get('/customerList', (req, res)=>{
       client.query('SELECT DISTINCT cust_name FROM customers', (err, result)=>{
         if(err)
         {
           console.log(err);
           res.status(400).send(err);
         }
         res.status(200).send(result.rows);
       });
});

app.get('/productList', (req, res)=>{
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
       client.query('SELECT invoice_no FROM datatable ORDER BY invoice_no DESC LIMIT 1', (err, result)=>{
         if(err)
         {
           console.log(err);
           res.status(400).send(err);
         }
         res.status(200).send(result.rows);
       });
});

app.post('/insertCustomer', (req, res)=>{console.log(req.body);
let queryString = `INSERT INTO customers (cust_name,address,gst_no,telephone,email,contact_name,state) VALUES('${req.body.customerName}', '${req.body.address}', '${req.body.gstNo}', '${req.body.contactNo}', '${req.body.email}', '${req.body.contactPerson}', ${req.body.state});`;
console.log(queryString);
       client.query(queryString, (err, result)=>{
         if(err)
         {
           console.log(err);
           res.status(400).send(err);
         }
         res.status(200).send({"message": "success"});
       });
});

app.post('/insertProduct', (req, res)=>{
let queryString = `INSERT INTO products (product_name,rate,hsn) VALUES('${req.body.productName}', '${req.body.rate}', '${req.body.hsn}');`;
       client.query(queryString, (err, result)=>{
         if(err)
         {
           console.log(err);
           res.status(400).send(err);
         }
         res.status(200).send({"message": "success"});
       });
});

app.post('/invoiceInfo', (req, res)=>{
let queryString = `SELECT * FROM datatable WHERE invoice_no = ${req.body.invoiceNo};`;
       client.query(queryString, (err, result)=>{
         if(err)
         {
           console.log(err);
           res.status(400).send(err);
         }
         res.status(200).send(result.rows);
       });
});

app.post('/getCustomer', (req, res)=>{
let queryString = `SELECT * FROM customers WHERE cust_name = '${req.body.customerName}';`;
       client.query(queryString, (err, result)=>{
         if(err)
         {
           console.log(err);
           res.status(400).send(err);
         }
         res.status(200).send(result.rows);
       });
});

app.post('/productHSN', (req, res)=>{
let queryString = `SELECT hsn FROM products WHERE product_name = '${req.body.productName}';`;
       client.query(queryString, (err, result)=>{
         if(err)
         {
           console.log(err);
           res.status(400).send(err);
         }
         res.status(200).send(result.rows);
       });
});

app.post('/billAmt', (req, res)=>{
let queryString = `SELECT SUM(bill_value) FROM datatable WHERE invoice_no = ${req.body.invoiceNo} GROUP BY invoice_no;`;
       client.query(queryString, (err, result)=>{
         if(err)
         {
           console.log(err);
           res.status(400).send(err);
         }
         res.status(200).send(result.rows);
       });
});

app.post('/insertInvoice', (req, res)=>{
let count = 97;
for(let i=0; i<15;i++)
{
  if(req.body.products[i].childForm)
  {console.log(req.body);
    let orderno = req.body.invoiceNo + String.fromCharCode(count);
    let iDate = new Date(req.body.invoiceDate);
    let day = iDate.getDate();
    let month = iDate.getMonth()+1;
    let year = iDate.getFullYear();
    let invoiceDate = `${day}-${month}-${year}`;
    let pDate = new Date(req.body.poDate);
    day = pDate.getDate();
    month = pDate.getMonth()+1;
    year = pDate.getFullYear();
    let poDate = `${day}-${month}-${year}`;
    let queryString = `INSERT INTO datatable (invoice_no,invoice_date,cust_name,order_no,po_no,po_date,eway_no,product_des,qty,mrp,unit_price,t_value,tax_rate,tax_value,bill_value,payment_type) VALUES (${req.body.invoiceNo}, to_date('${invoiceDate}', 'DD/MM/YYYY'), '${req.body.customerName.cust_name}', '${orderno}', '${req.body.poNo}', to_date('${poDate}', 'DD/MM/YYYY'), '${req.body.ewayNo}', '${req.body.products[i].childForm.product_name}', ${req.body.products[i].qty}, ${req.body.products[i].mrp}, ${req.body.products[i].rate}, ${req.body.products[i].value}, ${req.body.products[i].taxRate}, ${req.body.products[i].taxAmt}, ${req.body.products[i].gross}, '${req.body.paymentMode}');`;
    console.log(queryString);
    client.query(queryString, (err, result)=>{
      if(err)
      {
        console.log(err);
        res.status(400).send(err);
        return;
      }
    });
    count++;
  }
}
res.status(200).send({"message": "success"});
});

app.post('/editInvoice', (req, res)=>{
let delString = `DELETE FROM datatable WHERE invoice_no = ${req.body.billNo};`;
       client.query(delString, (err, result)=>{
       });
let count = 97;
for(let i=0; i<15;i++)
{
  if(req.body.products[i].childForm)
  {
    let orderno = req.body.billNo + String.fromCharCode(count);
    let iDate = new Date(req.body.invoiceDate);
    let day = iDate.getDate();
    let month = iDate.getMonth()+1;
    let year = iDate.getFullYear();
    let invoiceDate = `${day}-${month}-${year}`;
    let pDate = new Date(req.body.poDate);
    day = pDate.getDate();
    month = pDate.getMonth()+1;
    year = pDate.getFullYear();
    let poDate = `${day}-${month}-${year}`;
    let queryString = `INSERT INTO datatable (invoice_no,invoice_date,cust_name,order_no,po_no,po_date,eway_no,product_des,qty,mrp,unit_price,t_value,tax_rate,tax_value,bill_value,payment_type) VALUES (${req.body.billNo}, to_date('${invoiceDate}', 'DD/MM/YYYY'), '${req.body.customerName.cust_name}', '${orderno}', '${req.body.poNo}', to_date('${poDate}', 'DD/MM/YYYY'), '${req.body.ewayNo}', '${req.body.products[i].childForm.product_name}', ${req.body.products[i].qty}, ${req.body.products[i].mrp}, ${req.body.products[i].rate}, ${req.body.products[i].value}, ${req.body.products[i].taxRate}, ${req.body.products[i].taxAmt}, ${req.body.products[i].gross}, '${req.body.paymentMode}');`;
    console.log(queryString);
    client.query(queryString, (err, result)=>{
      if(err)
      {
        console.log(err);
        res.status(400).send(err);
        return;
      }
    });
    count++;
  }
}
res.status(200).send({"message": "success"});
});

app.delete('/deleteInvoice/:invoiceNo', (req, res)=>{
let queryString = `DELETE FROM datatable WHERE invoice_no = ${req.params.invoiceNo};`;
       client.query(queryString, (err, result)=>{
         if(err)
         {
           console.log(err);
           res.status(400).send(err);
         }
         res.status(200).send({"message": "success"});
       });
});

app.post('/inWords', (req, res)=>{
  res.send({"amt": converter.toWords(req.body.amt)});
});

app.post('/getReports', (req, res)=>{
    let fDate = new Date(req.body.fromDate);
    let day = fDate.getDate();
    let month = fDate.getMonth()+1;
    let year = fDate.getFullYear();
    let fromDate = `${day}-${month}-${year}`;
    let tDate = new Date(req.body.toDate);
    day = tDate.getDate();
    month = tDate.getMonth()+1;
    year = tDate.getFullYear();
    let toDate = `${day}-${month}-${year}`;
    let queryString = `SELECT * FROM datatable WHERE invoice_date BETWEEN to_date('${fromDate}', 'DD/MM/YYYY') AND to_date('${toDate}', 'DD/MM/YYYY');`;
    console.log(queryString);
    client.query(queryString, (err, result)=>{
      if(err)
      {
        console.log(err);
        res.status(400).send(err);
        return;
      }
      res.status(200).send(result.rows);
    });
});

app.post('/getUniqueDates', (req, res)=>{
    let fDate = new Date(req.body.fromDate);
    let day = fDate.getDate();
    let month = fDate.getMonth()+1;
    let year = fDate.getFullYear();
    let fromDate = `${day}-${month}-${year}`;
    let tDate = new Date(req.body.toDate);
    day = tDate.getDate();
    month = tDate.getMonth()+1;
    year = tDate.getFullYear();
    let toDate = `${day}-${month}-${year}`;
    let queryString = `SELECT DISTINCT invoice_no FROM datatable WHERE invoice_date BETWEEN to_date('${fromDate}', 'DD/MM/YYYY') AND to_date('${toDate}', 'DD/MM/YYYY');`;
    console.log(queryString);
    client.query(queryString, (err, result)=>{
      if(err)
      {
        console.log(err);
        res.status(400).send(err);
        return;
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
