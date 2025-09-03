[![ci-nextjs-application-template](https://github.com/ics-software-engineering/nextjs-application-template/actions/workflows/ci.yml/badge.svg)](https://github.com/ics-software-engineering/nextjs-application-template/actions/workflows/ci.yml)

For details, please see http://ics-software-engineering.github.io/nextjs-application-template/.

Fast start:

0. Clone this repository

1. Install and run PostgreSQL

2. $ createdb freshkeepuh              # create a database

3. Create a .env file from the sample.env. Set the DATABASE_URL

4. $ npm install                       # install dependencies

5. $ npx prisma migrate dev            # create the database schema

6. $ npx prisma db seed                # demo data

7. $ npm run dev                       # start the local development server