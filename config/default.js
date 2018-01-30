module.exports = {
  // secret data can be moved to env variables
  // or a separate config
  secret: 'mysecret',
  root: process.cwd(),
  port: process.env.PORT || 3000
};
