const express = require('express');

const app = express();
const port = 8000;

app.get('/showData', (req, res) => {
    const data = require('./data.json');
    if (data && JSON.stringify(data) !== '{}') {
      console.log('data', data);
      res.send(data)
    }
})

app.listen(port, () => {
    console.log('Server is running...');
})