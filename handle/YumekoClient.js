const { Client, Collection } = require("discord.js");
const modules = require("./module");
const wbListenMoe = require("./npMoe");

class yumekoClient extends Client {

  constructor(opt) {
    super(opt);

    this.commands = modules.commands;
    this.aliases = modules.aliases;
    this.helps = modules.helps;
    this.snek = require("node-superfetch");
    this.util = require("./util.js");
    this.queue = new Collection();
    this.logger = new (require("./logger"))();
    this.listenMOE = new Collection();
    this.radioInfo = {};
    this.radioInfoKpop = {};
    this.moeJP = new wbListenMoe(this, "wss://listen.moe/gateway_v2", "jpop");
    this.moeKR = new wbListenMoe(this, "wss://listen.moe/kpop/gateway_v2", "kpop");
    this.health = Object.seal({
      cpu: new Array(96).fill(0),
      prc: new Array(96).fill(0),
      ram: new Array(96).fill(0),
      cmd: new Array(96).fill(0)
    });
  }
  updateStats() {
    const { heapTotal, heapUsed } = process.memoryUsage();
    const { loadavg } = require("os");
    this.health.cpu.shift();
    this.health.cpu.push(((loadavg()[0] * 10000) | 0) / 100);

    this.health.prc.shift();
    this.health.prc.push(((100 * (heapTotal / 1048576)) | 0) / 100);

    this.health.ram.shift();
    this.health.ram.push(((100 * (heapUsed / 1048576)) | 0) / 100);

    this.health.cmd.shift();
    this.health.cmd.push(0);
  }

}

module.exports = yumekoClient;
