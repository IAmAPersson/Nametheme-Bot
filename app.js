const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client();
const config = require("./config.json");

client.on("ready", () =>
{
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    client.user.setGame("a game.");
});

client.on("guildCreate", guild =>
{
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild =>
{
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});

client.on("message", async message =>
{
    console.log(message.author + ": " + message.content);
    if (message.author.bot) return;

    if (message.content === "<@!359138435203596291>" || message.content === "<@359138435203596291>") {
        message.channel.send("What's up " + message.author);
    }
    else if (message.content.includes("69") && message.content.match(/<:[a-zA-Z0-9_]+:[0-9]*69[0-9]*>/g) === null && message.content.match(/<@!?[0-9]*69[0-9]*>/g) === null && message.content.match(/<#[0-9]*69[0-9]*>/g) === null && !message.content.includes("http"))
    {
        let outstr = "I spotted a 69 in your message:\n";
        outstr += message.content.split("69")[0] + "**69**" + message.content.split("69").slice(1).join("69") + "\n";
        outstr += "Nice!";
        message.channel.send(outstr);
    }

	if (message.content.substring(10) === "!nametheme")
	{
		const command = message.content.split(" ");
		if (command[1] == "set")
        {
            nametheme.writeFileSync("nametheme.txt", command.splice(2).join(" "));
            let message = "Name theme set to: " + nametheme.readFileSync("nametheme.txt");
            this.message.channel.send(message);
            this.client.channels.get("525945106193448970").send(message);
        }
        else
            this.message.channel.send("Current theme: " + nametheme.readFileSync("nametheme.txt"));
	}
});

client.login(config.token);
