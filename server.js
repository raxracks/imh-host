const express = require('express');
const fs = require('fs');
const multer = require('multer');
const upload = multer();
const app = express();
const imgur = require('imgur');
const jsonfile = require('jsonfile');

app.enable('trust proxy');
app.use(function(request, response, next) {
  if (process.env.NODE_ENV != 'development' && !request.secure) {
    response.redirect("https://" + request.headers.host + request.url) 
  } 
  next();
});

imgur.setClientId(process.env.CLIENT_ID);

app.get('/', (req, res) => {
  res.send("IMH UP");
});

app.get('/stats', (req, res) => {
  let stats = jsonfile.readFileSync("stats.json");
  res.send(stats.uploads.toString());
});

app.get('/*', (req, res) => {
  res.redirect("https://imh.herokuapp.com" + req.path);
});

app.post("/upload", upload.any(), async (req, res) => {
  imgur.uploadBase64(req.files[0].buffer.toString('base64')).then(function(json) {
    let url = json.data.link;
    url = url.split("/");
    url = url[url.length - 1];
        
    if(req.query.embed !== "true") {
      url = "i/" + url;
    };
      
    let stats = jsonfile.readFileSync("stats.json");
    stats["uploads"]++;
    jsonfile.writeFileSync("stats.json", stats);
    
    return res.status(200).json({ data: { link: url } });
  }).catch(function(err) {
    console.error(err.message);
  });
});

app.listen(process.env.PORT, () => {
  console.log("IMH Online!");
});
