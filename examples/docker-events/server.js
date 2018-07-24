const Dockerode = require('dockerode');
const localDocker = new Dockerode({socketPath: '/var/run/docker.sock'});

localDocker.getEvents({}, (err, stream) => {
  if(err) return console.error(err);
  stream.on('data', data => {
    console.log(data.toString());
  });
});

