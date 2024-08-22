const { exec } = require('child_process');

function buildNextApp() {
  exec('next build', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error during build: ${error.message}`);
      console.warn('Continuing despite the error...');
      // You can add any additional logic here if you want to handle errors differently
    }
    if (stderr) {
      console.error(`Standard error: ${stderr}`);
    }
    console.log(`Build output: ${stdout}`);
  });
}

buildNextApp();