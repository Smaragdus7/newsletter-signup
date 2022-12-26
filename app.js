const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

const port = 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html')
})

app.post('/', (req, res) => {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const mail = req.body.email;

    const data = {
        members: [
            {
                email_address: mail,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }

            }
        ]
    };

    const jasonData = JSON.stringify(data);

    const mailchimpApiKey = "6d8f3abb4b53e5b1797a5645ffc3e324-us10";
    const listId = "0075791ba5";
    const url ="https://us10.api.mailchimp.com/3.0/lists/"+listId;
    const options = {
        method: "POST",
        auth: "claudia1:"+mailchimpApiKey,
    }

    const request = https.request(url, options, function(response){
        if(response.statusCode === 200){
            res.sendFile(__dirname + '/success.html')
        }
        else{
            res.sendFile(__dirname + '/failure.html')
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jasonData);
    request.end();
})

app.post('/failure', (req, res) => {
    res.redirect('/');
})
  
app.listen(process.env.PORT || port, () => {
    console.log(`Server is running on port ${port}`)
})