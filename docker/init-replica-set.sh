#!/bin/bash
# Script to initialize MongoDB replica set
# This can be run manually if the automatic init doesn't work

echo "Waiting for MongoDB to be ready..."
until mongosh mongodb://localhost:27017 --eval "db.adminCommand('ping')" &>/dev/null; do
  echo "MongoDB is unavailable - sleeping"
  sleep 1
done

echo "MongoDB is ready! Checking replica set status..."

# Check if replica set is already initialized
if mongosh mongodb://localhost:27017 --eval "rs.status()" --quiet &>/dev/null; then
  echo "Replica set already initialized"
  mongosh mongodb://localhost:27017 --eval "rs.status()" --quiet
else
  echo "Initializing replica set..."
  mongosh mongodb://localhost:27017 --eval "rs.initiate({_id:'rs0',members:[{_id:0,host:'localhost:27017'}]})"
  echo "Replica set initialized!"
  echo "Waiting for replica set to be ready..."
  sleep 5
  mongosh mongodb://localhost:27017 --eval "rs.status()" --quiet
fi

