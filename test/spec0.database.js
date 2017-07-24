process.env.NODE_ENV = 'test';
var expect = require('chai').expect,
    supertest = require('supertest'),
    pg = require('../lib/postgres'),
    fs = require('fs');

describe('#DATABASE', function() {
    describe('CONNECTION ERROR', function() {
        it('Should return database not found', function(done) {
            pg.initialize(undefined, function(err) {
            	err = JSON.parse(JSON.stringify(err));
            	expect(err).to.have.property("name");
            	expect(err.name).to.equal("error");
            	expect(err).to.have.property("severity");
            	expect(err.severity).to.equal("FATAL");
                done();
            });
        });
    });
});
