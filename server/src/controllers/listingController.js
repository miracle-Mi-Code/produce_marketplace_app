const ListingModel = require('../models/listingModel');

const getAllListings = async (req, res, next) => {
  try {
    const { search, category, state, minPrice, maxPrice, status, sortBy, page, limit, farmerId } = req.query;

    const result = await ListingModel.findAll({
      search,
      category,
      state,
      minPrice,
      maxPrice,
      status,
      sortBy,
      page,
      limit,
      farmerId
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getListingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await ListingModel.findById(id);

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json({ listing });
  } catch (err) {
    next(err);
  }
};

const createListing = async (req, res, next) => {
  try {
    const farmer_id = req.user.id;
    const listing = await ListingModel.create(farmer_id, req.body);

    res.status(201).json({
      message: 'Listing created successfully',
      listing
    });
  } catch (err) {
    next(err);
  }
};

const updateListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const farmer_id = req.user.id;

    const updated = await ListingModel.update(id, farmer_id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Listing not found or you are not authorized to update it' });
    }

    res.json({
      message: 'Listing updated successfully',
      listing: updated
    });
  } catch (err) {
    next(err);
  }
};

const markSoldOut = async (req, res, next) => {
  try {
    const { id } = req.params;
    const farmer_id = req.user.id;

    const updated = await ListingModel.markSoldOut(id, farmer_id);
    if (!updated) {
      return res.status(404).json({ error: 'Listing not found or unauthorized' });
    }

    res.json({
      message: 'Listing marked as sold out',
      listing: updated
    });
  } catch (err) {
    next(err);
  }
};

const deleteListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const farmer_id = req.user.id;

    const deleted = await ListingModel.delete(id, farmer_id);
    if (!deleted) {
      return res.status(404).json({ error: 'Listing not found or unauthorized' });
    }

    res.json({ message: 'Listing deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  markSoldOut,
  deleteListing
};
