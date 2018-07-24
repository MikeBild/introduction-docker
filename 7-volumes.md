# Volumnes

- Volumes are easier to back up or migrate than bind mounts
- You can manage volumes using Docker CLI commands or the Docker API
- Volumes work on both Linux and Windows containers
- Volumes can be more safely shared among multiple containers
- Volume drivers let you store volumes on remote hosts or cloud providers, to encrypt the contents of volumes, or to add other functionality
- New volumes can have their content pre-populated by a container

- [Run with volumne](#run-with-volumne)
- [Delete dangling volumes](#delete-dangling-volumes)

## Run with volume

- The volume is **linked** inside the container. Any external changes are visible directly inside the container.
- This example breaks the immutability of the container, good for debuging, not recommended for production (Volumes should be used for data, not code)

- [Example](examples/html)

```bash
docker run -d -p 4000:80 -v $(pwd)/examples/html/:/usr/share/nginx/html:ro nginx
open http://192.168.99.102:4000
```

- **-v**: Bind mount a volume (e.g., from the host: -v /host:/container, from docker: -v /container)

## Delete dangling volumes

```bash
docker volume rm $(docker volume ls -q -f dangling=true)
```
