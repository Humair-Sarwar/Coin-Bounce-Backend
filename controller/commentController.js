const Joi = require("joi");
const { CommentModel } = require("../database");

const commentController = {
    async create(req, res, next){
        let commentModel = CommentModel[0];
        const commentCreateSchema = Joi.object({
            content: Joi.string().required(),
            author: Joi.string().required(),
            blogId: Joi.string().required()
        });
        const {error} = commentCreateSchema.validate(req.body);
        if(error){
            return next(error);
        } 
        const {content, author, blogId} = req.body;
        try{
            await commentModel.create(req.body);
        }catch(error){
            return next(error);
        }
        return res.status(201).json({message: "Comment posted!"});
    },
    async getById(req, res, next){
        let commentModel = CommentModel[0];
        const getByIdScema = Joi.object({
            id: Joi.string().required()
        });
        const {error} = getByIdScema.validate(req.params);
        if(error){
            return next(error);
        }
        const {id} = req.params;
        let comment;
        try{
            comment = await commentModel.findAll({where: {blogId: id}});
        }catch(error){
            return next(error);
        }
        return res.status(200).json({comments: comment});
    }
};

module.exports = commentController;