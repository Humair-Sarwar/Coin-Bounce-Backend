const {DataTypes} = require('sequelize');

const commentSchema = async (sequlize)=>{
    const comment = await sequlize.define('Comments', {
        id:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false
        },
        author: {
            type: DataTypes.UUID,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        blogId: {
            type: DataTypes.UUID,
            references: {
                model: 'Blogs',
                key: 'id'
            }
        }
    },{
        timestamps: true
    });
    return comment;
};

module.exports = commentSchema;