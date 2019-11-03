const { RichEmbed } = require("discord.js");
const snek = require("node-superfetch");
const number = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣"];
const isPlayed = new Set();

class Akinator {

  constructor(url) {
    this.id = 0;
    this.signature = 0;
    this.step = 0;
    this.progression = 0;
    this.url = url;
  }

  async create(nsfw = false) {
    const { body } = await snek
      .get(`${this.url}/ws/new_session`)
      .query({
        partner: 1,
        player: "website-desktop",
        uid_ext_session: "5ba118d44e469",
        frontaddr: "MTc4LjMzLjIzMS45OA==",
        constraint: "ETAT<>'AV'",
        soft_constraint: nsfw ? "" : "ETAT='EN'",
        question_filter: nsfw ? "" : "cat=1",
        _: Date.now()
      });
    const data = body.parameters;
    if (!data) return undefined;
    this.id = data.identification.session;
    this.signature = data.identification.signature;
    this.step = 0;
    this.progression = Number.parseInt(data.step_information.progression, 10);
    return data.step_information;
  }

  async answer(num, nsfw = false) {
    const { body } = await snek
      .get(`${this.url}/ws/answer`)
      .query({
        session: this.id,
        signature: this.signature,
        step: this.step,
        answer: num,
        question_filter: nsfw ? "" : "cat=1",
        _: Date.now()
      });
    const data = body.parameters;
    if (!data) return undefined;
    this.step = Number.parseInt(data.step, 10);
    this.progression = Number.parseInt(data.progression, 10);
    return data;
  }

  async guess() {
    const { body } = await snek
      .get(`${this.url}/ws/list`)
      .query({
        session: this.id,
        signature: this.signature,
        step: this.step,
        size: 2,
        max_pic_width: 246,
        max_pic_height: 294,
        pref_photos: "VO-OK",
        duel_allowed: 1,
        mode_question: 0,
        _: Date.now()
      });
    if (!body.parameters) return undefined;
    return body.parameters.elements[0].element;
  }

}

exports.run = async (client, msg, args) => {
  if (isPlayed.has(msg.channel.id)) return msg.reply("Only one game may be occuring per channel");
  isPlayed.add(msg.channel.id);
  try {
    const akinator = new Akinator("https://srv2.akinator.com:9157");
    let ans = NaN;
    const thisMess = await msg.channel.send("Fetching... Aki");
    for (const num of number) {
      await thisMess.react(num);
    }
    while (akinator.progression < 95) {
      const data = isNaN(ans) ? await akinator.create(msg.channel.nsfw) : await akinator.answer(ans, msg.channel.nsfw);
      if (!data || !data.answers || akinator.step >= 80) break;
      thisMess.edit(fastEmbed(`
**${++data.step}.** ${data.question} (${Math.round(Number.parseInt(data.progression, 10))}%)
${data.answers.map((x, i) => `${number[i]} ${x.answer}`).join("\n")}
			`));
      const filter = (rect, usr) => number.includes(rect.emoji.name) && usr.id === msg.author.id;
      const response = await thisMess.awaitReactions(filter, { max: 1, time: 30000 });
      if (!response.size) {
        await msg.channel.send("Time is Up!");
        break;
      }
      ans = number.indexOf(response.first().emoji.name);
    }
    await thisMess.delete();
    isPlayed.delete(msg.channel.id);
    const guess = await akinator.guess();
    if (!guess) return msg.reply("Hmm... I seem to be having a bit of trouble. Check back soon!");
    const embed = new RichEmbed()
      .setColor("#F78B26")
      .setTitle(`I'm ${Math.round(guess.proba * 100)}% sure it's...`)
      .setDescription(`${guess.name}${guess.description ? `\n_${guess.description}_` : ""}`)
      .setImage(guess.absolute_picture_path);
    return msg.reply(embed);
  } catch (e) {
    isPlayed.delete(msg.channel.id);
    return msg.channel.send(`Oh no an error occured :( \`${e.message}\` try again later`);
  }
};

function fastEmbed(description, color = "#F78B26") {
  return new RichEmbed()
    .setColor(color)
    .setDescription(description);
}

exports.conf = {
  aliases: ["the-web-genie", "web-genie"],
  clientPerm: "EMBED_LINKS",
  authorPerm: ""
};

exports.help = {
  name: "akinator",
  description: "Think about a real or fictional character, I will try to guess who it is.",
  usage: "akinator",
  example: ["akinator"]
};
