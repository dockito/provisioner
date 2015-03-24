var rsvp = require('rsvp');
var proc = require('child_process');


var provisioner = module.exports = {};

/**
 * generates bash scripts based in docker-compose.yml files
 * @param  opts.appName
 * @param  opts.composeFile
 * @param  opts.dockerConnection
 */
provisioner.provision = function (opts) {
  var createTempFolder = function () {
    return exec('mktemp -d /tmp/dockito-deployer-' + opts.appName + '.XXXXXX')
      .then(function (servicesDirectory) {
        opts.servicesDirectory = servicesDirectory.replace(/\n$/, '');
      });
  };

  var execCompose2Bash = function () {
    return execFile('compose2bash',[
      '-app=' + opts.appName,
      '-yml=' + opts.composeFile,
      '-output=' + opts.servicesDirectory,
      '-docker-host=' + opts.dockerConnection
    ]);
  };

  var copyScriptsToOutputDirectory = function () {
    return exec('cp -r ' + opts.servicesDirectory + '/* /usr/src/app/output');
  };

  var getGeneratedScriptsName = function () {
    return exec('ls ' + opts.servicesDirectory).then(function (result) {
      return result.split(/\n/g).filter(function (name) { return !!name; });
    });
  };

  return createTempFolder()
    .then(execCompose2Bash)
    .then(copyScriptsToOutputDirectory)
    .then(getGeneratedScriptsName);
};


/*
 * helper functions
 */
function exec (cmd) {
  return rsvp.denodeify(proc.exec).call(proc, cmd);
}


function execFile (file, args) {
  return rsvp.denodeify(proc.execFile).call(proc, file, args);
}
