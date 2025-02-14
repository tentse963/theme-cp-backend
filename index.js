const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');

// const { logReqRes } = require('./middlewares/log');
const apiRouter = require('./routes/api');

const app = express();
const port = process.env.PORT || 5000;

app.set('view engine', 'ejs');

app.use(cookieParser());

// app.use(logReqRes('log.txt'));

app.use(cors({
  origin: '*',  // Allow all origins
}));

app.use(express.json());

// Api Routes
app.use("/api", apiRouter);


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
