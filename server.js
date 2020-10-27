const express = require("express");
const fs = require("fs");
const multer = require("multer");
const upload = multer();
const app = express();
const imgur = require("imgur");

imgur.setClientId(process.env.CLIENT_ID);

app.get('/*', (req, res) => {
  res.redirect("https://imh-client.glitch.me" + req.path);
});

app.post("/upload", upload.any(), async (req, res) => {
  imgur.uploadBase64(req.files[0].buffer.toString('base64')).then(function(json) {
    let url = json.data.link;
    url = url.split("/");
    url = url[url.length - 1];
      
    if(req.query.embed !== "true") {
      url += "/i";
    };
      
    return res.status(200).json({ data: { link: url } });
  }).catch(function(err) {
    console.error(err.message);
  });
});

app.listen(process.env.PORT, () => {
  console.log("IMH Online!");
});
