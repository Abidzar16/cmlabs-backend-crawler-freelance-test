const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const bodyParser = require('body-parser')
const fs = require('fs')

const app = express()
const port = 3000
var jsonParser = bodyParser.json()

// make folder results accessible using express
app.use('/results', express.static('results'))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/api/url', jsonParser, function (req, res) {

  // fetch url from json body
  const url = req.body.url

  // extract domain name from url
  // for instance: https://cmlabs.co -> cmlabs
  const domain = url.split('/')[2].split('.')[0]

  // generate uuid (mix of numbers and letters) for 8 characters
  // for instance: 1234abcd
  const uuid = Math.random().toString(36).substring(2, 10)

  axios.get(url)
  .then(response => {
    const $ = cheerio.load(response.data);
    const html = $('html').html();

    file_name = `results/${domain}_${uuid}.html`
    fs.writeFile(file_name, html, err => {
      if (err) throw err;
      console.log('The file has been saved!');
    });

    //return response showing successfull message and the html location (include url)
    res.json({ message: 'Success', html: `/${file_name}` });
  })
  .catch(err => {
    console.log(err);
    res.json({ message: 'Failed', html: '' });
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
