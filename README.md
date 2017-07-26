# FOI

**A bot-based publisher app.**

---

Made for journalists and activists, it is focused on real-time coverage of events.

---

This project uses [Feathers](http://feathersjs.com). An open source web framework for building modern real-time applications.

## How it Works

FOI is both a bot and a web app. The bot takes the messages it receives and sends it to the app, where its organized, stored and displayed in real-time.

The content is organized by the **chats** the bot participates in. They are your *private chat* with the bot and the *group chats* the bot is invited to..

Creating a new coverage or simply starting a new live feed is as easy as creating a Telegram group:

 - Create your new Telegram group inviting the people you'd like to contribute with;
 - Invite the bot;
 - That's it!

If the invitation is sent by an authorized publisher the bot will start watching the group and publish its content in real-time.

## Supported media

FOI currently supports publishing the following Telegram available media:

 - Text
 - Voice
 - Audio
 - Photo
 - Location
 - Video
 - Video note
 - Stickers (*available for Chrome only*)

## Stories

Coming soon...

## Authentication

Coming soon...

## Widget

FOI also provides a **widget** for embedding the real-time feed on another website.

Place `widget.js` on `<head />` or `<body />`:

```html
<script type="text/javascript" src="https://your-foi-app.com/widget.js" async></script>
```

Place the `div` with the chat id:

```html
<div class="foi-widget" data-chat="[chatId]"></div>
```

## Installing

### Configuration

First you need to [create a bot](https://telegram.me/botfather). Once you send your bot name and the BotFather gives you your bot token you are good to go. Paste it into `config/default.json`:

```json
"telegram": {
  "username": "Your_Bot",
  "token": "[your-token-here]"
}
```

### Install dependencies

Install dependencies through npm or yarn:

```
$ npm install
```

or

```
$ yarn install
```

### Bundle assets

```
$ npm run build
```

### Start the application

```
$ npm start
```

### Running on docker

We recommend using docker for development and production environments. With docker and docker-compose installed you can run:

```
$ docker-compose up
```

Only use the custom command `nodemon src/` on development environment. This command is used for watching code changes and restarting the server.

#### Docker volumes

On [docker-compose.yml](docker-compose.yml) you'll see the development volumes and the app data volumes.

By persisting the root and node_modules directory while using `nodemon src/` command you'll be able to develop using docker while it watches for code changes.

Persisting mongo database, uploaded files and the public directory (bundled assets) you will make sure that the data won't disappear on image upgrades and container renewals. **This is important for production use!**

#### Bundling assets

After the app container is created, you should run the command that generates the static content:

```
docker exec -it [foi_app_container_name] yarn run build
```

Access http://localhost:3030 and start talking to your bot!

### Environment variables

FOI uses [node-config](https://github.com/lorenwest/node-config), which means you can also pass your whole configuration through the [`NODE_CONFIG` environment variable](https://github.com/lorenwest/node-config/wiki/Environment-Variables#node_config)

On `docker-compose.yml` it would look something like this:

```yaml
services:
  app:
    environment:
      NODE_CONFIG: |-
        {
          "url": "https://demo.foi.media",
          "host": "demo.foi.media"
          "rest_of_the_stuff": "value"
        }
      NODE_ENV: production
```

## License

Copyright (c) 2016

Licensed under the [MIT license](LICENSE).
