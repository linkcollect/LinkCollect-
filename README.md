# LinkCollect Backend

This repository contains the setup for the LinkCollect backend using TypeScript and Docker for development. Utilizing Docker makes the development process more straightforward. You can create a Docker image and test the database and backend effortlessly by running the commands provided in the makefile. The setup will generate a "mongo" folder in your repository. After signing up, you can test your endpoints.

For development purposes, creating an Nginx image is optional. The Nginx image acts as a proxy to our backend port, facilitating smoother interactions.

## Makefile Commands

To simplify the development process, we have included the following makefile commands:

- `build`: Builds the Docker containers using `docker-compose build`.
- `up`: Sets up the development environment, runs the backend using TypeScript, and creates a MongoDB container. Use `make up` to start the development environment. Use `make down` to stop the containers and `make rmi` to remove the Docker images.
- `up-prod`: Starts the production environment using `docker-compose.yml` and `docker-compose.prod.yml`.
- `down`: Stops the running containers using `docker-compose down`.
- `run`: Runs the backend using TypeScript and `ts-node`.
- `createnetwork`: Creates a Docker network with the name "example-net".
- `rmi`: Removes Docker images related to LinkCollect using `docker rmi`.
- `rmiall`: Removes all Docker images from the system.

Please use these commands to streamline your development and testing process.



Some Docs
----------------------------


Backup and Restore MongoDB data from container to Atlas
===

The data hosted on the *server* is not connected to Atlas and it runs on a local mongo process.  
Hence to *backup / restore* do the following procedures  

1\. Create Dump on Container
---

The container hosts the database on a local mongo instance. It contains all the data of the live database. Hence it has to be backed up by creating a dump using the `mongodump` command.

Run the following command:

```powershell
mongodump --out ./dump
```

You have to provide a path to the dump directory (can be either absolute or relative).

2\. Copy the dump files to Local machine
---

Go to the local machine in which the docker container is running. And run the following command to find all the running containers.

```powershell
docker ps
```

This will list all the process ID's. Copy your Mongo container's process ID  

Then run the docker copy command

```powershell
docker cp <container-id>:<docker-dump-path> <local-save-path>
```

Example:  
`docker cp 4296ea858046:/dump ./dump`

This command will copy the dump folder from your Docker container to your local machine.

3\. Restore files to Atlas account
---

This can be done either on *Docker* or on *local machine* but it can only be done if the dump files created in the previous step exists.  
If you are doing this on a *local machine* you will be needing a tool __mongoDB database tools__.

Use command `mongorestore` to add the dump files to Atlas account

```powershell
mongorestore --uri "mongodb+srv://<username>:<password>@clustername.mongodb.net/<database>" --drop /path/to/dump/directory
```

- *\<username\>*: Your MongoDB Atlas username.
- *\<password\>*: Your MongoDB Atlas password.
- *\<clustername\>*: The name of your MongoDB Atlas cluster.
- *\<database\>*: The name of the database where you want to import the data.
- */path/to/dump/directory*: The local path to the dump directory you copied from the Docker container in Step 2.

The `--drop` option is used to drop the existing data in the target database in MongoDB Atlas before importing the data from the dump directory. Be cautious when using this option as it will replace any existing data in the target database.  

4\. Send data from Atlas to Docker container
---

It is not much different from the steps above. You just use the URI option to refer to the Atlas cluster wherever needed.

Dump data from Atlas to local machine / docker

```powershell
mongodump --uri "mongodb+srv://<username>:<password>@clustername.mongodb.net/<database>" --out ./dump
```

> *Note: this is the same dump command. But the source is changed by adding URI*

Now this dump file can be copied to the docker from localhost (if dump was not done in docker)

```powershell
docker cp <local-dump-path> <container-id>:<docker-save-path>
```

Example:  
`docker cp ./dump 4296ea858046:/dump`

This command will copy the dump folder from your Docker container to your local machine.

Then all you need to do is update the local mongo instance in the docker

```powershell
mongorestore /path/to/dump
```

Example:  
`mongorestore ./dump`  

> *Note: Additionally you can use the `--drop` paramenter if you want to avoid any conflicts. It will delete exisiting database on Atlas and then create a new one with updated data in place*

This will update the local mongo instance in the docker to the one in the Atlas

---

Hence you can now either backup from docker to atlas or vice versa