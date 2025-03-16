const NodeHelper = require("node_helper");
const ping = require("ping");

module.exports = NodeHelper.create({
  debug: false,
  discover: function(presence, interval_ms) {
    const self = this;
    setInterval(function() {
      for (const ip in presence) {
        ping.promise.probe(ip)
          .then(function(res) {
            if (res.alive) {
              if (this.debug) {
                console.log(this.name + " device " + ip + " found")
              }
              presence[ip] = true;
            } else {
              if (this.debug) {
                console.log(this.name + " device " + ip + " NOT found")
              }
              presence[ip] = false;
            }
          });
      }
      self.sendSocketNotification("PRESENCE_UPDATE", presence);
    }, interval_ms);
  },
  socketNotificationReceived: function(notification, payload) {
    if (notification === "CONFIG") {
      this.debug= payload.debug
      this.discover(payload.presence, payload.interval_ms);
    };
  }
});
