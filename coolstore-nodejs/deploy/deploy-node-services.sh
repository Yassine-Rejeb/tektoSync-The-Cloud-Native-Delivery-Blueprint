#!/bin/bash

## Run this from the deploy directory to get the pathing correct

cd ..

# Deploy Inventory Service
cd inventory-service

echo "Deploy Inventory Service"

npm run deploy

cd ..

# Deploy Catalog Service
cd catalog-service

echo "Deploy Catalog Service"

npm run deploy

cd ..

# Deploy Cart Service
cd cart-service

echo "Deploy Cart Service"

npm run deploy

cd ..

# Deploy Order Service
cd order-service

echo "Deploy Order Service"

npm run deploy

cd ..

# Deploy Payment Service

cd payment-service

echo "Deploy Payment Service"

npm run deploy

cd ..

# Deploy UI

cd front-end

echo "Deploy Front End"

npm run deploy