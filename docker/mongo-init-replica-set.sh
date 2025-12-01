#!/bin/bash
set -e

echo "Waiting for MongoDB to be ready..."
until mongosh --eval "db.adminCommand('ping')" &>/dev/null; do
  echo "MongoDB is unavailable - sleeping"
  sleep 1
done

echo "MongoDB is ready! Setting up replica set..."

# Check if replica set is already initialized
if mongosh --eval "rs.status()" --quiet &>/dev/null; then
  echo "Replica set already initialized"
else
  echo "Initializing replica set..."
  mongosh --eval "rs.initiate({_id:'rs0',members:[{_id:0,host:'localhost:27017'}]})" --quiet
  echo "Replica set initialized!"
fi

echo "Replica set setup complete!"

