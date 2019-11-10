const { RichEmbed } = require("discord.js");
const { chunk, shuffle, randomRange } = require("../../handle/util.js");
const bombcount = ["<:onebomb:486677493311471627>", "<:twobomb:486677544817393694>", "<:threebomb:486677629253189632>", "<:fourbomb:486677668381720590>", "<:fivebomb:486677705702506497>", "<:sixbomb:486677776141647872>", "<:sevenbomb:486677830940491786>", "<:eightbomb:486677896216182806>"];
const sessions = new Set();

module.exports.run = async (client, msg) => {
  if (sessions.has(msg.channel.id)) return msg.channel.send("❌ | This game already played in this channel.");
  sessions.add(msg.channel.id);
  try {
    let table = createTable();
    const now = Date.now();
    let mess = null;
    let isDoughBomb = false;
    let escaped = 0;
    let passes = 0;
    while (escaped < 36 - table.bombCount && !isDoughBomb) {
      const embed = new RichEmbed()
        .setColor("BLUE")
        .setDescription(parseTable(table));
      if (!mess || passes % 4 === 0) {
        if (mess) await mess.delete();
        mess = await msg.channel.send(`${msg.author}, please response with colum and line. *e.g: A4*, for flagging just passing suffix **F** *e.g: A4F*`, { embed });
      } else { await mess.edit(`${msg.author}, please response with colum and line. *e.g: A4*, for flagging just passing suffix **F** *e.g: A4F*`, { embed }); }
      const filter = m => {
        const alphabet = ["a", "b", "c", "d", "e", "f"];
        const num = ["1", "2", "3", "4", "5", "6"];
        const [colum, line] = m.content.toLowerCase().split("");
        if (!alphabet.includes(colum) || !num.includes(line)) return false;
        if (table[post(line || "")][post(colum || "")].isDough) return false;
        if (m.content.length > 2 && m.content[2].toLowerCase() !== "f") return false;
        return true;
      };
      const response = await msg.channel.awaitMessages(filter, {
        max: 1,
        time: 30000
      });
      if (!response.size) {
        await msg.channel.send(`⏱️ | ${msg.author}, you took to long to response. ended game`);
        break;
      }
      const [colum, line, flag] = response.first().content.toUpperCase().split("").map((x, i) => i > 1 ? Boolean(x) : post(x));
      if (flag) {
        table[line][colum].isFlaged = true;
        passes++;
        continue;
      }
      table[line][colum].type === "bomb" ? isDoughBomb = true : escaped++;
      table = dig(table, colum, line);
      passes++;
    }
    sessions.delete(msg.channel.id);
    await mess.delete();
    if (!isDoughBomb && escaped < 36 - table.bombCount) return;
    const embed = new RichEmbed()
      .setColor(isDoughBomb ? "RED" : "GREEN")
      .setDescription(parseTable(table));
    return msg.channel.send(`${isDoughBomb ? "❌" : "✅"} | ${msg.author}, you ended the match${isDoughBomb ? " with dug a bomb " : " "}in ${parseTime(Date.now() - now)}`, { embed });
  } catch (e) {
    sessions.delete(msg.channel.id);
    throw e;
  }
};

function dig(table, colum, line) {
  const init = table[line][colum];
  if (init.type === "bomb") {
    for (let i = 0; i < 6; i++) {
      for (let ii = 0; ii < 6; ii++) {
        if (table[i][ii].type === "floor") continue;
        table[i][ii].isDough = true;
      }
    }
  }
  table[line][colum].isDough = true;
  table[line][colum].isFlaged = false;
  if (!init.count && (init.type === "floor")) {
    const finalize = (x, y) => {
      table[y][x].isDough = true;
      table[y][x].isFlaged = false;
      if (!table[y][x].count) table = dig(table, x, y);
    };
    if (
      table[line + 1] &&
      !table[line + 1][colum].isDough &&
      table[line + 1][colum].type === "floor"
    ) { finalize(colum, line + 1); }
    if (
      table[line - 1] &&
      !table[line - 1][colum].isDough &&
      table[line - 1][colum].type === "floor"
    ) { finalize(colum, line - 1); }
    if (
      table[line][colum + 1] &&
      !table[line][colum + 1].isDough &&
      table[line][colum + 1].type === "floor"
    ) { finalize(colum + 1, line); }
    if (
      table[line][colum - 1] &&
      !table[line][colum - 1].isDough &&
      table[line][colum - 1].type === "floor"
    ) { finalize(colum - 1, line); }
  }
  return table;
}

function createTable() {
  let table = [];
  const bombCount = randomRange(8, 13);
  for (let i = 0; i < 36; i++) {
    table.push({
      type: i < bombCount ? "bomb" : "floor",
      isFlaged: false,
      isDough: false,
      count: 0
    });
  }
  table = shuffle(table);
  table = chunk(table, 6);
  table.bombCount = bombCount;
  for (let x = 0; x < 6; x++) {
    for (let y = 0; y < 6; y++) {
      if (table[x][y].type === "bomb") continue;
      if (table[x + 1] && table[x + 1][y].type === "bomb") table[x][y].count++;
      if (table[x - 1] && table[x - 1][y].type === "bomb") table[x][y].count++;
      if (table[x][y + 1] && table[x][y + 1].type === "bomb") { table[x][y].count++; }
      if (table[x][y - 1] && table[x][y - 1].type === "bomb") { table[x][y].count++; }
      if (table[x + 1]) {
        if (table[x + 1][y + 1] && table[x + 1][y + 1].type === "bomb") { table[x][y].count++; }
        if (table[x + 1][y - 1] && table[x + 1][y - 1].type === "bomb") { table[x][y].count++; }
      }
      if (table[x - 1]) {
        if (table[x - 1][y + 1] && table[x - 1][y + 1].type === "bomb") { table[x][y].count++; }
        if (table[x - 1][y - 1] && table[x - 1][y - 1].type === "bomb") { table[x][y].count++; }
      }
    }
  }
  return table;
}

function parseTable(table) {
  let result = "⬛🇦 🇧 🇨 🇩 🇪 🇫";
  const numbers = "1⃣ 2⃣ 3⃣ 4⃣ 5⃣ 6⃣".split(" ");
  const getEmo = piece => {
    if (piece.isFlaged) return "🚩";
    if (!piece.isDough) return "⬜";
    if (piece.count) return bombcount[piece.count - 1];
    return piece.type === "bomb" ? "💣" : "⬛";
  };
  for (let i = 0; i < 6; i++) { result += `\n${numbers[i]}${table[i].map(getEmo).join(" ")}`; }
  return result;
}

function post(inpt) {
  return ({ A: 1, B: 2, C: 3, D: 4, E: 5, F: 6 }[inpt.toUpperCase()] || parseInt(inpt, 10)) - 1;
}

function parseTime(ms) {
  if (ms >= 59999) return `${Math.round(ms / 60000)}m`;
  return `${ms}ms`;
}

module.exports.conf = {
  aliases: [],
  clientPerm: "",
  authorPerm: ""
};

module.exports.help = {
  name: "minesweeper",
  description: "play minesweeper game",
  usage: "minesweeper",
  example: ["minesweeper"]
};
