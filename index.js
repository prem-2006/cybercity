const { spawn } = require('child_process');
const path = require('path');

const agentDir = path.join(__dirname, 'DeFAIAgent');

console.log('--- DeFAI Agent Watcher ---');
console.log('Running tests in:', agentDir);

const cmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const args = ['test'];



const child = spawn(cmd, args, {
    cwd: agentDir,
    stdio: 'inherit',
    shell: true
});

child.on('close', (code) => {
    if (code !== 0) {
        console.log(`Tests failed with exit code ${code}`);
    } else {
        console.log('Tests passed!');
    }
});

const cleanup = () => {
    if (child && !child.killed) {
        child.kill('SIGINT');
    }
    process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', () => {
    if (child && !child.killed) {
        child.kill();
    }
});
