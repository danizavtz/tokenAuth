process.env.NODE_ENV = 'test';
const fs = require('fs'),
    expect = require('chai').expect,
    supertest = require('supertest'),
    app = require('../app'),
    pg = require('../lib/postgres'),
    sinon = require('sinon'),
    crypto = require('crypto');
    server = app.listen(),
    api = supertest(server),
    drop = fs.readFileSync(__dirname + '/../sql/drop.sql').toString(),
    create = fs.readFileSync(__dirname + '/../sql/create.sql').toString(),
    insert = fs.readFileSync(__dirname + '/../sql/insert.sql').toString();

describe('#Login', () => {
    before((done) => {
        pg.query(drop, (err) => {
            if (err) {
                throw err;
            }
            pg.query(create, (err) => {
                if (err) {
                    throw err;
                }
                pg.query(insert, (err) => {
                    if (err) {
                        throw err;
                    }
                    done();
                });
            });
        });
    });

    describe('GET', () => {
        it('Check get route does not exist', (done) => {
            api.get('/login/')
                .set('Accept', 'application/json; charset=utf-8')
                .expect(404)
                .end((err, res) => {
                    if (err) throw err;
                    expect(res.status).to.equal(404);
                    done();
                });
        });
        it('Check undefined route does not exist', (done) => {
            api.get('/' + undefined)
                .set('Accept', 'application/json; charset=utf-8')
                .expect(404)
                .end((err, res) => {
                    if (err) throw err;
                    expect(res.status).to.equal(404);
                    done();
                });
        });
        it('Check home page', (done) => {
            api.get('/')
                .set('Accept', 'application/json; charset=utf-8')
                .expect(200)
                .end((err, res) => {
                    if (err) throw err;
                    expect(res.status).to.equal(200);
                    done();
                });
        });
    });
    describe('POST', () => {
        it('Check if post without incorrect json return 400 error', (done) => {
            api.post('/login/')
                .send({})
                .set('Accept', 'application/json; charset=utf-8')
                .expect(400)
                .end((err, res) => {
                    if (err) throw err;
                    expect(res.body.errors.length).to.equal(4);
                    done();
                });
        });
        it('Mock hash password error', (done) => {
            const mocked_error_from_hash_password = {
                severity: 'ERROR',
                code: '42P01',
                detail: 'The value of "keylen" is out of range. It must be >= 0 && <= 2147483647.',
            };
            const stub = sinon.stub(crypto, "scrypt").yields(new Error(mocked_error_from_hash_password));
            api.post('/login/')
                .send({
                    "login": "admin",
                    "password": "abc123"
                })
                .set('Accept', 'application/json; charset=utf-8')
                .expect(500)
                .end((err, res) => {
                    if (err) throw err;
                    stub.restore();
                    expect(res.body).to.have.property('errors');
                    expect(res.body.errors).to.be.an('array');
                    expect(res.body.errors[0].msg).equal('Could not do login');
                    done();
                });
        });
        it('Check error on query database', (done) => {
            const mocked_error_from_database = {
                length: 107,
                severity: 'ERROR',
                code: '42P01',
                detail: 'mocked database error',
                position: '61',
                file: 'parse_relation.c',
                line: '1373',
                routine: 'parserOpenTable'
            };

            const stub = sinon.stub(pg, 'query').yields(new Error(mocked_error_from_database));
            api.post('/login/')
                .send({
                    "login": "admin",
                    "password": "abc123"
                })
                .set('Accept', 'application/json; charset=utf-8')
                .expect(500)
                .end((err, res) => {
                    if (err) throw err;
                    stub.restore();
                    expect(res.body).to.have.property('errors')
                    expect(res.body.errors).to.be.an('array')
                    expect(res.body.errors[0].msg).equal('Could not do login')
                    done();
                });
        });
        it('Check password required on body request error', (done) => {
            api.post('/login/')
                .send({
                    "login": "#"
                })
                .set('Accept', 'application/json; charset=utf-8')
                .expect(400)
                .end((err, res) => {
                    if (err) throw err;
                    expect(res.body.errors[0].msg).to.equal('password is required');
                    done();
                });
        });
        it('Check login required on body request error', (done) => {
            api.post('/login/')
                .send({
                    "password": "#"
                })
                .set('Accept', 'application/json; charset=utf-8')
                .expect(400)
                .end((err, res) => {
                    if (err) throw err;
                    expect(res.body.errors[0].msg).to.equal('login is required');
                    done();
                });
        });
        it('Check login is required with empty string', (done) => {
            api.post('/login/')
                .send({
                    "logi": "login",
                    "password": "1231313131313"
                })
                .set('Accept', 'application/json; charset=utf-8')
                .expect(400)
                .end((err, res) => {
                    if (err) throw err;
                    expect(res.body).to.have.property('errors');
                    expect(res.body.errors).to.be.an('array');
                    expect(res.body.errors[0]).to.have.property('msg');
                    expect(res.body.errors[0].msg).to.equal('login is required');
                    done();
                });
        });
        it('Check login is required with empty string', (done) => {
            api.post('/login/')
                .send({
                    "login": "",
                    "password": "1231313131313"
                })
                .set('Accept', 'application/json; charset=utf-8')
                .expect(400)
                .end((err, res) => {
                    if (err) throw err;
                    expect(res.body).to.have.property('errors');
                    expect(res.body.errors).to.be.an('array');
                    expect(res.body.errors[0]).to.have.property('msg');
                    expect(res.body.errors[0].msg).to.equal('login is required');
                    done();
                });
        });
        it('Check login is required with null string', (done) => {
            api.post('/login/')
                .send({
                    "login": null,
                    "password": "1231313131313"
                })
                .set('Accept', 'application/json; charset=utf-8')
                .expect(400)
                .end((err, res) => {
                    if (err) throw err;
                    expect(res.body).to.have.property('errors');
                    expect(res.body.errors).to.be.an('array');
                    expect(res.body.errors[0]).to.have.property('msg');
                    expect(res.body.errors[0].msg).to.equal('login is required');
                    done();
                });
        });
        it('Check password is required with password key does not exist', (done) => {
            api.post('/login/')
                .send({
                    "login": "abc123abc",
                    "passwor": "1231313131313"
                })
                .set('Accept', 'application/json; charset=utf-8')
                .expect(400)
                .end((err, res) => {
                    if (err) throw err;
                    expect(res.body).to.have.property('errors');
                    expect(res.body.errors).to.be.an('array');
                    expect(res.body.errors[0]).to.have.property('msg');
                    expect(res.body.errors[0].msg).to.equal('password is required');
                    done();
                });
        });
        it('Check password is required with empty string', (done) => {
            api.post('/login/')
                .send({
                    "login": "abc123abc",
                    "password": ""
                })
                .set('Accept', 'application/json; charset=utf-8')
                .expect(400)
                .end((err, res) => {
                    if (err) throw err;
                    expect(res.body).to.have.property('errors');
                    expect(res.body.errors).to.be.an('array');
                    expect(res.body.errors[0]).to.have.property('msg');
                    expect(res.body.errors[0].msg).to.equal('password is required');
                    done();
                });
        });
        it('Check password is required with null string', (done) => {
            api.post('/login/')
                .send({
                    "login": "abc123abc",
                    "password": null
                })
                .set('Accept', 'application/json; charset=utf-8')
                .expect(400)
                .end((err, res) => {
                    if (err) throw err;
                    expect(res.body).to.have.property('errors');
                    expect(res.body.errors).to.be.an('array');
                    expect(res.body.errors[0]).to.have.property('msg');
                    expect(res.body.errors[0].msg).to.equal('password is required');
                    done();
                });
        });
        it('Check not found user', (done) => {
            api.post('/login/')
                .send({
                    "login": "teste",
                    "password": "1231313131313"
                })
                .set('Accept', 'application/json; charset=utf-8')
                .expect(404)
                .end((err, res) => {
                    if (err) throw err;
                    expect(res.body).to.have.property('errors');
                    expect(res.body.errors).to.be.an('array');
                    expect(res.body.errors[0]).to.have.property('msg');
                    expect(res.body.errors[0].msg).to.equal('User or password does not match');
                    done();
                });
        });
        it('Check wrong password error', (done) => {
            api.post('/login/')
                .send({
                    "login": "admin",
                    "password": "1231313131313"
                })
                .set('Accept', 'application/json; charset=utf-8')
                .expect(404)
                .end((err, res) => {
                    if (err) throw err;
                    expect(res.body).to.have.property('errors');
                    expect(res.body.errors).to.be.an('array');
                    expect(res.body.errors[0]).to.have.property('msg');
                    expect(res.body.errors[0].msg).to.equal('User or password does not match');
                    done();
                });
        });
        it('Check password with sucess', (done) => {
            api.post('/login/')
                .send({
                    "login": "admin",
                    "password": "abc123"
                })
                .set('Accept', 'application/json; charset=utf-8')
                .expect(200)
                .end((err, res) => {
                    if (err) throw err;
                    expect(res.body).to.have.property('token');
                    expect(res.body.token).not.equal(null);
                    done();
                });
        })
        it('Check access secure route without token returns error', (done) => {
            api.get('/secure')
                .set('Accept', 'application/json; charset=utf-8')
                .expect(401)
                .end((err, res) => {
                    if (err) throw err;
                    expect(res.status).equal(401);
                    done()
                });
        });
        it('Check access secure route with sucess', (done) => {
            api.post('/login/')
                .send({
                    "login": "admin",
                    "password": "abc123"
                })
                .set('Accept', 'application/json; charset=utf-8')
                .expect(200)
                .end((err, res) => {
                    if (err) throw err;
                    expect(res.body).to.have.property('token');
                    const token = res.body.token;
                    api.get('/secure')
                        .set('Accept', 'application/json; charset=utf-8')
                        .set('Authorization', token)
                        .expect(200)
                        .end((err, res) => {
                            if (err) throw err;
                            expect(res.status).equal(200);
                            expect(res.body).to.have.property('msg');
                            expect(res.body.msg).equal('server up and running secure route')
                            done()
                        });
                });
        });
    });
});
