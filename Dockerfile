FROM node:9-alpine

ARG UID=991
ARG GID=991

EXPOSE 3030

WORKDIR /foi

RUN apk -U upgrade \
  && apk add \
     ca-certificates \
     file \
     git \
     su-exec \
     tini \
  && npm install -g yarn nodemon \
  && update-ca-certificates \
  && rm -rf /tmp/* /var/cache/apk/*

RUN addgroup -g ${GID} foi \
  && adduser -h /foi -s /bin/sh -D -G foi -u ${UID} foi

# Copy files
COPY . /foi

# Install app dependencies
RUN yarn install

RUN chown -R foi:foi /foi

USER foi

ENTRYPOINT ["/sbin/tini", "--"]

# Run node server
CMD ["node", "src/"]
