const app = require('./app.js');

const port = process.env.PORT || 3000;

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});

app.listen(port, () => {
    console.log('Server listening at http://localhost:' + port);
});