const serverOn = 'serverOn'; //[SRV]

const websocketOn = 'websocketOn'; //[WSO]
const websocketOff = 'websocketOff'; //[WSX]

const cronjob = 'cronjob' //[CRON]

const success = 'success'; //[200]

const validation = 'validation'; //[400?]
const validRequest = 'validRequest'; //[!400]
const invalidRequest = 'invalidRequest'; //[400]

const searching = 'searching'; //[404?]
const found = 'found'; //[!404]
const notFound = 'notFound'; //[404]

const failure = 'failure'; //[500]

const connection = 'connection'; //[500?]
const connected = 'connected'; //[!500]
const disconnected = 'disconnected'; //[500]

const queryError = 'queryError'; //[590]
const greekTimeOptions = { timeZone: 'Europe/Athens' };

async function log(
  endpoint: string, //in "POST /XXXX" from
  type: string, //in "validation" form
  data: any, // optional, when applicable
  extraMsg: string // optional, when applicable
) {
  const Log = (msg: string) => {
    console.log(
      `[${new Date().toLocaleString('en-GB', greekTimeOptions)}] ` +
        (endpoint ? endpoint + ' ' : '') +
        msg +
        (extraMsg ? extraMsg : '') +
        ' ' +
        (data ? JSON.stringify(data) : '')
    );
  };

  switch (type) {
    // SRV
    case serverOn:
      Log('Server is up and running [SRV] ');
      break;

    // WSO WSX
    case websocketOn:
      Log('A Frontend connected [WSO] ');
      break;
    case websocketOff:
      Log('A Frontend disconnected [WSX] ');
      break;

    // CRON
    case cronjob:
      Log('Polling... [CRON] ');
      break;

    // 200
    case success:
      Log('Success [200] ');
      break;

    // 404
    case notFound:
      Log('Not Found [404] ');
      break;

    // 500
    case connection:
      Log('Connecting to Database... [DBC] ');
      break;
    case connected:
      Log('Connected! [DBO] ');
      break;
    case disconnected:
      Log('Could not connected to Database [500] ');
      break;
    case failure:
      Log('Internal Server Error [500] ');
      break;
  }
}

export {
  log,
  serverOn,
  websocketOn,
  websocketOff,
  cronjob,
  success,
  validation,
  validRequest,
  invalidRequest,
  searching,
  found,
  notFound,
  connection,
  connected,
  disconnected,
  failure,
  queryError,
};
