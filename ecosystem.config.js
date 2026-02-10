module.exports = {
  apps: [{
    name: 'habit-tracker',
    cwd: './server',
    script: 'dist/index.js',
    env: {
      NODE_ENV: 'production',
      PORT: 4000,
    },
  }],
};
