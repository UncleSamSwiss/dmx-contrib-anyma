const EventEmitter = require('events').EventEmitter;
const usb = require('usb');

// These constants specify the Anyma uDMX device
const VENDOR_ID = 0x16c0;
const PRODUCT_ID = 0x5dc;

const UNIVERSE_LEN = 512;

function Anyma(deviceId = undefined, options = {}) {
  this.universe = Buffer.alloc(UNIVERSE_LEN);
  this.readyToWrite = true;
  this.interval = 1000 / (options.dmx_speed || 33);

  if (!deviceId) {
    this.device = usb.findByIds(VENDOR_ID, PRODUCT_ID);
  } else {
    const devices = usb
      .getDeviceList()
      .filter((d) => d.deviceDescriptor.idVendor === VENDOR_ID && d.deviceDescriptor.idProduct === PRODUCT_ID);
    if (deviceId.hasOwnProperty('busNumber') && deviceId.hasOwnProperty('deviceAddress')) {
      this.device = devices.find((d) => d.busNumber == deviceId.busNumber && d.deviceAddress == deviceId.deviceAddress);
    } else {
      this.device = devices[deviceId];
    }
  }
  if (!this.device) {
    throw new Error(`Couldn't find Anyma uDMX dongle for deviceId=${JSON.stringify(deviceId)}`);
  }
  this.device.open();
  this.start();
}

Anyma.prototype.start = function () {
  this.timeout = setInterval(() => {
    this.sendUniverse();
  }, this.interval);
};

Anyma.prototype.stop = function () {
  clearInterval(this.timeout);
};

Anyma.prototype.close = (cb) => {
  this.device.close();
  cb(null);
};

Anyma.prototype.update = function (u, extraData) {
  for (const c in u) {
    this.universe[c - 1] = u[c];
  }

  this.emit('update', u, extraData);
};

Anyma.prototype.updateAll = function (v, _) {
  for (let i = 0; i < UNIVERSE_LEN; i++) {
    this.universe[i] = v;
  }
};

Anyma.prototype.get = function (c) {
  return this.universe[c - 1];
};

Anyma.prototype.sendUniverse = function () {
  if (!this.readyToWrite) {
    return;
  }
  this.readyToWrite = false;
  this.device.controlTransfer(0x40, 0x0002, UNIVERSE_LEN, 0, this.universe, (error) => {
    this.readyToWrite = true;
    if (error) {
      console.warn(error);
    }
  });
};

util.inherits(Anyma, EventEmitter);

module.exports = Anyma;
