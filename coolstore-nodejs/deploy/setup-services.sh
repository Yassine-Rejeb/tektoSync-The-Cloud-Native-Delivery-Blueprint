#!/bin/bash

# Create Project/Namespace

oc new-project coolstore-dev

### Kafka Related

# Install Kafka Operator

oc apply -f kafka-operator.yaml


# Create instance

# NEED TO WAIT ON THE OPERATOR READINESS FIRST

oc apply -f kafka-cluster-creation.yaml -n coolstore-dev

# create topics

oc apply -f kafka-topics.yaml -n coolstore-dev

### Redis Cache

# Create Redis Cache

oc create -f redis-deployment.yaml -n coolstore-dev

# Create Service for Deployment

oc apply -f redis-service.yaml -n coolstore-dev



### Mongo DB Service

# Create Configmap to hold init.js

oc create configmap mongo-db-init --from-file ./mongo-init.js -n coolstore-dev

# Create the MongoDB Instance

oc create -f mongo-deployment.yaml -n coolstore-dev

# Create MongoDB Service
oc apply -f mongo-service.yaml -n coolstore-dev
