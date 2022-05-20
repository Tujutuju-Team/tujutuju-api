# API for tujutuju application

### How initialize & start project for the first time:

1. Run: `npm run docker:up` (this will install dependencies and start the application)
2. Open new terminal tab
3. Run: `docker-compose exec api /bin/bash` (enter to the application terminal)
4. Run: `npm run migrate up` (populate database with initial data)

**👌 Done!**

### Next time, to start project :

1. Run: `npm run docker:up`

### To stop the project:

1. Run: `npm run docker:down`

### To clear all resources:

1. Run: `npm run docker:clear`
