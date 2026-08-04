const express = require('express');
const router = express.Router();
const {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  markSoldOut,
  deleteListing
} = require('../controllers/listingController');
const { authenticate, optionalAuthenticate, authorizeRole } = require('../middleware/auth');
const { listingValidation } = require('../middleware/validate');

// Public listing browsing with optional auth
router.get('/', optionalAuthenticate, getAllListings);
router.get('/:id', optionalAuthenticate, getListingById);

// Farmer only actions
router.post('/', authenticate, authorizeRole('farmer', 'both'), listingValidation, createListing);
router.put('/:id', authenticate, authorizeRole('farmer', 'both'), updateListing);
router.patch('/:id/sold-out', authenticate, authorizeRole('farmer', 'both'), markSoldOut);
router.delete('/:id', authenticate, authorizeRole('farmer', 'both'), deleteListing);

module.exports = router;
