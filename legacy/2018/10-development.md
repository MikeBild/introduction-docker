# Docker for Developers

## Rules of [12-factor-apps](https://12factor.net)

- You ship it - you run it
- Monitoring is the new Testing
- Don't repair - rebuild
- Automate work processes
- Test/Stage/Prod is always the same - create different versions
- Be immutable - create different versions
- Prefer a stateless (programming) model
- Support SIGTERM for graceful shutdowns
- Configuration via Environment-Vars
- Scaling, Logging, Tracing isn't your business

## 12-Factor-Apps

- Create and run small (Micro)services
- Prefer Async I/O (Communication, Data-Access, etc.)
- Prefer Stateless or use Data-Replication
- Use Environment-Variables to configure application parameters
- Using SIGTEM for graceful shutdowns
- Using StdOut/StdErr to log output
- Prefer using a Service-Discovery

### Using the Docker-API with NodeJS

```bash
npm i dockerode --save
```

```javascript
const Dockerode = require('dockerode');
const localDocker = new Dockerode('unix://var/run/docker.sock');
```

```bash
docker build -t docker-monitor .
docker run -v /var/run/docker.sock:/var/run/docker.sock --privileged docker-monitor
```

## Examples

- [NodeJS 12-Factor-App Example](examples/nodejs-api/README.md)
