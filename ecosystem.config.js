module.exports = {
    apps: [
      {
        name: 'itzurtrip',
        script: 'nodemon',
        args: 'App.js',
        interpreter: 'node',
        watch: true,
        env: {
          NODE_ENV: 'development'
        }
    
      }
    ]
  };
  