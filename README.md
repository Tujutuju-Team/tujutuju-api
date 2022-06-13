# API for tujutuju application

The tujutuju.com is an application that provides Indonesian tourism guides for both local and international tourists. It helps tourism by providing any information related to tourism objects and destinations such as places and foods. As we know that Indonesia's tourism sector is still immature and needs further development to attract tourists. Many tourists are still confused to determine which places to visit because it's their first time visiting certain places. This leads to a question on how to improve tourists' experience in tourism? We think that there has to be someone to take the action to empower Indonesian tourist destinations. So we will give it a try by building this application that will enhance tourist's experience.

<br>

## Development guide

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

<br>

## 📚 Tech stack

1. [Express](https://expressjs.com/) (Node.js framework)
2. [PostgreSQL](https://www.postgresql.org/) (Database)
3. [JWT](https://jwt.io/) (Authentication)
4. [Docker](https://www.docker.com/) (Container)
5. [Google Compute Engine](https://cloud.google.com/compute) (Cloud computing service)

<br>

## 📝 Documentation and References

- ERD: [Here](https://user-images.githubusercontent.com/89337866/173225092-a0abfd64-3ecd-468d-ac2e-bf85100537df.png)

- API Specification: [Here](https://descriptive-woodwind-387.notion.site/Public-API-Documentation-f43972c5524245f981f46a4dca6f79ef)

<br>

## 🏗 Contributors

- [Rahel Kristina Prajnyawati](https://github.com/rahelkristina)
- [Riza Dwi Andhika](https://github.com/rizadwiandhika)
