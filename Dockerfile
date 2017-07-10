FROM node:8.1-alpine

EXPOSE 3030

WORKDIR /src

RUN apk -U upgrade \
  && apk add \
     ca-certificates \
     file \
     git \
     su-exec \
     tini \
  && npm install -g yarn nodemon gulp-cli \
  && update-ca-certificates \
  && rm -rf /tmp/* /var/cache/apk/*

# Copy files
COPY . /src

# Install app dependencies
RUN yarn install

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

# Run node server
CMD ["node", "src/"]
