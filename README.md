# Junk You Need

An app for hoarders to sell their junk to other nearby hoarders. Think virtual yard sale.

## For the developer

### To add a service

1. Install typescript globally and initiatize node project with basic packages
   `npm install -g typescript ts-node`
   `npm init -y`
   `npm install typescript ts-node-dev express @types/express`
   `tsc --init`
2. Start up new node service
   `ts-node-dev src/index.ts`
3. Dockerize
   create Dockerfile and .dockerignore in service dir
   `docker build -t aoyshi/auth .`
4. Kubernetes deployment and clusterIP service
   create both in `infra/k8s/auth-depl.yml` in project root dir
5. Setup Skaffold
   create skaffold.yml in project root dir
   `skaffold dev`
6. Setup Ingress-nginx
