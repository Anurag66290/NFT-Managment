import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../NFT.js'; // Assuming your Express app is exported as 'app'
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';    


// Configure chai
chai.use(chaiHttp);
const { expect } = chai;

describe('API Routes', () => {
    let token;
  
    // Generate a valid JWT token before running the tests
    before((done) => {
      // Generate a sample token with the secret key
      token = jwt.sign({ userId: 'sampleUserId' }, process.env.JWT_SECRET);
      done();
    });

// Test the GET /nfts route
describe('GET /nfts', () => {
  it('should return a list of NFTs', (done) => {
    chai
      .request(app)
      .get('/nfts')
      .set('Authorization', token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });
});


  describe('GET /nfts/:id', () => {
    
    it('should return an error for non-existing NFT', (done) => {
      const nonExistingNFTId = mongoose.Types.ObjectId().toHexString();
  
      chai
        .request(app)
        .get(`/nfts/${nonExistingNFTId}`)
        .set('Authorization', token)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });
  
  
  // Test the POST /nfts route
  describe('POST /nfts', () => {
    it('should create a new NFT', (done) => {
      const nftData = {
        title: 'My NFT',
        description: 'A description of my NFT',
      };

      chai
        .request(app)
        .post('/nfts')
        .set('Authorization', token)
        .send(nftData)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('nft');
          done();
        });
    });
  });

  // Test the PUT /nfts/:id route
describe('PUT /nfts/:id', () => {
  
  it('should return an error for non-existing NFT', (done) => {
    const nftData = {
      title: 'Updated NFT',
      description: 'Updated description',
    };

    // Assuming the ID of a non-existing NFT is "999999999999" (replace with a non-existing NFT ID)
    const nftId = '999999999999';

    chai
      .request(app)
      .put(`/nfts/${nftId}`)
      .set('Authorization', token)
      .send(nftData)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('error');
        done();
      });
  });
});
})
