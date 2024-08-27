const Joi = require('joi');
const fs = require('fs');
const { BlogModel, CommentModel } = require('../database');
const { BASE_URL } = require('../config');

const blogController = {
    async createBlog(req, res, next){
        let blogModel = BlogModel[0];
        const blogSchema = Joi.object({
            title: Joi.string().min(5).max(80).required(),
            content: Joi.string().min(5).max(300).required(),
            photo: Joi.string(),
            author: Joi.string().required() 
        });
        const {error} = blogSchema.validate(req.body);
        if(error){
            return next(error);
        }
        const {title, content, photo, author} = req.body;
        const buffer = Buffer.from(photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''), 'base64');
        const imagePath = `${Date.now()}-${author}.png`;

        if(photo !== "null"){
            try {
                fs.writeFileSync(`storage/${imagePath}`, buffer);
            } catch (error) {
                return next(error);
            }
        }
        let blog;
        if(photo !== "null"){

        }
        try {
            let data = {
                title,
                content,
                author,
                photoPath: photo == "null" ? "null" : `${BASE_URL}/storage/${imagePath}`
            }
            blog = await blogModel.create(data);
        } catch (error) {
            return next(error);
        }
        return res.status(201).json({blog})
    },
    async getAllBlog(req, res, next){
        let blogModel = BlogModel[0];
        try {
            let blogs = await blogModel.findAll();
            return res.status(200).json({blogs});
        } catch (error) {
            return next(error);
        }
    },
    async getUsersBlog(req, res, next){
        let blogModel = BlogModel[0];
        const getUsersBlogSchema = Joi.object({
            id: Joi.string().required()
        });
        const {error} = getUsersBlogSchema.validate(req.params);
        if(error){
            return next(error);
        }
        const {id} = req.params;
        let blog;
        try {
            blog = await blogModel.findAll({where: {author: id}});
            
        } catch (error) {
            return next(error);
        }
        return res.status(200).json({blog});
    },
     async getDetailsSingleBlog(req, res, next){
         let blogModel = BlogModel[0];
         const getDetailsSingleBlogSchema = Joi.object({
             id: Joi.string().required()
            })
            const {error} = getDetailsSingleBlogSchema.validate(req.params);
            if(error){
                return next(error);
            }
            const {id} = req.params;
            let blog;
        try {
            blog = await blogModel.findOne({where: {id: id}});
        } catch (error) {
            return next(error);
        }
        return res.status(200).json({blog});
     },
     async updateBlog(req, res, next){
        let blogModel = BlogModel[0];
        const updateBlogSchema = Joi.object({
            title: Joi.string().required(),
            content: Joi.string().required(),
            photo: Joi.string(),
            author: Joi.string().required(),
            blogId: Joi.string().required()
        });
        const {error} = updateBlogSchema.validate(req.body);
        if(error){
            return next(error);
        }
        const {title, content, photo, author, blogId} = req.body;
        let blog;
        try {
            blog = await blogModel.findOne({where: {id: blogId}});
        } catch (error) {
            return next(error);
        }
        if(photo){
            previousPhoto = blog.photoPath;
            previousPhoto = previousPhoto.split('/').at(-1);
            if (fs.existsSync(previousPhoto)) {
                try {
                    fs.unlinkSync(previousPhoto);
                } catch (error) {
                    return next(error);
                }
            } else {
                console.warn(`File ${previousPhoto} does not exist.`);
            }
            
           

            
            const buffer = Buffer.from(photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''), 'base64');
            // allot a random name
            const imagePath = `${Date.now()}-${author}.png`;
            try {
                fs.writeFileSync(`storage/${imagePath}`, buffer);
            } catch (error) {
                return next(error);
            }
            await blog.update({title, content, photoPath: `${BASE_URL}/storage/${imagePath}`}, {where: {id: blogId}});
        }else{
            await blog.update({title, content}, {where: {id: blogId}});
        }
        return res.status(200).json({message: 'Blog updated!'});
     },
     async deleteBlog(req, res, next){
        let blogModel = BlogModel[0];
        let commentModel = CommentModel[0];
        const deleteBlogSchema = Joi.object({
            id: Joi.string().required()
        });
        const {error} = deleteBlogSchema.validate(req.params)
        let {id} = req.params;
        try{
            await commentModel.destroy({where: {blogId: id}});
            await blogModel.destroy({where: {id}});
        }catch(error){
            return next(error);
        }
        return res.status(200).json({message: 'Blog delete!'});

     }
}

module.exports = blogController;