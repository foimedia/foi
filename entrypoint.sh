#!/bin/sh

: ${NODE_ENV:=development}

echo "Updating permissions..."
chown -Rf node:node /src /usr/local/lib/node_modules
if [ "$NODE_ENV" == "production" ]; then
  echo "Bundling assets..."
  su-exec node:node yarn run build:main
  echo "Bundling widget.js..."
  su-exec node:node yarn run build:widget
fi
echo "Executing process..."
exec su-exec node:node /sbin/tini -- "$@"
