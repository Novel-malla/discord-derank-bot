const db = require("./database");

const usersSchema = require("./schema/users");
const lfgPostsSchema = require("./schema/lfgPosts");
const lfgMembersSchema = require("./schema/lfgMembers");
const userLevels = require("./schema/userLevels");
const ticketsSchema = require("./schema/tickets");
const achievementsSchema = require("./schema/achievements");

function initializeDatabase() {

    console.log("Creating users...");
    db.exec(usersSchema);

    console.log("Creating lfg_posts...");
    db.exec(lfgPostsSchema);

    console.log("Creating lfg_members...");
    db.exec(lfgMembersSchema);

    console.log("Creating user_levels...");
    db.exec(userLevels);

    console.log("Creating tickets...");
    db.exec(ticketsSchema);

    console.log("Creating achievements...");
    db.exec(achievementsSchema);

    console.log("✅ Database initialized.");
}

module.exports = initializeDatabase;