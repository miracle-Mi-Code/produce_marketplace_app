const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation Error',
      details: errors.array().map(err => ({ field: err.path, message: err.msg }))
    });
  }
  next();
};

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('role').isIn(['farmer', 'buyer', 'both']).withMessage('Role must be farmer, buyer, or both'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('lga').trim().notEmpty().withMessage('LGA is required'),
  handleValidationErrors
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

const listingValidation = [
  body('produce_name').trim().notEmpty().withMessage('Produce name is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('quantity').isFloat({ min: 0.01 }).withMessage('Quantity must be a positive number'),
  body('unit').trim().notEmpty().withMessage('Unit of measurement is required'),
  body('price_per_unit').isFloat({ min: 1 }).withMessage('Price per unit must be greater than 0'),
  body('harvest_date').isISO8601().withMessage('Valid harvest date is required'),
  handleValidationErrors
];

const orderValidation = [
  body('listing_id').isInt({ min: 1 }).withMessage('Valid listing ID is required'),
  body('quantity').isFloat({ min: 0.01 }).withMessage('Quantity must be greater than 0'),
  handleValidationErrors
];

module.exports = {
  registerValidation,
  loginValidation,
  listingValidation,
  orderValidation
};
