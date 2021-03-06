process.env.NODE_ENV = 'test';

var chai = require('chai');
var should = chai.should();
var chaiHttp = require('chai-http');

var server = require('../../server/server');
var knex = require('../../server/db/knex');

chai.use(chaiHttp);

describe('API Event Routes', () => {

  beforeEach(function(done) {
    knex.migrate.rollback()
    .then(function() {
      knex.migrate.latest()
      .then(function() {
        return knex.seed.run()
        .then(function() {
          done();
        });
      });
    });
  });

  afterEach(function(done) {
    knex.migrate.rollback()
    .then(function() {
      done();
    });
  });

  describe('GET /api/events', function() {
    it('should return all public events', function(done) {
      chai.request(server)
        .get('/api/events')
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json; // jshint ignore:line
          res.body.should.be.a('array');
          res.body.length.should.equal(2);
          res.body[0].should.have.property('title');
          res.body[0].title.should.equal('Pokemongodb party');
          res.body[0].should.have.property('description');
          res.body[0].description.should.equal('Catch pokemon and do some coding');
          res.body[0].should.have.property('created_by');
          res.body[0].created_by.should.equal(1);
          res.body[0].should.have.property('location');
          res.body[0].location.should.equal('701 Brazos St, Austin, TX 78701');
          res.body[0].should.have.property('time');
          //res.body[0].time.should.equal('2016-08-30T08:00:00.000Z');
          res.body[0].should.have.property('privacy');
          res.body[0].privacy.should.equal(false);
          done();
        });
    });
    it('should return all events including private events you have access to', function(done) {
      chai.request(server)
        .get('/api/events')
        .send({group_id: 1})
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json; // jshint ignore:line
          res.body.should.be.a('array');
          res.body.length.should.equal(3);
          res.body[2].should.have.property('title');
          res.body[2].title.should.equal('facebook only');
          res.body[2].should.have.property('description');
          res.body[2].description.should.equal('Facebook event');
          res.body[2].should.have.property('created_by');
          res.body[2].created_by.should.equal(2);
          res.body[2].should.have.property('location');
          res.body[2].location.should.equal('2100 Alamo St, Austin, TX 78722');
          res.body[2].should.have.property('time');
          //res.body[0].time.should.equal('2016-08-30T08:00:00.000Z');
          res.body[2].should.have.property('privacy');
          res.body[2].privacy.should.equal(true);
          done();
        });
    });
  });

  describe('GET /api/events/:id', function() {
    it('should return a single event', function(done) {
      chai.request(server)
        .get('/api/events/1')
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json; // jshint ignore:line
          res.body.should.be.a('array');
          res.body.length.should.equal(1);
          res.body[0].should.have.property('title');
          res.body[0].title.should.equal('Pokemongodb party');
          res.body[0].should.have.property('description');
          res.body[0].description.should.equal('Catch pokemon and do some coding');
          res.body[0].should.have.property('created_by');
          res.body[0].created_by.should.equal(1);
          res.body[0].should.have.property('location');
          res.body[0].location.should.equal('701 Brazos St, Austin, TX 78701');
          res.body[0].should.have.property('time');
          //res.body[0].time.should.equal('2016-08-30T08:00:00.000Z');
          res.body[0].should.have.property('privacy');
          res.body[0].privacy.should.equal(false);
          done();
        });
    });
  });

  describe('POST /api/events', function() {
    it('should add an event', function(done) {
      chai.request(server)
        .post('/api/events')
        .send({
          title: 'Wrestle with Jad',
          description: 'Come get some',
          created_by: 2,
          location: '115 E 6th St, Austin, TX 78701',
          time: '2016-08-15T15:00:00.000',
          privacy: false
        })
        .end(function(err, res) {
          res.should.have.status(201);
          res.should.be.json; // jshint ignore:line
          res.body.should.be.a('object');
          res.body.should.have.property('title');
          res.body.title.should.equal('Wrestle with Jad');
          res.body.should.have.property('description');
          res.body.description.should.equal('Come get some');
          res.body.should.have.property('created_by');
          res.body.created_by.should.equal(2);
          res.body.should.have.property('location');
          res.body.location.should.equal('115 E 6th St, Austin, TX 78701, USA');
          res.body.should.have.property('time');
          //res.body.time.should.equal('2016-08-30T08:00:00.000Z');
          res.body.should.have.property('privacy');
          res.body.privacy.should.equal(false);
          done();
        });
    });

    it('should not create an event if the location is invalid', function(done) {
      chai.request(server)
        .post('/api/events')
        .send({
          title: 'Wrestle with Jad',
          description: 'Come get some',
          created_by: 2,
          location: 'zxcv',
          time: '2016-08-15T15:00:00.000',
          privacy: false
        })
        .end(function(err, res) {
          err.should.have.status(500);
          done();
        });
    });
  });

  describe('PUT /api/events/:id', function() {
    it('should update an event', function(done) {
      chai.request(server)
        .put('/api/events/1')
        .send({
          location: '1100 Congress Ave, Austin, TX 78701',
          privacy: true
        })
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json; // jshint ignore:line
          res.body.should.be.a('object');
          res.body.should.have.property('title');
          res.body.title.should.equal('Pokemongodb party');
          res.body.should.have.property('description');
          res.body.description.should.equal('Catch pokemon and do some coding');
          res.body.should.have.property('created_by');
          res.body.created_by.should.equal(1);
          res.body.should.have.property('location');
          res.body.location.should.equal('1100 Congress Ave, Austin, TX 78701');
          res.body.should.have.property('time');
          //res.body.time.should.equal('2016-08-30T08:00:00.000Z');
          res.body.should.have.property('privacy');
          res.body.privacy.should.equal(true);
          done();
        });
    });

    it('should not update an event if id field is part of the request', function(done) {
      chai.request(server)
        .put('/api/events/1')
        .send({
          id: 5,
          location: '1100 Congress Ave, Austin, TX 78701',
          privacy: true
        })
        .end(function(err, res) {
          res.should.have.status(422);
          res.should.be.json; // jshint ignore:line
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.equal('You cannot update the id field');
          done();
        });
    });
  });

  describe('DELETE /api/events/:id', function() {
    it('should delete an event', function(done) {
      chai.request(server)
        .delete('/api/events/1')
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json; // jshint ignore:line
          res.body.should.be.a('object');
          res.body.should.have.property('title');
          res.body.title.should.equal('Pokemongodb party');
          res.body.should.have.property('description');
          res.body.description.should.equal('Catch pokemon and do some coding');
          res.body.should.have.property('created_by');
          res.body.created_by.should.equal(1);
          res.body.should.have.property('location');
          res.body.location.should.equal('701 Brazos St, Austin, TX 78701');
          res.body.should.have.property('time');
          //res.body.time.should.equal('2016-08-30T08:00:00.000Z');
          res.body.should.have.property('privacy');
          res.body.privacy.should.equal(false);
          chai.request(server)
            .get('/api/events')
            .end(function(err, res) {
              res.should.have.status(200);
              res.should.be.json; // jshint ignore:line
              res.body.should.be.a('array');
              res.body.length.should.equal(1);
              done();
            });
        });
    });
  });

  describe('GET /api/events/:id/guests', function() {
    it('should return the guests for an event', function(done) {
      chai.request(server)
        .get('/api/events/1/guests')
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json; // jshint ignore:line
          res.body.should.be.a('array');
          res.body.length.should.equal(2);
          res.body[1].should.have.property('name');
          res.body[1].name.should.equal('Bob');
          res.body[1].should.have.property('email');
          res.body[1].email.should.equal('bob@gmail.com');
          res.body[1].should.have.property('image');
          res.body[1].image.should.equal('https://imageurl');
          res.body[1].should.have.property('facebook_id');
          res.body[1].facebook_id.should.equal('12104755554605552');
          done();
        });
    });
  });

  describe('POST /api/events/:id/guests', function() {
    it('should create a new guest for an event', function(done) {
      chai.request(server)
        .post('/api/events/2/guests')
        .send({
          user_id: 1,
          status: 'pending'
        })
        .end(function(err, res) {
          res.should.have.status(201);
          res.should.be.json; // jshint ignore:line
          res.body.should.be.a('object');
          res.body.should.have.property('name');
          res.body.name.should.equal('Alice');
          res.body.should.have.property('email');
          res.body.email.should.equal('alice@gmail.com');
          res.body.should.have.property('image');
          res.body.image.should.equal('https://imageurl');
          res.body.should.have.property('facebook_id');
          res.body.facebook_id.should.equal('12104755554605551');
          done();
        });
    });

    it('should not create a new guest if user is already a guest', function(done) {
      chai.request(server)
        .post('/api/events/2/guests')
        .send({
          user_id: 2,
          status: 'pending'
        })
        .end(function(err, res) {
          res.should.have.status(422);
          res.should.be.json; // jshint ignore:line
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.equal('User is already a guest');
          done();
        });
    });
  });

  describe('PUT /api/events/:eventId/guests/:userId', function() {
    it('should update a guest status', function(done) {
      chai.request(server)
        .put('/api/events/1/guests/2')
        .send({
          status: 'declined'
        })
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('user_id');
          res.body.user_id.should.equal(2);
          res.body.should.have.property('event_id');
          res.body.event_id.should.equal(1);
          res.body.should.have.property('status');
          res.body.status.should.equal('declined');
          done();
        });
    });

    it('should not update a guest if id field is part of the request', function(done) {
      chai.request(server)
        .put('/api/events/1/guests/2')
        .send({
          id: 5,
          status: 'declined'
        })
        .end(function(err, res) {
          res.should.have.status(422);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.equal('You cannot update the id field');
          done();
        });
    });
  });

  describe('DELETE /api/events/:eventId/guests/:userId', function() {
    it('should delete a guest at an event', function(done) {
      chai.request(server)
        .delete('/api/events/1/guests/2')
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('name');
          res.body.name.should.equal('Bob');
          res.body.should.have.property('email');
          res.body.email.should.equal('bob@gmail.com');
          res.body.should.have.property('image');
          res.body.image.should.equal('https://imageurl');
          res.body.should.have.property('facebook_id');
          res.body.facebook_id.should.equal('12104755554605552');
          chai.request(server)
            .get('/api/events/1/guests')
            .end(function(err, res) {
              res.should.have.status(200);
              res.should.be.json;
              res.body.should.be.a('array');
              res.body.length.should.equal(1);
              done();
            });
        });
    });

    it('return error if user is not a guest', function(done) {
      chai.request(server)
        .delete('/api/events/2/guests/1')
        .end(function(err, res) {
          res.should.have.status(422);
          res.should.be.json; // jshint ignore:line
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.equal('User is not a guest');
          done();
        });
    });
  });

  describe('GET /api/events/hide/:user_id', function() {
    it('should return an array of hidden events for the user', function(done) {
      chai.request(server)
        .get('/api/events/hide/1')
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.length.should.equal(1);
          res.body[0].should.have.property('id')
          res.body[0].id.should.equal(1)
          res.body[0].should.have.property('user_id');
          res.body[0].user_id.should.equal(1);
          res.body[0].should.have.property('event_id');
          res.body[0].event_id.should.equal(2);
          done();
        });
    });
  });

  describe('POST /api/events/:id/hide', function() {
    it('should hide an event', function(done) {
      chai.request(server)
        .post('/api/events/1/hide')
        .send({
          user_id: 1
        })
        .end(function(err, res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('user_id');
          res.body.user_id.should.equal(1);
          res.body.should.have.property('event_id');
          res.body.event_id.should.equal(1);
          done();
        });
    });
  });

  describe('DELETE /api/events/:id/hide/:user_id', function() {
    it('should unhide an event for the user', function(done) {
      chai.request(server)
        .delete('/api/events/2/hide/1')
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('event_id');
          res.body.event_id.should.equal(2);
          chai.request(server)
            .get('/api/events/hide/1')
            .end(function(err, res) {
              res.should.have.status(200);
              res.should.be.json;
              res.body.should.be.a('array');
              res.body.length.should.equal(0);
              done();
            });
        });
    });
  });


});
