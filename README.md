# FOI

**A bot-based publisher app.**

---

Made for journalists and activists, it is focused on real-time coverage of events.

---

This project uses [Feathers](http://feathersjs.com). An open source web framework for building modern real-time applications.

## Concepts

The content is organized by the **chats** the bot participates in. They are your *private chat* with the bot and the *group chats* he is invited to.

Creating a new coverage or simply starting a new publishing page is as easy as creating a Telegram group:

 - Create your new Telegram group with the people you'd like to contribute;
 - Invite the bot;
 - That's it!

If the invitation is sent by an authorized publisher the bot will start watching the group and publish its content in real-time.

### Supported media

FOI currently supports publishing the following Telegram available media:

 - Text
 - Voice
 - Audio
 - Photo
 - Location
 - Video
 - Video note
 - Stickers (*available for Chrome only*)

### Stories

Coming soon...

### Authentication

Coming soon...

## Installing

### Configuration

First you need to [create a bot](https://telegram.me/botfather). Once you send your bot name and the BotFather gives you your bot token you are good to go. Paste it into `config/default.json`:

```json
"telegram": {
  "username": "Your_Bot",
  "token": "[your-token-here]"
}
```

### Running on docker

We recommend using docker for development and production environments. With docker and docker-compose installed you can run:

```
$ docker-compose up
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
