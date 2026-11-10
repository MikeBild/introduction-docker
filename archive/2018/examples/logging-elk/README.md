# Central Logging with ELK

__Docker-Machine Setup__

```bash
docker-machine create -d virtualbox --virtualbox-memory 2048 elk
docker-machine env elk
eval $(docker-machine env elk)
```

__ElasticSearch__
```bash
docker run -d -p 9200:9200 -p 9300:9300 --name elasticsearch elasticsearch
```

__LogStash__
```bash
docker run -d -p 12345:12345/udp -p 12345:12345/tcp --link elasticsearch --name logstash logstash logstash -e 'input { syslog { port => 12345 type => "docker" } } output { elasticsearch { hosts => "192.168.99.102" } }'
```

__LogSpout__ (HOST-N+1)
```bash
docker run -d -v /var/run/docker.sock:/var/run/docker.sock --name logspout gliderlabs/logspout syslog://192.168.99.102:12345
```

__Web-Demo__
```bash
docker run -d -p 8080:80 --name webdemo dockercloud/hello-world
```

__Kibana__
```bash
docker run -d -p 5601:5601 -e ELASTICSEARCH_URL=http://$(docker-machine ip elk):9200 --name kibana kibana
open "http://$(docker-machine ip elk):5601"
```

## Multiple Hosts

__LogSpout__ (HOST-N+1)
```bash
docker run -d -v /var/run/docker.sock:/var/run/docker.sock --name logspout gliderlabs/logspout syslog://192.168.99.102:12345
```

## How to Log with Docker

* Only use StdOut/StdErr

