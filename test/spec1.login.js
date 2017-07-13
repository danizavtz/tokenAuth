process.env.NODE_ENV = 'test';
var fs = require('fs'),
    expect = require('chai').expect,
    supertest = require('supertest'),
    app = require('../app'),
    pg = require('../lib/postgres'),
    server = app.listen(),
    api = supertest(server),
    sql = fs.readFileSync(__dirname + '/../sql/insert.sql').toString();

describe('#Login', function() {
    before(function(done) {
        pg.initialize(app.config.DATABASEURL, function(err) {
            if (err) {
                throw err;
            }
            pg.client.query(sql, function(err, result) {
                if (err) {
                    throw err;
                }
                done();
            });
        });
    });

    describe('GET', function() {
        it('Check get route does not exist', function(done) {
            api.get('/login/')
                .set('Accept', 'application/json; charset=utf-8')
                .expect(404)
                .end(function(err, res) {
                    expect(res.status).to.equal(404);
                    done();
                });
        });
        it('Check undefined route does not exist', function(done) {
            api.get('/' + undefined)
                .set('Accept', 'application/json; charset=utf-8')
                .expect(404)
                .end(function(err, res) {
                    expect(res.status).to.equal(404);
                    done();
                });
        });
        it('Check home page', function(done) {
            api.get('/')
                .set('Accept', 'application/json; charset=utf-8')
                .expect(200)
                .end(function(err, res) {
                    expect(res.status).to.equal(200);
                    done();
                });
        });
    });
    describe('POST', function() {
        it('Check if post without incorrect json return 400 error', function(done) {
            api.post('/login/')
                .send({})
                .set('Accept', 'application/json; charset=utf-8')
                .expect(400)
                .end(function(err, res) {
                    expect(res.body.length).to.equal(2);
                    done();
                });
        });
        it('Check password required on body request error', function(done) {
            api.post('/login/')
                .send({
                    "login": "#"
                })
                .set('Accept', 'application/json; charset=utf-8')
                .expect(400)
                .end(function(err, res) {
                    expect(res.body[0]).to.equal('password é obrigatório no body da requisição');
                    done();
                });
        });
        it('Check login required on body request error', function(done) {
            api.post('/login/')
                .send({
                    "password": "#"
                })
                .set('Accept', 'application/json; charset=utf-8')
                .expect(400)
                .end(function(err, res) {
                    expect(res.body[0]).to.equal('login é obrigatório no body da requisição');
                    done();
                });
        });
        it('Check not found user', function(done) {
            api.post('/login/')
                .send({
                    "login": "teste",
                    "password": "1231313131313"
                })
                .set('Accept', 'application/json; charset=utf-8')
                .expect(404)
                .end(function(err, res) {
                    expect(res.body.errors[0]).to.equal('Usuário ou senha incorretos');
                    done();
                });
        });
        it('Check wrong password error', function(done) {
            api.post('/login/')
                .send({
                    "login": "admin",
                    "password": "1231313131313"
                })
                .set('Accept', 'application/json; charset=utf-8')
                .expect(400)
                .end(function(err, res) {
                    expect(res.body.errors[0]).to.equal('Usuário ou senha incorretos');
                    done();
                });
        });
        it('Check login with success', function(done) {
            api.post('/login/')
                .send({
                    "login": "admin",
                    "password": "123456abc"
                })
                .set('Accept', 'application/json; charset=utf-8')
                .expect(200)
                .end(function(err, res) {
                    console.log(err);
                    console.log(res.body);
                    expect(res.body).to.have.property('token');
                    expect(res.body.token).to.not.equal(null);
                    done();
                });
        });
    });
});
