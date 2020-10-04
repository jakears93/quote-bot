//Initialize Bot and login
require('dotenv').config();

// Database stuff
database = require('./lib/database')
User = database.userModel;
Quote = database.quoteModel;

const Discord = require('discord.js');
const mysql = require('mysql');

const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;
bot.login(TOKEN);

bot.on('ready', () => {
  	console.log(`Logged in as ${bot.user.tag}!`);
});

// Redeploy...

//Wait for message triggers
bot.on('message', msg => {
     var command = parseCommand(msg.content)[0];
     switch(command){
          case "!add":
               console.log("Current Command: "+command);
               addQuoteV2(msg)
               break;

          case "!quote":
               console.log("Current Command: "+command);
               quote = generateRandomQuote();
               msg.reply(quote);
               break;

          case "!help":
               console.log("Current Command: "+command);
               msg.channel.send(usage());
               break;
     }
});


//Functions
function parseCommand(msg)
{
     var command = msg.split(' ', 1);
     return command;
}

function checkUser(msg)
{
     var returnFlag = true;
     var user = msg.member.user.id;
     var sql = "SELECT * FROM user WHERE user_id = "+msg.member.user.id+" limit 1;";

     con.query(sql, returnFlag = function (err, result) {
          if (err)
          {
               console.log("\tError in DB Checking User");
               return false;
          }
          else
          {
               if(result.length)
               {
                    console.log("\t"+msg.member.user.tag+" already in db");
                    return true;
               }
               else
               {
                    if(addUser(msg))
                    {
                         return true;
                    }
                    else
                    {
                         console.log("\tError Adding User to Db");
                         returnFlag = 0;
                         return false;
                    }
               }
          }
     });
     return returnFlag;
}

function addUser(msg)
{
     var returnFlag = true;
     var id = msg.member.user.id;
     var user = msg.member.user.username;
     var sql = "INSERT INTO user (user_id, name) VALUES ('"+id+"','"+user+"')";
     con.query(sql, returnFlag = function (err, result) {
          if (err)
          {
               console.log("\tError in DB Adding User");
               return false;
          }
          else
          {
               console.log("\t"+msg.member.user.tag+" Added to DB!")
               return true;
          }
     });
     return returnFlag;
}

function addQuote(msg, msgInfo)
{
     var returnFlag = false;
     var parsedQuote = msg.content.match("\"[^\"]*\"{0,1}");     //parses anything between first two quotation marks
     var parsedAuthor = msg.content.match("(?<=-)[^-].*");        //parses anything after a dash, excludes any new lines
     var id = msg.member.user.id;
     var channel = msg.channel.name;

     if(parsedQuote === null || parsedAuthor === null)
     {
          console.log("\tImproper format, quote could not be added.");
          msg.reply("Sorry! I am unable to add your quote.  Please make sure to use the !add \"Quote\" -Author format!");
          return false;
     }

     var sql = "SELECT * FROM quote WHERE quote = "+parsedQuote+" limit 1;";

     con.query(sql, function (err, result) {
          if (err)
          {
               console.log("\tError in DB Checking Quote");
               returnFlag = true;
          }
          else
          {
               if(result.length)
               {
                    msg.reply("Sorry! Your submitted quote is already in the database.");
                    console.log("\tQuote is already in the db");
                    returnFlag = true;
               }
          }
     });

     console.log("return flag: "+returnFlag);
     if(returnFlag)
          return false;

     sql = "INSERT INTO quote (quote, user_id, channel, author) VALUES ("+parsedQuote+","+id+", '"+channel+"', '"+parsedAuthor+"')";
     con.query(sql, function (err, result) {
          if (err)
          {
               console.log(err);
               console.log("\tError in Db Adding Quote");
               returnFlag = true;
          }
          else
          {
               console.log("\t"+msg.member.user.tag+" Added a quote to the DB!")
          }
     });

     if(returnFlag)
          return false;

     sql = "UPDATE user SET no_of_quotes = no_of_quotes + 1 WHERE user_id LIKE '"+id+"' ";
     con.query(sql, function (error, row){
          if (error)
          {
               console.log("\tError Adding quote to user");
          }
     });
     return true;
}

function usage()
{
	return "!quote\t:\tfind a random quote \n\n!quote<user>\t:\tfind a random quote from a specific user\n\n!quote<user><search>\t:\tsearch for a specific quote";
};

function generateRandomQuote()		//return a random quote from the db
{
	var quote = 'Thorn has a nice bum';
	return quote;
};

function quoteUser(user)		//return a random quote from a specific user
{

};

function findQuote(user, partialMsg)	//searches through db for a specific quote by a user
{

};

function topQuote()			//returns the highest ranking quote
{

};

// Tox versions with promises
checkUserV2 = function(name) {
  var user;
  // Query is a promise, so handle result in then
  return user = User.findOne({
    name: name
  }).then((usr) => {
    if (usr === null) {
      // Create is a promise, so define the ultimate return value, and return a Promise for that value
      return User.create({
        name: name
      }).then((new_usr) => {
        return new_usr;
      });
    } else {
      // Yeah, always returning promises
      return usr;
    }
  }).catch(console.error); // Send errors to the console
};


// Handle checkuserV2
addQuoteV2 = function(msg) {
  return checkUserV2(msg).then((user) => {
    var author, channel, quoteMatch, authorMatch, parsedAuthor, parsedQuote, submitter;
    // Now user is a real, populated user.  Create the quote and add it in
    quoteMatch = msg.content.match("\"[^\"]*\"{0,1}"); // parses anything between first two quotation marks
    authorMatch = msg.content.match("(?<=-)[^-].*"); // parses anything after a dash, excludes any new lines

    if(quoteMatch === null || authorMatch === null)
    {
         console.log("\tImproper format, quote could not be added.");
         msg.reply("Sorry! I am unable to add your quote.  Please make sure to use the !add \"Quote\" -Author format!");
         return false;
    }

    parsedQuote = quoteMatch[0];
    parsedAuthor = authorMatch[0];

    channel = msg.channel.name;
    // Get users
    submitter = checkUserV2(msg.member.user.id);
    author = checkUserV2(parsedAuthor);

    // Wait for users to return
    return Promise.all([submitter, author]).then((users) => {
      var atr, quote, sbmtr;
      sbmtr = users[0];
      atr = users[1];
      return quote = Quote.create({
        quote: parsedQuote,
        channel: channel,
        authorId: atr.id,
        submitterId: sbmtr.id
      }).then((qt) => {
        var str;
        str = `Created quote ${qt.quote} by author ${atr.name} submitted by ${sbmtr.name}`;
        msg.reply(str);
        return console.log(str);
      }).catch(console.error);
    }).catch(console.error);
  }).catch(console.error);
};