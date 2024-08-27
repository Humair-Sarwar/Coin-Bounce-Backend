const express = require('express');
const { PORT, REACT_URL } = require('./config');
const { dbConnection } = require('./database');
const { router } = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const corsOptions = {
    credentials: true,
    origin: [REACT_URL]
}
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json({limit: '50mb'}));
app.use(router);
dbConnection();
app.use('/storage', express.static('storage'));
app.use(errorHandler);
app.listen(PORT, ()=>console.log(`Server is started on this Port: ${PORT}`));