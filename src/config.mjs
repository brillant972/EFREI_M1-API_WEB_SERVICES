export default {
  development: {
    type: 'development',
    port: 3000,
    mongodb: 'mongodb+srv://<username>:<db_password>@<cluster-address>/api'
  },
  production: {
    type: 'production',
    port: 3000,
    mongodb: 'mongodb+srv://<username>:<db_password>@<cluster-address>/api'
  }
};
