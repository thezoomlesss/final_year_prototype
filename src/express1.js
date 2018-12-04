const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('A Mushy approaches!');
});

app.listen(3001, () => console.log('Mushy app listening on port 3001!'));