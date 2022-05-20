# API for tujutuju application

### How initialize & start project for the first time:

1. Run: `npm run docker:up` (this will install dependencies and start the application)
2. Wait until database is ready to accept connection
3. Open new terminal tab
4. Run: `docker-compose exec db psql -U postgres -w` (enter to the postgresql terminal)
5. Run: `CREATE DATABASE api;` (create database)
6. Open new terminal tab
7. Run: `docker-compose exec api sh` (enter to the application terminal)
8. Run: `npm run migrate up` (populate database with initial data)

**👌 Done!**

### Next time, to start project :

1. Run: `npm run docker:up`

### To stop the project:

1. Run: `npm run docker:down`

### To clear all resources:

1. Run: `npm run docker:clear`
