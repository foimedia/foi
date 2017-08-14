import client from 'services/feathers';

export default class Realtime {

  lastSeen = 0

  constructor (path, options) {

    if(path !== undefined) {
      this.service = client.service(path);
    }

    this.options = Object.assign({}, {
      createdField: 'createdAt',
      updatedField: 'updatedAt',
      bindings: {}
    }, options);

    this.bindings = this.options.bindings;

    client.io.on('connect', this.connect.bind(this));
    client.io.on('disconnect', this.disconnect.bind(this));
    client.io.on('reconnect', this.reconnect.bind(this));

  }

  restoreItems () {

    if(!this.bindings.patched || !this.bindings.created)
      return;

    if(this.lastSeen > 0) {
      const { pingTimeout } = client.io.io.engine;
      const date = this.lastSeen - pingTimeout
      this.service.find({
        query: {
          $or: [
            { [this.options.createdField] : { $gte : date } },
            { [this.options.updatedField] : { $gte : date } }
          ],
          $limit: 50
        }
      }).then(res => {
        res.data.forEach(item => {
          if(new Date(item[this.options.createdField]) < new Date(date)) {
            this.bindings.patched(item);
          } else {
            this.bindings.created(item);
          }
        });
      });
    }

  }

  subscribe () {
    for(let method in this.bindings) {
      this.service.on(method, this.bindings[method]);
    }
    this.subscribing = true;
  }

  unsubscribe (quiet = false) {
    for(let method in this.bindings) {
      this.service.off(method, this.bindings[method]);
    }
    if(!quiet) {
      this.subscribing = false;
    }
  }

  connect () {
    this.subscribe();
  }

  disconnect () {
    this.lastSeen = 0;
    if(this.subscribing) {
      this.lastSeen = Date.now();
      this.unsubscribe(true);
    }
  }

  reconnect () {
    if(this.subscribing) {
      this.restoreItems();
      this.subscribe();
    }
  }

};
