const { spawn } = require('child_process');
const path = require('path');

const agentDir = path.join(__dirname, 'DeFAIAgent');

console.log('--- DeFAI Agent Watcher ---');
console.log('Running tests in:', agentDir);

let isRunning = true;

const child = spawn('npm test', {
    cwd: agentDir,
    stdio: 'inherit',
    shell: true
});

child.on('close', (code) => {
    isRunning = false;
    if (code !== 0) {
        console.log(`Tests failed with exit code ${code}`);
        process.exitCode = 1; // Propagate failure
    } else {
        console.log('Tests passed!');
    }
});

const cleanup = () => {
    if (isRunning && child) {
        child.kill();
    }
    process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', () => {
    if (isRunning && child) {
        child.kill();
    }
});
