const fs = require("fs");
const upload = require("multer")();
const app = require("express")();
const imgur = require("imgur");
const jsonfile = require("jsonfile");
const cors = require("cors");
const fetch = require("node-fetch");
const magic =
  " ||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​|| ";
const client = "https://imh.glitch.me";

app.use(cors());

imgur.setClientId(process.env.CLIENT_ID);

app.get("/", (req, res) => {
  res.send("IMH UP");
});

app.get("/stats/:type", (req, res) => {
  let stats = jsonfile.readFileSync("stats.json");
  res.send(stats[req.params.type].toString());
});

app.get("/stats/:type/add", (req, res) => {
  let amount = Math.floor(req.query.amount);
  let stats = jsonfile.readFileSync("stats.json");
  let statsBackup = jsonfile.readFileSync("statsBackup.json");
  stats[req.params.type] += Math.floor(amount);
  if (stats[req.params.type] < statsBackup[req.params.type]) {
    stats = statsBackup;
  } else {
    jsonfile.writeFileSync("statsBackup.json", stats);
  }
  jsonfile.writeFileSync("stats.json", stats);
  res.send("Done");
});

app.get("/*", (req, res) => {
  res.redirect(client + req.path);
});

app.post("/upload", upload.any(), async (req, res) => {
  imgur
    .uploadBase64(req.files[0].buffer.toString("base64"))
    .then(function(json) {
      let url = json.link;
      url = url.split("/");
      url = url[url.length - 1];

      if (req.query.embed !== "true") {
        url = "i/" + url;
      }

      if (req.query.message !== undefined) {
        url += "/m/" + encodeURI(req.query.message);
      }

      if (req.query.frontend == "true") {
        res.redirect(url);
      }

      if (req.query.customURL) {
        url = `<${req.query.customURL}/${url.split("/m/")[0]}>${magic}https://imh.glitch.me/${url}`;
      }

      fetch(
        "https://imh-host.glitch.me/stats/uploads/add?amount=1"
      );
    
      fetch(
        "https://imh-host.glitch.me/stats/size/add?amount=" + req.files[0].size
      );

      return res.status(200).json({ data: { link: url } });
    })
    .catch(function(err) {
      console.error(err.message);
    });
});

app.listen(process.env.PORT, () => {
  console.log("IMH Online!");
});
