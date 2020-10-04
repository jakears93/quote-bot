Sequelize = require('sequelize')
sequelize = null

# Connect to database
# https://sequelize.org/master/manual/getting-started.html#connecting-to-a-database
if(process.env.DBTYPE == 'postgres')
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect:  'postgres',
    protocol: 'postgres'
  })
else
  sequelize = new Sequelize(process.env.MYSQLDATABASE, process.env.MYSQLUSER, process.env.MYSQLPASS {
    host: process.env.MYSQLHOST,
    dialect:  'mysql',
    protocol: 'mysql',
  })

# Define Users, Quotes
User = sequelize.define('user', {
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
})

Quote = sequelize.define('quote', {
  quote: Sequelize.TEXT,
  channel: Sequelize.STRING,
})

User.hasMany(Quote)
Quote.belongsTo(User, {as: 'author'})
Quote.belongsTo(User, {as: 'submitter'})

# Update models
sequelize.sync()


# Helper functions
checkUserV2 = (name) ->
  # Query is a promise, so handle result in then
  user = User.findOne({name: name}).then((usr) =>
    if(usr == null)
      # Create is a promise, so define the ultimate return value, and return a Promise for that value
      return User.create({name: name}).then((new_usr) =>
        return new_usr
      )
    else
      # Yeah, always returning promises
      return usr
  ).catch(console.error) # Send errors to the console


# Handle checkuserV2
addQuoteV2 = (msg) ->
  checkUserV2(msg).then((user) =>
    # Now user is a real, populated user.  Create the quote and add it in
    parsedQuote = msg.content.match("\"[^\"]*\"{0,1}") # parses anything between first two quotation marks
    parsedAuthor = msg.content.match("(?<=-)[^-].*") # parses anything after a dash, excludes any new lines
    channel = msg.channel.name

    # Get users
    submitter = checkUserV2(msg.member.user.id)
    author = checkUserV2(parsedAuthor)

    # Wait for users to return
    Promise.all([submitter, author]).then((users) =>
      sbmtr = users[0]
      atr = users[1]

      quote = Quote.create({quote: parsedQuote, channel: channel, authorId: atr.id, submitterId: sbmtr.id}).then((qt) =>
        console.log("Created quote #{qt.quote} by author #{author.name} submitted by #{sbmtr.name}")
      ).catch(console.error)
    ).catch(console.error)

  ).catch(console.error)
