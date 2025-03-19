import api from './api.js';

const constructorMethod = (app) => {
  app.use('/api', api);
  app.use('*', (req, res) => {
    return res.status(404).json({error: "URL not found"});
  });
};

export default constructorMethod;
