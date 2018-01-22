const { spawn: spawnProcess } = require("child_process");
const { join } = require("path");


(async () => {
    console.log("starting server...");

    const server = await createTestServer();

    console.log("server has been started");
    console.log("testing...");

    await runTests();

    server.kill();
})();


async function createTestServer() {
    return new Promise(resolve => {
        let server = spawn("webpack-dev-server");

        server.stdout.on("data", data => {
            if (/Compiled successfully/i.test(data.toString()))
                resolve(server);
        });

        server.stderr.on("data", data => {
            let message = data.toString();

            if (/\[BABEL\]/.test(message))
                return;

            let errorStartPosition = message.indexOf("ERROR");

            console.log("can't start server:");
            console.log(message.substring(errorStartPosition));

            process.exit(0);
        });
    });
}

async function runTests() {
    return new Promise(resolve => {
        let tests = spawn("jest", true);

        tests.on("close", resolve);
    });
}

function spawn(command, writable) {
    let options = {
        cwd: __dirname
    };

    if (writable)
        options.stdio = ["ignore", "inherit", "inherit"];

    return spawnProcess("node", [`${join(__dirname, "..")}/node_modules/.bin/${command}`], options);
}
