const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");

// app.use(express.static("public"));

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/views/index.html");
// });

// Read
app.get("/honapok", (req, res) => {
  fs.readFile("./data/honapok.json", (err, file) => {
    res.send(JSON.parse(file));
  });
});

// Read by name
app.get("/honapok/:egyediAzonosito", (req, res) => {
  const name = req.params.egyediAzonosito;

  fs.readFile("./data/honapok.json", (err, file) => {
    const honapok = JSON.parse(file);
    const honapByName = honapok.find((honap) => honap.name === name);

    if (!honapByName) {
      res.status(404);
      res.send({ error: `name: ${name} not found` });
      return;
    }

    res.send(honapByName);
  });
});

// Create
app.post("/honapok", bodyParser.json(), (req, res) => {
  const newHonap = {
    name: sanitizeString(req.body.name),
    evszak: req.body.evszak,
    photoUrl: req.body.photoUrl,
    leiras: req.body.leiras
  };

  fs.readFile("./data/honapok.json", (err, file) => {
    const honapok = JSON.parse(file);
    honapok.push(newHonap);
    fs.writeFile("./data/honapok.json", JSON.stringify(honapok), (err) => {
      res.send(newHonap);
    });
  });
});

// Update
app.put("/honapok/:egyediAzonosito", bodyParser.json(), (req, res) => {
  const id = req.params.egyediAzonosito;

  fs.readFile("./data/honapok.json", (err, file) => {
    const honapok = JSON.parse(file);
    const honapIndexById = honapok.findIndex((honap) => honap.name === name);

    if (honapIndexById === -1) {
      res.status(404);
      res.send({ error: `id: ${id} not found` });
      return;
    }

    const updatedHonap = {
        name: sanitizeString(req.body.name),
        evszak: req.body.evszak,
        photoUrl: req.body.photoUrl,
        leiras: req.body.leiras
    };

    honapok[honapIndexById] = updatedHonap;
    fs.writeFile("./data/honapok.json", JSON.stringify(honapok), () => {
      res.send(updatedHonap);
    });
  });
});

// Delete
app.delete("/honapok/:egyediAzonosito", (req, res) => {
  const name = req.params.egyediAzonosito;

  fs.readFile("./data/honapok.json", (err, file) => {
    const honapok = JSON.parse(file);
    const honapIndexById = honapok.findIndex((honap) => honap.name === name);

    if (honapIndexById === -1) {
      res.status(404);
      res.send({ error: `name: ${name} not found` });
      return;
    }

    honapok.splice(honapIndexById, 1);
    fs.writeFile("./data/honapok.json", JSON.stringify(honapok), () => {
      res.send({ id: id });
    });
  });
});

app.listen(9000);

function sanitizeString(str) {
    str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, "");
    return str.trim();
}