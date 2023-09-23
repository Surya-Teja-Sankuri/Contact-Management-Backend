const express = require("express");
const cors = require("cors");
const router = require("./routes/contactRoutes");
const errorHandler = require("./middleware/errorHandling");
const connectionDb = require("./connectionDb/connectDb");
const userRouter = require("./routes/userRoutes");
const corsOptions = require("./configs/corsOptions");
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
require("dotenv").config();

connectionDb();
const app = express();

const port = process.env.PORT;

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser());

app.use("/", userRouter);
app.use('/refresh', require('./routes/refresh'))
app.use('/logout', require('./routes/logout'))
app.use("/contacts", router);

app.use(errorHandler);
app.use('/*', (req, res) => {
  res.status(404).send('Page not found')
})

mongoose.connection.once('open', () => {
  console.log('connected to mongoDB.');
  app.listen(port, () => { console.log(`Server is running on port ${port}`); });
})
