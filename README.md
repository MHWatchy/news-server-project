# Hosted Link

Link to hosted server: https://news-server-k1ka.onrender.com/api

# Summary

This project is for setting up the back end server of a news site. It uses postgresql to create and manage databases via requests made to the app from express.

# Setup Instructions

1) Clone this repository into your local machine by copying the link provided by the green code button and using the git clone command, or by copying it from here: "git clone https://github.com/MHWatchy/news-server-project.git". Do not include the speech marks and double check where in your file system you are cloning this repo. 
2) The dependencies to be installed include: dev(husky, jest, jest-sorted, supertest), dotenv, express, pg, pg-format. This can be done manually or with the following command: "npm install". Do not include the speech marks and double check you are within the cloned repo.
3) If you are using WSL, remember to start postgresql.
4) Create .env files (see below) and run the command: "npm run setup-dbs" to create your databases, the run "npm run seed" to seed your development database. Your test database will be seeding automatically before every test when running the "npm test" command.

# Creation of .env files

In the root of this directory, create .env.development file and a .env.test file. In the .env.development file, set the variable PGDATABASE must be set to nc_news, and in the .env.test file PGDATABASE must be set to nc_news_test.
I.e. in ./.env.development: PGDATABASE=nc_news and in ./.env.test: PGDATABASE=nc_news_test

# Minimum node and postgres versions required

Repo created using node v20.7.0 and psql v14.9