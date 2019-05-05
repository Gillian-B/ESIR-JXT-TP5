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
                res.body.should.have.property('message')
                res.body.should.have.property('access_token')
                res.body.message.should.be.eql('OK')
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
                res.body.should.have.property('message')
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
                const token = res.body.access_token
                chai
                    .request(app)
                    .get('/v1/auth/verifyaccess')
                    .set('Authorization', `bearer ${token}`)
                    .end((error, response) => {
                        response.should.have.status(200)
                        response.should.be.json
                        response.body.should.have.property('message')
                        response.body.message.should.eql('OK')
                        done()
                    })
            })
    })
    it('should not have access (wrong token)', done => {
        chai
            .request(app)
            .post('/v1/auth/login')
            .send({login: 'pedro', password: 'azerty'})
            .end((err, res) => {
                chai
                    .request(app)
                    .get('/v1/auth/verifyaccess')
                    .set('Authorization', `bearer azertyuiopqsdfghjklm`)
                    .end((error, response) => {
                        response.should.have.status(401)
                        response.should.be.json
                        response.body.should.have.property('message')
                        response.body.message.should.eql('Unauthorized')
                        done()
                    })
            })
    })
    it('should not have access (no token)', done => {
        chai
            .request(app)
            .post('/v1/auth/login')
            .send({login: 'pedro', password: 'azerty'})
            .end((err, res) => {
                chai
                    .request(app)
                    .get('/v1/auth/verifyaccess')
                    .end((error, response) => {
                        response.should.have.status(401)
                        response.should.be.json
                        response.body.should.have.property('message')
                        response.body.message.should.eql('Unauthorized')
                        done()
                    })
            })
    })
})