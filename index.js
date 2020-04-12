// Global Settings (NOT USED YET)
// const Settings = require('./settings.json');

// Setup Discord
const Discord = require('discord.js');
const {Client, MessageAttachment, MessageEmbed} = Discord;
const client = new Client();
client.login(process.env.test_bot); // Test bot's token is an environment variable.

// Setup lowdb
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

// Listen for the reaction events
client.on('messageReactionAdd', (mr, u) => {run(mr, true)});
client.on('messageReactionRemove', (mr, u) => {run(mr, false)});

// Activate the other functions
function run(mr, neg) {
    let x = Number(neg);
    if (x == 0) x = -1;
    updateDB(mr.message.id, x);
}

// Search the db for if the message is already logged
function searchDB(id) {
    let x = db.get('messages').find({id: id}).value();
    if (x === undefined) return false;
    return x;
}

// Add the message to the db
function addToDB(id) {
    if (isNaN(id)) throw "ID is not a number!?!?";
    db.get('messages').push({id: id, number: 1}).write();
}

// Update the message in the db
function updateDB(id, num) {
    if (isNaN(id)) throw "ID is not a number!?!?";
    if (isNaN(num)) throw "NUM is not a number!?!?";
    let x = searchDB(id);
    if (x == false) {
        addToDB(id);
        return;
    }
    if (num == -1) {
        db.get('messages').assign({id: id, number: --x.number}).write();
    } else if (num == 1) {
        db.get('messages').assign({id: id, number: ++x.number}).write();
    } else throw "Invalid value for NUM";
}

// Useless junk, mostly for debugging...
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setActivity('Eliza code.', {type: "WATCHING"});
});
