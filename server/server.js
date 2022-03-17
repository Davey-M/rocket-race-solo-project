const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

// get the socket io dependencies
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();

// set up a server that is compatible with socket.io
const httpServer = createServer(app);

// initialize the socket instance
const io = new Server(httpServer);
const socketHandler = require('./modules/socket.handler');

io.on('connection', (socket) => {
  socketHandler(socket, io);
})

const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');

// Route includes
const userRouter = require('./routes/user.router');
const profileRouter = require('./routes/profile.router');

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport Session Configuration //
app.use(sessionMiddleware);

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

/* Routes */
app.use('/api/user', userRouter);
app.use('/api/profile', profileRouter);

// Serve static files
app.use(express.static('build'));

// App Set //
const PORT = process.env.PORT || 5000;

/** Listen * */
// app.listen(PORT, () => {
//   console.log(`Listening on port: ${PORT}`);
// });
httpServer.listen(PORT);
