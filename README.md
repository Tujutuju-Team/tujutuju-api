# API for tujutuju application

**How initialize & start project for the first time:**

1. Run: `npm run docker:up` (this will install dependencies and start the application)
2. Open new terminal tab
3. Run: `docker-compose exec api /bin/bash` (enter to the application terminal)
4. Run: `npm run migrate up` (populate database with initial data)

**👌 Done!**

**Next time, to start project :**

1. Run: `npm run docker:up`

**To stop the project:**

1. Run: `npm run docker:down`

**To clear all resources:**

1. Run: `npm run docker:clear`



## Entitiy Relationship Diagram
<img width="506" alt="Screenshot 2022-06-12 154604" src="https://user-images.githubusercontent.com/89337866/173225092-a0abfd64-3ecd-468d-ac2e-bf85100537df.png">

## Endpoints Specification
[Api Endpoints](https://docs.google.com/spreadsheets/d/1sm9RF1Ewr00AFDwsu5CH0mQfuKglPhM1M30-oEUjwgo/edit?usp=sharing)
