sudo docker run --name some-rethink -v "$PWD:/data" -d -p 8080:8080 -p 28015:28015 -p 29015:29015 rethinkdb
