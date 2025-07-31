const userRouter = require('./user/auth');
const pageRouter = require('./pages/page');
const serverRouter = require('./server/server');

function Routes(app){
  app.use('/', pageRouter);
  app.use('/user', userRouter);
  app.use('/admin', userRouter);
  app.use('/server', serverRouter);
}

module.exports = Routes;
