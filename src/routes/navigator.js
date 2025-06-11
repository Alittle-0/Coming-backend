const userRouter = require('./user/auth');
const pageRouter = require('./pages/page');

function Routes(app){
  app.use('/', pageRouter);
  app.use('/user', userRouter);
}

module.exports = Routes;
