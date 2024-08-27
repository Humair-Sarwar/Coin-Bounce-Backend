// const User = require('./user'); // Adjust the path accordingly
// const Blog = require('./blog'); // Adjust the path accordingly

// // Define associations
// User.hasMany(Blog, {
//     foreignKey: 'author',
//     as: 'blogs' // Alias for association
// });

// Blog.belongsTo(User, {
//     foreignKey: 'authorId',
//     as: 'author' // Alias for association
// });

// // Sync models (optional: use { force: true } for development to recreate tables)
// const syncModels = async () => {
//     try {
//         await sequelize.sync({ force: false }); // Adjust sync options as needed
//         console.log('Database & tables created!');
//     } catch (error) {
//         console.error('Unable to connect to the database:', error);
//     }
// };

// syncModels();

// module.exports = {
//     User,
//     Blog,
//     sequelize
// };
