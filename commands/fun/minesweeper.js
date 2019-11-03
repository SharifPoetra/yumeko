const sessions = new Set();
const bombcount = ["<:onebomb:486677493311471627>", "<:twobomb:486677544817393694>", "<:threebomb:486677629253189632>", "<:fourbomb:486677668381720590>", "<:fivebomb:486677705702506497>", "<:sixbomb:486677776141647872>", "<:sevenbomb:486677830940491786>", "<:eightbomb:486677896216182806>"];
const alphabet = ["a", "b", "c", "d", "e", "f"];

exports.run = async (client, msg, args) => {
  if (sessions.has(msg.channel.id)) return msg.reply("Only 1 game may be occuring per channel");
  try {
    let board = [];
    let showboard = new Array(36).fill("⬜");
    const bombSize = Math.floor(Math.random() * 10);
    for (let i = 0; i < 36; i++) {
      board.push(i < bombSize ? "💣" : "⬛");
    }
    board = client.util.shuffle(board);
    board = client.util.chunk(board, 6);
    showboard = client.util.chunk(showboard, 6);
    const answered = [];
    let isNginjekBomb = false;
    let passes = 36 - bombSize;
    const message = await msg.channel.send("Loading board...");
    sessions.add(msg.channel.id);
    while (passes > 0 && !isNginjekBomb) {
      await message.edit(`
⬛🇦 🇧 🇨 🇩 🇪 🇫
${showboard.map((x, i) => `${i + 1}\u20E3${x.join(" ")}`).join("\n")}
			`);
      const filter = msgs => {
        const param = msgs.content.toLowerCase().split("");
        return param.length === 2 && alphabet.includes(param[0]) && parseInt(param[1], 10) < 7 && !answered.includes(param.join("")) && msgs.author.id === msg.author.id;
      };
      const response = await msg.channel.awaitMessages(filter, { max: 1, time: 30000 });
      if (!response.size) {
        await msg.reply("Sorry time is up!");
        for (let i = 0; i < board.length; i++) {
          for (let j = 0; j < board[i].length; i++) {
            if (board[i][j] === "💣") showboard[i][j] = "💣";
          }
        }
        await message.edit(`
⬛🇦 🇧 🇨 🇩 🇪 🇫
${showboard.map((x, i) => `${i + 1}\u20E3${x.join(" ")}`).join("\n")}
				`);
        isNginjekBomb = true;
        break;
      }
      const param = response.first().content.toLowerCase().split("");
      param[0] = alphabet.includes[param[0]];
      param[1] = parseInt(param[1], 10) - 1;
      if (board[param[1]][param[0]] === "💣") {
        for (let i = 0; i < board.length; i++) {
          for (let j = 0; j < board[i].length; i++) {
            if (board[i][j] === "💣") showboard[i][j] = "💣";
          }
        }
        await message.edit(`
⬛🇦 🇧 🇨 🇩 🇪 🇫
${showboard.map((x, i) => `${i + 1}\u20E3${x.join(" ")}`).join("\n")}
				`);
        isNginjekBomb = true;
      } else {
        const bombCount = getNearbyBomb(board, param[1], param[0]);
        if (!bombCount) showboard[param[1]][param[0]] = "⬛";
        else showboard[param[1]][param[0]] = bombcount[bombCount - 1];
        answered.push(response.first().content.toLowerCase());
        await message.edit(`
⬛🇦 🇧 🇨 🇩 🇪 🇫
${showboard.map((x, i) => `${i + 1}\u20E3${x.join(" ")}`).join("\n")}
				`);
      }
      passes--;
    }
    sessions.delete(msg.channel.id);
    if (isNginjekBomb) return message.edit(`💣 ${msg.author.toString()} dough bomb !\n\n ${message.content}`);
    return message.edit(`📣 ${msg.author.toString()} won !\n\n ${message.content}`);
  } catch (e) {
    sessions.delete(msg.channel.id);
    return msg.channel.send(`Oh no an error occured :( \`${e.message}\` try again later`);
  }
};

function getNearbyBomb(board, col, stack) {
  let count = 0;
  if (board[col + 1]) {
    const init = board[col + 1];
    if (init[stack] === "💣") count++;
    if (init[stack + 1] === "💣") count++;
    if (init[stack - 1] === "💣") count++;
  }
  if ([col][stack + 1] === "💣") count++;
  if ([col][stack - 1] === "💣") count++;
  if (board[col - 1]) {
    const init = board[col - 1];
    if (init[stack] === "💣") count++;
    if (init[stack + 1] === "💣") count++;
    if (init[stack - 1] === "💣") count++;
  }
  return count;
}

exports.conf = {
  aliases: [],
  clientPerm: "",
  authorPerm: ""
};

exports.help = {
  name: "minesweeper",
  description: "play minesweeper game",
  usage: "minesweeper",
  example: ["minesweeper"]
};
