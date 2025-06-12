const userRouter = require('./user/auth');
const pageRouter = require('./pages/page');

function Routes(app){
  app.use('/', pageRouter);
  app.use('/user', userRouter);
  app.use('/admin', userRouter);
}

module.exports = Routes;
