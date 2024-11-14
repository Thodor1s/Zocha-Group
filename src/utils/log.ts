const newLog = 'newLog';

const success = 'success'; //[200]
const multipleOptions = 'multipleOptions'; //[300]

const validation = 'validation'; //[400?]
const validRequest = 'validRequest'; //[!400]
const invalidRequest = 'invalidRequest'; //[400]

const searching = 'searching'; //[404?]
const found = 'found'; //[!404]
const notFound = 'notFound'; //[404]

const connection = 'connection'; //[500?]
const connected = 'connected'; //[!500]
const disconnected = 'disconnected'; //[500]

const queryError = 'queryError'; //[590]
const greekTimeOptions = { timeZone: 'Europe/Athens' };

//TODO add logs

async function log(
  endpoint : string, //in "POST /XXXX" from
  type : string, //in "validation" form
  data : any, // optional, when applicable
  extraMsg : string // optional, when applicable
) {
  const Log = (msg : string) => {
    console.log(
      endpoint +
        ' ' +
        msg +
        (extraMsg ? extraMsg : '') +
        ' ' +
        (data ? JSON.stringify(data) : '')
    );
  };

  switch (type) {
    // For each new log in API usage, include date, time, and path (new line).
    case newLog:
      // console.log('');
      console.log(
        `-----[${new Date().toLocaleString(
          'en-GB',
          greekTimeOptions
        )}] New request ${endpoint}`
      );
      break;

    // 200
    case success:
      Log('Success [200]');
      break;

    // 300
    case multipleOptions:
      Log('Multiple Options [300]');
      break;

    // 400
    case validation:
      Log('Validating: ');
      break;
    case validRequest:
      Log('The Request is Valid');
      break;
    case invalidRequest:
      Log('The Request is Invalid [400]');
      break;

    // 404
    case searching:
      Log('Searching for: ');
      break;
    case found:
      Log('Found: ');
      break;
    case notFound:
      Log('Not Found [404]: ');
      break;

    // 500
    case connection:
      Log('Connecting to Database...');
      break;
    case connected:
      Log('Connected!');
      break;
    case disconnected:
      Log('Not Connected to Database :(');
      break;

    // 590
    case queryError:
      Log('Query error [590] : ');
      break;
  }
}

module.exports = {
  log,
  newLog,
  success,
  multipleOptions,
  validation,
  validRequest,
  invalidRequest,
  searching,
  found,
  notFound,
  connection,
  connected,
  disconnected,
  queryError,
};
