const userRouter = require('./auth');
const pageRouter = require('./page');
const serverRouter = require('./server');
const messageRouter = require('./message');

function Routes(app){
  app.use('/', pageRouter);
  app.use('/user', userRouter);
  app.use('/admin', userRouter);
  app.use('/server', serverRouter);
  app.use('/api/messages', messageRouter);
}

module.exports = Routes;
