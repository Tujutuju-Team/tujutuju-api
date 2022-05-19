# API for tujutuju application

### How start project:

1. Run: `docker-compose up --build -d` (this will build the application and start it)
2. Run: `docker-compose exec db psql -U postgres -w` (open postgresql terminal)
3. Run: `CREATE DATABASE api;` (create database)
4. Run: `exit` (close postgresql terminal)
5. Run: `docker-compose exec api sh` (open the application terminal)
6. Run: `npm run migrate up` (populate database with initial data)
7. Run: `exit` (close application terminal)

👌 Done!

### To stop the project:

1. Run: `docker-compose down`
