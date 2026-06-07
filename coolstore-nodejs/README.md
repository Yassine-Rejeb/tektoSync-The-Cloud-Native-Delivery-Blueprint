# coolstore
This is an example demo showing a retail store consisting of several microservices based on NodeJS.

A Coolstore app where users can buy some cool merchandise.


- The UI is built with NodeJS and Angular. And the backend includes multiple Node.js services, such as
- *Inventory* , The stores inventory, how much items are available etc.
- *Catalog* , The products API
- *Cart*, Stores all users carts and intiates the order process by sending a message to Orders
- *Orders*, Completion and checking of orders
- *Payments*, Checks whether an payment is successfull given a certain Credit Card.

The demo is simple. Add an item to the cart. Checkout the item by going to the `Cart` tab. Add payment details. If the Card number starts with 4 the payment is successful else it will show status failed. this is a hard check in the payment service.

Once done, goto the `Orders` tab. The Order status should be `In Progress`, refresh after a couple of seconds and the status will appear as `COMPLETED` or `FAILED`. It takes a couple of seconds as their is a wait timer in Payment service + the whole process is done in a reactive and event driven way using Kafka and Quarkus.

![Architecture Screenshot](./docs/images/coolstore-ui.png)

## Run Locally

The whole demo application can be run locally for those using docker/podman.

Run the docker-compose.yml file in the `deploy` directory

```
podman compose up
```

## Cluster Setup

* Pre-Req: Have an Openshift cluster and log in using the `oc` client

* Change into the deploy directory

```
cd deploy
```

### Create Project/Namespace

oc new-project coolstore-dev

### Kafka Related

#### Install Kafka Operator

oc apply -f kafka-operator.yaml


#### Create instance

#### NEED TO WAIT ON THE OPERATOR READINESS FIRST

oc apply -f kafka-cluster-creation.yaml -n coolstore-dev

#### create topics

oc apply -f kafka-topics.yaml -n coolstore-dev

### Redis Cache

#### Create Redis Cache

oc create -f redis-deployment.yaml -n coolstore-dev

#### Create Service for Deployment

oc apply -f redis-service.yaml -n coolstore-dev



### Mongo DB Service

#### Create Configmap to hold init.js

oc create configmap mongo-db-init --from-file ./mongo-init.js -n coolstore-dev

#### Create the MongoDB Instance

oc create -f mongo-deployment.yaml -n coolstore-dev

#### Create MongoDB Service
oc apply -f mongo-service.yaml -n coolstore-dev


## Node.s Service Deployment

Each Node.js service has a npm script named `deploy` that uses the [Nodeshift cli](https://www.npmjs.com/package/nodeshift) to easily deploy your services to the cluster.

In each node application directory, run with:

```
npm run deploy
```

There is also a runnable script in the `deploy` directory that will deploy all the Node.js services in the correct order.

```
cd deploy/

./deploy-node-services.sh
```
