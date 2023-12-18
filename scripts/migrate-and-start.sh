#!/bin/bash

echo "Current directory: $(pwd)"

npx prisma generate
npx prisma db push

echo "Prisma commands executed successfully."

# Start the application
yarn start