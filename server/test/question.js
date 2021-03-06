import chaiHttp from 'chai-http';
import chai from 'chai';
import app from '../app';
import data from '../data/testdata.json';
import token from '../helpers/tokenGenerator';

const { expect } = chai;
chai.use(chaiHttp);

const { userToken, userToken2, wrongToken } = token;


describe('GET endpoint when question is added', () => {
  it('should return a 200', (done) => {
    chai.request(app)
      .get('/api/v1/questions')
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('object');
        done();
      });
  });

});

describe('POST endpoint for questions', () => {
  const api = '/api/v1/questions';
  it('should require a token for authorisation ', (done) => {
    chai.request(app)
      .post(api)
      .send(data.noBodyQuestion)
      .end((error, response) => {
        expect(response.status).to.equal(401);
        expect(response.body.error).to.equal('You are unauthorised to make this request');
        done();
      });
  });

  it('should require the correct token for authorisation ', (done) => {
    chai.request(app)
      .post(api)
      .set('Authorization', wrongToken)
      .send(data.noBodyQuestion)
      .end((error, response) => {
        expect(response.status).to.equal(401);
        expect(response.body.error).to.equal('Could not authenticate the provided token');
        done();
      });
  });

  it('should not add a question with no title', (done) => {
    chai.request(app)
      .post(api)
      .set('Authorization', userToken)
      .send(data.noTitleQuestion)
      .end((error, response) => {
        expect(response.status).to.equal(400);
        done();
      });
  });



  it('should not add a question with no body ', (done) => {
    chai.request(app)
      .post(api)
      .set('Authorization', userToken)
      .send(data.noBodyQuestion)
      .end((error, response) => {
        expect(response.status).to.equal(400);
        done();
      });
  });

  it('should not add a question with no title and body ', (done) => {
    chai.request(app)
      .post(api)
      .set('Authorization', userToken)
      .send(data.noContent)
      .end((error, response) => {
        expect(response.status).to.equal(400);
        done();
      });
  });

  it('should return a 200 for GET user question', (done) => {
    chai.request(app)
      .get('/api/v1/users/questions')
      .set('Authorization', userToken)
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('object');
        done();
      });
  });



  it('should return 201 for a successful post request ', (done) => {
    const question = {
      title: 'Firing onclick event which triggers ',
      body: 'I amm trying to do this the elegant way, with jsdom ',
      userId: 1

    }
    chai.request(app)
      .post(api)
      .set('Authorization', userToken)
      .send(question)
      .end((error, response) => {
        expect(response.status).to.equal(201);
        expect(response.body.message).to.equal('Question Added Successfully');
        expect(response.body.data).to.be.an('object');
        done();
      });
  });
});
describe('GET all questions endpoint', () => {
  it('should return a 200', (done) => {
    chai.request(app)
      .get('/api/v1/questions')
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('object');
        done();
      });
  });

});

describe('GET users questions endpoint', () => {
  const api = '/api/v1/users/questions'
  it('should return a 200', (done) => {
    chai.request(app)
      .get(api)
      .set('Authorization', userToken)
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('object');
        done();
      });
  });

});



describe('GET endpoint for a question', () => {
  it('should return an 200', (done) => {
    chai.request(app)
      .get('/api/v1/questions/1')
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('object');
        done();
      });
  });

  it('should return an 400', (done) => {
    chai.request(app)
      .get('/api/v1/questions/gy')
      .end((error, response) => {
        expect(response.status).to.equal(400);
        expect(response.body).to.be.an('object');
        done();
      });
  });


  it('should return 404 if question doesnt exist ', (done) => {
    const noQuestionApi = '/api/v1/questions/100';
    chai.request(app)
      .get(noQuestionApi)
      .end((error, response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('No question with this question Id');

        done();
      });
  });
});




describe('DELETE endpoint for a question', () => {

  it('should require a token ', (done) => {
    chai.request(app)
      .delete('/api/v1/questions/1')
      .end((error, response) => {
        expect(response.status).to.equal(401);
        expect(response.body.error).to.equal('You are unauthorised to make this request');
        done();
      });
  });

  it('should require a correct token ', (done) => {
    chai.request(app)
      .delete('/api/v1/questions/1')
      .set('Authorization', wrongToken)
      .end((error, response) => {
        expect(response.status).to.equal(401);
        expect(response.body.error).to.equal('Could not authenticate the provided token');
        done();
      });
  });

  it('should returns 401 if another user ', (done) => {
    const api = '/api/v1/questions/1';
    chai.request(app)
      .delete(api)
      .set('Authorization', userToken2)
      .end((error, response) => {
        expect(response.status).to.equal(401);
        expect(response.body.message).to.equal('You can not delete this question because you are not the author');
        done();
      });
  });


  it('should return a status 200', (done) => {
    chai.request(app)
      .delete('/api/v1/questions/1')
      .set('Authorization', userToken)
      .end((error, response) => {
        expect(response.status).to.equal(200);
        done();
      });
  });

  it('should return 404 if question doesnt exist ', (done) => {
    const noQuestionApi = '/api/v1/questions/100';
    chai.request(app)
      .delete(noQuestionApi)
      .set('Authorization', userToken)
      .end((error, response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('There is no question with that ID');

        done();
      });
  });

  it('should return 400 if question doesnt exist ', (done) => {
    const noQuestionApi = '/api/v1/questions/gh';
    chai.request(app)
      .delete(noQuestionApi)
      .set('Authorization', userToken)
      .end((error, response) => {
        expect(response.status).to.equal(400);
        expect(response.body).to.be.an('object');

        done();
      });
  });


});




