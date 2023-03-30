# PWA-Bootstrap

Welcome to the monorepo for PWA-Bootstrap!

## Installing

Pull this repo down onto your local machine. You will want to `npm install` the dependencies in both the `client` and `server` folders.

### Mongo

Data is backed by MongoDB, so make sure you have that installed and running on your 27017 port locally

### Environment

There are sample environment files. Simply copy the content into new files with the same name (with the `.sample` extension removed).

Both Heroku and Vercel support adding secrets via their CLI.

### Running

After you have installed the deps and mongo, you can use the following commands to run the app locally:

- client: `npm start`
- server: `npm run start-dev`

This should spin up the backend on localhost:4000 and the frontend on localhost:3000

## Developing

The client is built using create-react-app, so you should easily be able to see your changes via hot reload.

The server is graphql on top of express. Most debugging can be done via a schema explorer like https://studio.apollographql.com/sandbox/explorer

You will note that there are `generated.ts` files in both the client and server. These are automatically generated when the server files change, and provide type safety and automatic hooks generation for easy data fetching on the client.

If you add or change the `*.graphql` files in the client, you will want to run `npm run generate` to make sure that the client-side `generated.ts` reflects those changes.

_Note_: VSCode (and other IDEs I'd assume) can get confused when `generated.ts` files are changing behind the scenes. Types will get seemingly out of sync. I suggest either keeping the `generated.ts` files open, or opening them ad-hoc when you think the types might be out of sync.
