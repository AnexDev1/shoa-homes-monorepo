module.exports = {
  apps: [
    {
      name: 'shoa-backend',
      cwd: __dirname,
      script: 'npm',
      args: 'run start',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
    },
  ],
};
