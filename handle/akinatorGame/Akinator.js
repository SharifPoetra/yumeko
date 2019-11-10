const snek = require("node-superfetch");
const getSession = require("./getSession");
const { jQuery } = require("./client");

module.exports = class Akinator {

  constructor(url) {
    this.id = 0;
    this.signature = 0;
    this.step = 0;
    this.progression = 0;
    this.url = url;
  }

  async create(nsfw = false) {
    const { uid, frontaddr } = await getSession();

    const { text } = await snek
      .get(`${this.url}/ws/new_session`)
      .query({
        callback: `${jQuery}${new Date().getTime()}`,
        partner: 1,
        player: "website-desktop",
        uid_ext_session: uid,
        frontaddr: frontaddr,
        constraint: "ETAT<>'AV'"
      });
    const finalize = [];
    let find = false;
    for (const word of text.split("")) {
      if (word === "{") find = true;
      if (find) finalize.push(word);
    }
    finalize.pop();

    const data = JSON.parse(finalize.join("")).parameters;
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

};
