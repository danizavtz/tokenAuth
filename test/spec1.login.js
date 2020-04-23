process.env.NODE_ENV = 'test';
const fs = require('fs'),
    expect = require('chai').expect,
    supertest = require('supertest'),
    app = require('../app'),
    pg = require('../lib/postgres'),
    server = app.listen(),
    api = supertest(server),
    sql = fs.readFileSync(__dirname + '/../sql/test.sql').toString();

describe('#Login', () => {
    before((done) => {
        pg.query(sql, (err) => {
            if (err) {
                throw err;
            }
            done();
        });
    });

    describe('GET', () => {
        it('Check get route does not exist', (done) => {
            api.get('/login/')
                .set('Accept', 'application/json; charset=utf-8')
                .expect(404)
                .end((err, res) => {
                    expect(res.status).to.equal(404);
                    done();
                });
        });
        it('Check undefined route does not exist', (done) => {
            api.get('/' + undefined)
                .set('Accept', 'application/json; charset=utf-8')
                .expect(404)
                .end((err, res) => {
                    expect(res.status).to.equal(404);
                    done();
                });
        });
        it('Check home page', (done) => {
            api.get('/')
                .set('Accept', 'application/json; charset=utf-8')
                .expect(200)
                .end((err, res) => {
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
                    expect(res.body.errors.length).to.equal(2);
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
                    expect(res.body.errors[0].msg).to.equal('login is required');
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
                    expect(res.body.errors[0]).to.equal('User or password does not match');
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
                .expect(400)
                .end((err, res) => {
                    expect(res.body.errors[0]).to.equal('User or password does not match');
                    done();
                });
        });
    });
});
