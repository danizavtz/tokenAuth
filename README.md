![Node.js CI](https://github.com/danizavtz/tokenAuth/workflows/Node.js%20CI/badge.svg)
[![codecov](https://codecov.io/gh/danizavtz/tokenAuth/branch/master/graph/badge.svg?token=CTTUNSFULX)](https://codecov.io/gh/danizavtz/tokenAuth)
[![Express Logo](https://i.cloudup.com/zfY6lL7eFa-3000x3000.png)](http://expressjs.com/)
# tokenAuth
Steps for running:<br>
1. Clone project from git<br>
2. To run with docker, you need docker and docker-compose installed
3. build image
```
docker-compose up --build
```
4. Server must be up and running in: http://localhost:3002

# Build
To do a stable build in your instance:
```
docker build .
```
# Build Local 
Case executing locally you must first create a .env file copy template from env-sample
1. `cp env-sampe .env`
2. fill in values in .env for your current configuration
3. uncomment Dockerfile the line (seven) that copy your .env file to container
4. `docker build .`

# Tests
1. npm t (unit tests)<br>
2. npm run coverage (coverage)<br>
