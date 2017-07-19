# FOI

> Telegram Publisher

FOI is a bot-based Telegram publisher app.

Made for journalists and activists, it is focused on real-time coverage of events.

---

This project uses [Feathers](http://feathersjs.com). An open source web framework for building modern real-time applications.

## Concepts and supported media

The content is organized by **chats**. Every conversation the bot participates is a chat, being a *private chat* or a *group chat*. If you'd like to create a new coverage or simply start a new publishing page, create a new telegram group and invite the bot and people you'd like to contribute to the coverage.

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

First you need to [create a bot](https://telegram.me/botfather). After creating and retrieving the bot token and username, paste it into `config/default.json`:

```json
"telegram": {
  "username": "Your_Bot",
  "token": "[your-token-here]"
}
```

We recommend using docker for development and production environments. With docker and docker-compose installed you can run:

```
$ docker-compose up
```

Access http://localhost:3030 and start talking to your bot!

## License

Copyright (c) 2016

Licensed under the [MIT license](LICENSE).
