# dmx-contrib-anyma

Driver for NodeJS [dmx](https://www.npmjs.com/package/dmx) module supporting Anyma uDMX.

## Requirements

You need to have an Anyma uDMX compatible USB adapter. Buy one at one of the following sources:

- [Official Anyma Store](http://www.anyma.ch/store/11-udmx.html)
- [Clones found on Aliexpress](https://www.aliexpress.com/wholesale?SearchText=USB+dmx)

_IMPORTANT_ The author of this driver is not related to any of the above companies and does not take any responsibility for the proper working of the hardware bought at those links!

## Usage

To use this driver with the [dmx](https://www.npmjs.com/package/dmx) module, you need to register it as a driver:

```javascript
// load the DMX module
const dmx = require('dmx');

// register this driver module
dmx.registerDriver('anyma', require('dmx-contrib-anyma'));
```

To add a universe using the driver, you need to call:

```javascript
dmx.addUniverse(
  'my-device', // this can be an arbitrary string
  'anyma', // this must be the same string as used in registerDriver() above
  device_id, // (optional) see below for possible values
  options, // (optional) see below for possible options
);
```

The following values are possible for `device_id`:

- `undefined`: the first Anyma device found will be used
- `3`: the fourth (indexed from zero) Anyma device found will be used
- `{ busNumber: 1, deviceAddress: 5 }`: the device at bus number 1 and with address 5 will be used

The following properties are used from the `options` object:

- `dmx_speed`: updates per second (in Hz), default: `33` (= 30 ms refresh interval)
