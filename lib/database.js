/**
 * Created by carl on 10/4/20.
 *
 * Factor out database authentication and initialization
 */


var Quote, Sequelize, User, sequelize;
Sequelize = require('sequelize');
sequelize = null;

// Connect to database
// https://sequelize.org/master/manual/getting-started.html#connecting-to-a-database
if (process.env.DBTYPE === 'postgres') {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres'
    });
} else {
    sequelize = new Sequelize(process.env.MYSQLDATABASE, process.env.MYSQLUSER, process.env.MYSQLPASS({
        host: process.env.MYSQLHOST,
        dialect: 'mysql',
        protocol: 'mysql'
    }));
}

// Define Users, Quotes
User = sequelize.define('user', {
    name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    }
});

Quote = sequelize.define('quote', {
    quote: Sequelize.TEXT,
    channel: Sequelize.STRING
});

User.hasMany(Quote, {
    foreign_key: 'authorId'
});

User.hasMany(Quote, {
    as: 'submissions',
    foreign_key: 'submitterId'
});

Quote.belongsTo(User, {
    as: 'author'
});

Quote.belongsTo(User, {
    as: 'submitter'
});

// Update models
sequelize.sync();

// Accessors For models
module.exports.userModel = User;
module.exports.quoteModel = Quote;

