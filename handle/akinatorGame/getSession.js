// credit: https://github.com/jgoralcz/aki-api

const request = require("node-superfetch");
const { patternSession } = require("./client");

const getSession = async () => {
  // request the new url
  const { text } = await request.get("https://en.akinator.com/game").catch(() => null);

  // use pattern matching to get the uid and frontaddr. It looks like:
  // var uid_ext_session = 'a7560672-6944-11e9-bbad-0cc47a40ef18';
  // var frontaddr = 'NDYuMTA1LjExMC40NQ==';
  if (text != null && text.match(patternSession)) {
    const uid = patternSession.exec(text)[1];
    const frontaddr = patternSession.exec(text)[2];
    return { uid, frontaddr };
  }
};

module.exports = getSession;
