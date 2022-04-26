module.exports = {
    apps: [
      {
        name: 'BACK-SCHOOL',
        script: 'sever.js',
        instances : 2,
        watch: false,
        force: true,
        env: {
          PORT: 7000,
          NODE_ENV: 'production',
          MY_ENV_VAR: 'MyVarValue',
        },
      },
    ],
  };