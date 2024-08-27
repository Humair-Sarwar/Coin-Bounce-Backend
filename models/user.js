const {DataTypes} = require('sequelize');

const userSchema = async (sequlize)=>{
    const user = await sequlize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, // Automatically generate a UUID
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },{
        timestamps: true,
        tableName: 'Users'
    });
    return user;
};

module.exports = userSchema;