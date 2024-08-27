const {DataTypes} = require('sequelize');

const blogSchema = async (sequlize)=>{
    const blog = await sequlize.define('Blog', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false
        },
        photoPath: {
            type: DataTypes.STRING,
        },
        author: {
            type: DataTypes.UUID,
            references: {
                model: 'Users',
                key: 'id'
            }
        }
    },{
        timestamps: true
    });
    return blog;
};

module.exports = blogSchema;