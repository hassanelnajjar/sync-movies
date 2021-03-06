const express = require('express');
const { join } = require('path');

const app = express();

app.use(express.static('client'));
app.all('*', (req, res) => {
  res.sendFile(join(__dirname, 'client', 'index.html'));
});

// enabling access control origin
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With, Content-Type, Accept',
  );
  next();
});

module.exports = app;
