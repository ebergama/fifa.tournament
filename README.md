# fifa.tournament

Fifa Tournament is an application for keep tracking about the Fifa/PES matches results with your friends or colleagues. It works for 1 vs 1 and 2 vs 2 matches.

## Features:

- Google Authentication
- Build your own stats!
- Ranking ladder system
- Players profiles.
- Tournament generation.
- Single match track.

## Setup

### Requirements 
- Latest MongoDb.
- Latest npm version
- Latest nodejs version

### Configuration
Configure the [env.config](env.config) file properly

### Set up the database
```Shell
tar -xf backup/prod.backup_<latest>.tar.gz 
mongorestore --drop -d fifa prod.backup_<latest>/heroku_<hash>/
```
Replace the <latest> tag by the actual latest backup filename

## Running
```Shell
> mongod
> npm install
> node server.js
```

## Developer information

- Ezequiel Bergamaschi - ezequielbergamaschi@gmail.com

### Collaborators:
- Nicolas Rusconi - nicolas.rusconi+github@gmail.com
- Santiago Perez - sperez@gmail.com
