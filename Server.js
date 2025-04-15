const express = require('express');
const crypto = require('crypto');
const app = express();
app.use(express.json());

const VERIFICATION_TOKEN = 'ZtYxWvUtSrQpOnMlKjHgFdSaReWqXyTuv';
const ENDPOINT_URL = 'https://ebay-webhook-gipf.onrender.com' //  update after deploy

app.get('/notify', (req, res) => {
  const challengeCode = req.query.challenge_code;
  if (!challengeCode) {
    return res.status(400).send('Missing challenge_code');
  }

  const hash = crypto.createHash('sha256');
  hash.update(challengeCode + VERIFICATION_TOKEN + ENDPOINT_URL);
  const challengeResponse = hash.digest('hex');

  res.json({ challengeResponse });
});

app.post('/notify', (req, res) => {
  console.log('Received account deletion notification:');
  console.log(req.body);

  const responseXML = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
      <soapenv:Body>
        <Ack>Success</Ack>
      </soapenv:Body>
    </soapenv:Envelope>`;
    
  res.set('Content-Type', 'application/xml');
  res.send(responseXML);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
