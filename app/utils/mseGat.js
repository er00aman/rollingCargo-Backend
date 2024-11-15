// const httpRequest = require('https');

// const options = {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'multipart/form-data; boundary=BOUNDARY'
//   },
// };

// const data = `--BOUNDARY
// Content-Disposition: form-data; name="Aiwa"

// userName
// --BOUNDARY
// Content-Disposition: form-data; name="8B7A0A8CF872DD94CF4B5F6EB6F70C73"

// apiKey
// --BOUNDARY--
// `;

// const request = httpRequest.request('https://www.msegat.com/gw/Credits.php', options, response => {
//   console.log('Status', response.statusCode);
//   console.log('Headers', response.headers);
//   let responseData = '';

//   response.on('data', dataChunk => {
//     responseData += dataChunk;
//   });
//   response.on('end', () => {
//     console.log('Response: ', responseData)
//   });
// });

// request.on('error', error => console.log('ERROR', error));

// request.write(data);
// request.end();



// ___________- SEND SMS - _____________

// const httpRequest = require('https');

// const options = {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json'
//   },
// };

// const data = `{
//   "userName": "Aiwa",
//   "numbers": "+918604495968",
//   "userSender": "aiwa",
//   "apiKey": "8B7A0A8CF872DD94CF4B5F6EB6F70C73",
//   "msg": "Hi Your O.T.P is  : ---> 1234"
// }`;

// const request = httpRequest.request('https://www.msegat.com/gw/sendsms.php', options, response => {
//   console.log('Status', response.statusCode);
//   console.log('Headers', data);
//   let responseData = '';

//   response.on('data', dataChunk => {
//     responseData += dataChunk;
//   });
//   response.on('end', () => {
//     console.log('Response: ', responseData)
//   });
// });

// request.on('error', error => console.log('ERROR', error));

// request.write(data);
// request.end();


const httpRequest = require('https');

exports.sendSMS = async(mobileNumber, message)=> {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
  };

  const data = JSON.stringify({
    userName: "Aiwa",
    numbers: mobileNumber,
    userSender: "AIWA",
    apiKey: "8B7A0A8CF872DD94CF4B5F6EB6F70C73",
    msg: message
  });

  const request = httpRequest.request('https://www.msegat.com/gw/sendsms.php', options, response => {
    console.log('Status', response.statusCode);
    console.log('Data : ', data)
    let responseData = '';

    response.on('data', dataChunk => {
      responseData += dataChunk;
    });

    response.on('end', () => {
      console.log('Response: ', responseData);
    });
  });

  request.on('error', error => {
    console.log('ERROR', error);
  });

  request.write(data);
  request.end();
}
