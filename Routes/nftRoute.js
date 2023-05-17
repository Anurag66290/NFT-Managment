import express from 'express';
import { authenticateJWT } from '../middleware/authMiddleware.js';
import { encryptData, decryptData } from '../utils/crypto.js';
import NFT from '../Model/NFT.js';
import { login, generateToken, createUser } from '../controllers/authController.js';

const router = express.Router();

// Login and generate token
router.post('/login', login);

router.post('/createUser', createUser);

// Get a list of all NFTs
router.get('/', authenticateJWT, async (req, res) => {
  try {
    // Retrieve all NFTs from the database
    const nfts = await NFT.find();

    // Decrypt sensitive data before sending the response
    const decryptedNFTs = nfts.map((nft) => ({
      id: nft.id,
      title: nft.title,
      description: nft.description,
      // Decrypt other fields here
    }));

    return res.json(decryptedNFTs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch NFTs' });
  }
});

// Get a single NFT by ID
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;

    // Retrieve the NFT from the database
    const nft = await NFT.findById(id);

    if (!nft) {
      return res.status(404).json({ error: 'NFT not found' });
    }

    // NFT found, return it
    res.json(nft);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





// Create a new NFT
router.post('/', authenticateJWT, async (req, res) => {
  try {
    const { title, description } = req.body;

    
    // Create a new NFT in the database
    const newNFT = await NFT.create({
      title: title,
      description: description,
      // Store other encrypted fields here
    });

    console.log('New NFT created:', newNFT); // Log the created NFT for debugging

    return res.status(201).json({ message: 'NFT created successfully', nft: newNFT });
  } catch (error) {
    console.error('Error creating NFT:', error); // Log the error for debugging
    return res.status(500).json({ error: 'Failed to create NFT' });
  }
});





// Update an existing NFT
router.put('/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    // Retrieve the NFT from the database
    const nft = await NFT.findById(id);

    if (!nft) {
      return res.status(404).json({ error: 'NFT not found' });
    }

    // Update the NFT in the database
    await NFT.findByIdAndUpdate(id, {
      title: title,
      description: description,
      // Update other encrypted fields here
    });

    return res.json({ message: 'NFT updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update NFT' });
  }
});

export default router;



// for test the api's run this command = npx mocha --require esm ./test/api.test.js