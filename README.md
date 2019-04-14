[![Express Logo](https://i.cloudup.com/zfY6lL7eFa-3000x3000.png)](http://expressjs.com/)
# tokenAuth
Steps for running:<br>
1. Clone project from git<br>
2. Para rodar com docker deve possuir o docker e docker-compose instalados
3. build image
```
docker-compose up --build
```
4. O servidor deve estar up and running em: http://localhost:3002

#Build
Para construir um build estável para rodar em sua instância:
```
docker build .
```

# Tests
1. npm t (unit tests)<br>
2. npm run coverage (coverage)<br>
