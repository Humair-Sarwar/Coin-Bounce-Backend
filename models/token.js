
const {DataTypes} = require('sequelize');

const tokenSchema = async (sequlize)=>{
    const token = await sequlize.define('Tokens', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userId: {
            type: DataTypes.UUID,
            references: {
                model: 'Users',
                key: 'id'
            }
        }
    },{
        timestamps: true
    });
    return token;
};

module.exports = tokenSchema;