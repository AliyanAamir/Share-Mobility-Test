## Setting Up Application 
- Fill the .env file with the help of .env.sample present in the project
- First run docker compose up -d for building your container with postgres , adminer and redis image
- Run npm/ pnpm / yarn i to install all the node modules
- Run Commands pnpm/ npm/ yarn  run migrations:fresh to migrate all the drizzle schema.
- Finally Run the command npm / yarn / pnpm dev to start the application.
- Used Adminer image to check the tables and data in our database


