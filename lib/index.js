var path = require('path'),
    express = require('express'),
    multer  = require('multer'),
    shell = require('shelljs'),
    rsvp = require('rsvp'),
    _ = require('underscore');



var app = module.exports = express();


var provision = path.join(__dirname, '../bin/provision.sh');


app.use(multer({
  dest: '/tmp'
}));


app.post('/', function(req, res){
  if (process.env.ACCESS_TOKEN !== req.query['access-token']) {
    return res.sendStatus(401);
  }

  var files = _(req.files).map(function (file, fieldname) {
    var defered = rsvp.defer();
    var child = shell.exec(provision + ' ' + fieldname + ' ' + file.path, { async: true });

    child.stdout.on('data', function(data) {
      res.write('[' + fieldname + '] ' + data);
    });

    child.on('exit', function () {
      defered.resolve();
    });

    return defered.promise;
  });

  rsvp.all(files).then(function () {
    res.status('ok');
    res.end();
  }, function () {
    res.status(500);
    res.end();
  });
});


app.listen(3000);
