Module.register("MMM-home-presence", {
  // Default module config.
  defaults: {
    IPMap: {
      "192.168.178.110": "Einstein",
      "192.168.178.28": "Guenther",
      "192.168.178.24": "Manfred"
    },
    notification: "",
    interval_ms: 100,
    debug: false
  },
  state: -1, // unknown device state, so will record the 1st time
  timer_handle: null,
  start: function() {
    // This object keeps track of configurated IP addresses and
    // their reachability. It's updated by the node helper.
    // Example: {"192.168.178.22": false, ...}
    this.presence = {};
    for (const key in this.config.IPMap) {
      this.presence[key] = false;
    }
    // Start socket communication and send configurated IP addresses
    // to node helper.
    this.config.presence = this.presence;
    this.sendSocketNotification("CONFIG", this.config);
  },
  getDom: function() {
    var table = document.createElement("table");
    let active=0
    for (const key in this.config.IPMap) {
      var row = document.createElement("tr");
      var name = document.createElement("td");
      name.innerHTML = this.config.IPMap[key];
      row.appendChild(name);

      let checkboxCell = row.insertCell(-1);
      let checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = this.presence[key];
      active |= 1 * this.presence[key]
      console.log("active =" + active + " device status=" + this.presence[key])
      checkboxCell.appendChild(checkbox);
      row.appendChild(checkboxCell);

      table.appendChild(row);
    }
    if (active !== this.state && this.config.notification !== "" && !this.timer_handle) {
      this.state = active 
      setTimeout(() => {        
        this.sendNotification(this.config.notification, this.state)
        this.timer_handle=null
      },2)
    }
    return table;
  },
  socketNotificationReceived: function(notification, payload) {
    if (notification === "PRESENCE_UPDATE") {
      this.presence = payload;
      this.updateDom();
    }
  }
});
