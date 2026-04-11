const express = require('express');
const router = express.Router();
const { 
  createReview, 
  getReviews, 
  getReviewById, 
  deleteReview, 
  shareReview 
} = require('../controllers/reviewController');
const { authenticate } = require('../middleware/auth');
const { investigationLimiter } = require('../middleware/apiLimiter');

router.post('/review', authenticate, investigationLimiter, createReview);
router.get('/reviews', authenticate, getReviews);
router.get('/review/:id', authenticate, getReviewById);
router.delete('/review/:id', authenticate, deleteReview);
router.post('/review/:id/share', authenticate, shareReview);

module.exports = router;
