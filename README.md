Example expressJS app from [Wes Bos](https://wesbos.com/learn-node/). 
Finished app is hosted on Heroku: https://restaurant-reviews-4123.herokuapp.com/

Packages used:
- Express JS (with Pug templates)
- MongoDB
- Typescript

## to start:

```bash
npm run dev
```

To load sample data, run the following command in your terminal:

```bash
npm run sample
```

If you have previously loaded in this data, you can wipe your database 100% clean with:

```bash
npm run blowitallaway
```

That will populate 16 stores with 3 authors and 41 reviews. The logins for the authors are as follows:

|Name|Email (login)|Password|
|---|---|---|
|Wes Bos|wes@example.com|wes|
|Debbie Downer|debbie@example.com|debbie|
|Beau|beau@example.com|beau|

Notes:
1. Normally .env files should not be commited to version control, but they are throw
away free accounts anyway and it makes it easier for others to use the code.
2. I don't like the use of Pug templates in this repo. In my opinion it is easier to have
an ExpressJS application that only sends back JSON, and a frontend React application
that displays the data.
3. DevDependencies in package.json are lumped in with dependencies because heroku was 
stripping them out and I had built this app to need ts-node and webpack at runtime. In 
future, this would not be done again. This repo https://github.com/alias8/express-jest-testing
is basically this same app but only sends back JSON and doesn't need webpack.
