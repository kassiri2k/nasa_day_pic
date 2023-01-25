const https = require('https');
const Stream = require('stream').Transform;
const fs = require('fs');

// you can get the api with your own private key  on https://api.nasa.gov/ or use the api with the demo_key
api_link = 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY'


https.get(api_link, resp => {
    let data = ''

    //a chunk of data has been recieved
    resp.on('data', chunk => {
        data += chunk;
    })


    //the whole response has been received. Print it out
    resp.on('end', () => {
        let url = JSON.parse(data).hdurl;
        console.log(url)
        https.get(url, res => {
            console.log(res.headers)
            console.log(res.headers['content-type'], res.headers['content-length'])

            if (res.statusCode === 200 && res.headers['content-type'] == 'image/jpeg') {
                //create a stream
                let img = new Stream()
                res.on('data', chunk => {
                    img.push(chunk)
                });
                res.on('end', () => {
                    let filename = __dirname + '/apod.jpg';
                    fs.writeFileSync(filename, img.read())

                })
            }
        })

    })


    resp.on('error', err => {
        console.error(err)
    })
})