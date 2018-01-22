const { emptyDirSync: cleanDir, copySync: copyFile } = require("fs-extra");
const glob = require("glob");
const { spawnSync } = require("child_process");
const { basename } = require("path");


cleanDir("./lib");

let jsFiles = glob.sync("./source/**/*.js");

jsFiles.forEach(path => {
    let filename = basename(path);

    executeCommand(`
        node ./node_modules/.bin/babel
            ${path}
            --out-file ./lib/${filename}
            --source-maps true
            --source-map-target file
            --source-file-name ${filename}.map
    `);
});

let cssFiles = glob.sync("./source/**/*.css");

cssFiles.forEach(path => copyFile(path, `./lib/${basename(path)}`));


function executeCommand(command) {
    let args = command.split(/\s+/).filter(source => source);

    command = args.shift();

    let result = spawnSync(command, args, {
        cwd: process.cwd()
    });

    if (result.status != 0) {
        if (Array.isArray(result.output)) {
            result.output.forEach(source => source && console.log(source.toString()));
        }
    }
}
