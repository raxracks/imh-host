const express = require("express");
const fs = require("fs");
const crypto = require("crypto");
const multer = require("multer");
const upload = multer();
const app = express();
const imgur = require("imgur");

imgur.setClientId(process.env.CLIENT_ID);

app.get('/*', (req, res) => {
  res.redirect("https://imh-client.glitch.me" + req.path);
});

app.post("/upload", upload.any(), async (req, res) => {
  let file = req.files[0];
    let path = "";
    imgur
      .uploadBase64(req.files[0].buffer.toString('base64'))
      .then(function(json) {
        let url = json.data.link;
        url = url.split("/");
        url = url[url.length - 1];
        return res
          .status(200)
          .json({ data: { link: url } });
      })
      .catch(function(err) {
        console.error(err.message);
      });
});

app.listen(process.env.PORT, () => console.log("IMH Online!"));
