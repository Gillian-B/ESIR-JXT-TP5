const chai = require('chai')
const chaiHttp = require('chai-http')
const {app} = require('../app')

chai.should()
chai.use(chaiHttp)

describe('Auth tests', () => {
    it('should be successful to login', done => {
        chai
            .request(app)
            .post('/v1/auth/login')
            .send({login: 'pedro', password: 'azerty'})
            .end((err, res) => {
                res.should.have.status(200)
                res.should.be.json
                res.body.should.includes.all.keys(['access_token', 'expirity'])
                done()
            })
    })
    it('should fail to login', done => {
        chai
            .request(app)
            .post('/v1/auth/login')
            .send({login: 'pedro', password: 'aze'})
            .end((err, res) => {
                res.should.have.status(401)
                res.should.be.json
                res.body.should.includes.all.keys(['code', 'type', 'message'])
                res.body.message.should.eql('Unauthorized')
                done()
            })
    })

    it('should have access', done => {
        chai
            .request(app)
            .post('/v1/auth/login')
            .send({login: 'pedro', password: 'azerty'})
            .end((err, res) => {
                chai
                    .request(app)
                    .get('v1/auth/verifyaccess')
                    .set('ACCES_TOKEN', res.body.acces_token)
                    .end((error, response) => {
                        response.should.have.status(200)
                        response.should.be.json
                        response.body.message.should.eql('OK')
                    })
            })
    })
    it('should not have access', done => {
        chai
            .request(app)
            .post('/v1/auth/login')
            .send({login: 'pedro', password: 'azerty'})
            .end((err, res) => {
                chai
                    .request(app)
                    .get('v1/auth/verifyaccess')
                    .set('ACCESS_TOKEN', 'azertyuiopqsdfghjklm')
                    .end((err, res) => {
                        res.should.have.status(401)
                        res.should.be.json
                        res.body.should.includes.all.keys(['code', 'type', 'message'])
                        res.body.message.should.eql('Unauthorized')
                    })
            })
    })
})