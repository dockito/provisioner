var express = require('express'),
    multer  = require('multer'),
    rsvp = require('rsvp'),
    _ = require('underscore'),
    provisioner = require('./provisioner');



var app = module.exports = express();


app.use(multer({ dest: '/tmp' }));


app.use(function (req, res, next) {
  if (process.env.ACCESS_TOKEN !== req.query['access-token']) {
    return res.sendStatus(401);
  }
  next();
});


app.post('/', function(req, res){
  var files = _(req.files).map(function (file, fieldname) {
    return provisioner.provision({
      appName: fieldname,
      composeFile: file.path,
      dockerConnection: process.env.DOCKER_CONNECTION,
      enableInteractiveBash: process.env.ENABLE_INTERACTIVE_BASH === 'true'
    });
  });

  rsvp.all(files).then(function (generatedScriptsName) {
    res.status(201);
    res.send(_.flatten(generatedScriptsName).join('\n'));
  }, function (err) {
    res.status(500);
    res.send(err.message || err);
  });
});


app.listen(3000);
