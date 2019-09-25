Example expressJS app from [Wes Bos](https://wesbos.com/learn-node/). 
Finished app is hosted on Heroku: https://alias8-express.herokuapp.com/

Packages used:
- Express JS
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

#todo:
1. leave this repo as it was before jest config, reupload to github so that env
variables are not visible, deploy to heroku.
2. make another repo with the express returning json instead of rendering pug, 
and test it with jest.

