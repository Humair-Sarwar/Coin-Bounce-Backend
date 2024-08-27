const express = require("express");
const authController = require("../controller/authController");
const blogController = require("../controller/blogController");
const commentController = require("../controller/commentController");
const auth = require("../middleware/auth");
const router = express.Router();

// auth user apis
router.post('/api/signup', authController.singup);
router.post('/api/login', authController.login);
router.post('/api/logout', auth, authController.logout);

// refresh token
router.get('/api/refresh', authController.refresh);

// blogs crud apis
router.post('/api/blog', auth, blogController.createBlog);
router.get('/api/all-blog', auth, blogController.getAllBlog);
router.get('/api/get-users-blog/:id', auth, blogController.getUsersBlog);
router.get('/api/get-details-single-blog/:id', auth, blogController.getDetailsSingleBlog);
router.put('/api/blog', auth, blogController.updateBlog);
router.delete('/api/blog/:id', auth, blogController.deleteBlog);

// comment crud apis
router.post('/api/comment', auth, commentController.create);
router.get('/api/comment/:id', auth, commentController.getById);

module.exports = {
    router
}