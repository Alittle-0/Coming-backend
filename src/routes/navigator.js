const userRouter = require('./auth');
const pageRouter = require('./page');
const serverRouter = require('./server');

function Routes(app){
  app.use('/', pageRouter);
  app.use('/user', userRouter);
  app.use('/admin', userRouter);
  app.use('/server', serverRouter);
}

module.exports = Routes;
