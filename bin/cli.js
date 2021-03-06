#!/usr/bin/env node

var commander = require('commander');
var path = require('path');
var fs = require('fs');
var engines = require('../lib').engines;
var pkg = require(path.resolve(__dirname, '../package.json'));

commander
    .version(pkg.version)
    .description('precompile templates into functions, built for high performance')
    .option('-e, --engine <engine>', 'choose a template engine, default value is "zero"')
    .option('-f, --format <format>', 'the result module format, default is "umd"')
    .option('-c, --config <config>', 'config file (js or json file)')
    .arguments('<source>')
    .action(function (source) {
        if (!source) {
            throw new Error('Please specify a template file!')
        }
        var engine = commander.engine || 'zero';
        var moduleFormat = commander.format || 'umd';
        var config = null;
        if (!engines[engine]) {
            throw new Error('Engine is not available: ' + engine);
        }
        if (commander.config) {
            config = require(path.resolve(process.cwd(), commander.config));
        }
        fs.readFile(source, {
            encoding: 'utf8'
        }, function (err, data) {
            if (err) {
                throw err;
            } else {
                var resultFunc = engines[engine].render(
                    data, // origin template string
                    path.basename(source, path.extname(source)), // module name
                    moduleFormat, // module format
                    source, // pathname
                    config // config
                );
                console.log(resultFunc);
                process.exit(0); // animaはおかしいだ
            }
        });
    });

commander.parse(process.argv);

if (process.argv.length === 2) {
    commander.outputHelp();
}
