#!/usr/bin/env sh

node ace migration:run --force

node ./bin/server.js