import { exec } from "child_process";
import express, { Response } from "express";
import { createServer } from "https";
import dotenv from "dotenv";
import fs, { readFileSync } from "fs";
import sql3 from "sqlite3";
import DB_Config from "./src/utils/db";
import cors from "cors";
import multer from "multer";
import path from "path";



dotenv.config();

const upload = multer({ storage: multer.memoryStorage() })

const app = express();

app.use(express.static("public"));

app.use(cors({
  origin: "*"
}))

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

const sqlite3 = sql3.verbose();


const httpServer = createServer({
  key: readFileSync(process.env.PRIVATE_KEY_PATH as string),
  cert: readFileSync(process.env.FULLCHAIN_KEY_PATH as string),
}, app);


if (!fs.existsSync(`${process.cwd()}/config`)) fs.mkdirSync(`${process.cwd()}/config`);

let db = new sqlite3.Database(`${process.cwd()}/config/configuration.db`, (err) => {
  if (err) console.error("Configuration Initialization Failed", err.message);

  db.run("CREATE TABLE IF NOT EXISTS config (name TEXT, value TEXT)");


  db.serialize(function () {
    db.all("SELECT * FROM config WHERE name = \"SSL_STATUS\"", (error, rows: any[]) => {
      if (error) console.error({ message: "Error", details: "Getting configuration failed" })
      console.log(rows)
      if (!rows.length) {
        let stmt = db.prepare("INSERT INTO config VALUES(?,?)");

        stmt.run("SSL_STATUS", 'INITIAL');

        stmt.finalize();

      } else {
        let stmt = db.prepare("UPDATE config SET value = ? WHERE name = ?");

        stmt.run('READY', 'SSL_STATUS');

        stmt.finalize();
      }

    })
  })

})

app.set("db", db);

const DB = new DB_Config(db);

app.post("/access_code", async (req: any, res: Response) => {

  const { access_code } = req.body;

  let db: sql3.Database = app.get("db");

  try {

    let stmt = db.prepare("INSERT INTO config VALUES(?,?)");

    stmt.run("ACCESS_CODE", access_code);

    stmt.finalize();

    res.send({ message: "Done", details: "Access Code Saved" })

  } catch (error: any) {

    res.send({ message: "Error", details: error.message })

  }

});


app.get("/access_code", async (req: any, res: Response) => {

  try {

    const access_code = await DB.getValueByName("ACCESS_CODE");

    if (access_code.length) {
      res.send({
        message: "Done", details: {
          access_code: access_code[0].value
        }
      })
    } else {
      res.send({
        message: "Error",
        details: ""
      })
    }

  } catch (error: any) {

    res.send({ message: "Error", details: error.message });

  }

})

app.post("/uploadSsl", upload.fields([{ name: 'ca', maxCount: 1 }, { name: 'pk', maxCount: 1 }]), async (req: any, res: Response) => {

  try {

    if (!fs.existsSync("/etc/chaindirect")) fs.mkdirSync("/etc/chaindirect");

    fs.writeFileSync("/etc/chaindirect/fullchain.pem", Buffer.from(req.files['ca'][0].buffer).toString());

    fs.writeFileSync("/etc/chaindirect/privkey.pem", Buffer.from(req.files['pk'][0].buffer).toString());

    let db: sql3.Database = app.get("db");

    let stmt = db.prepare("UPDATE config SET value = ? WHERE name = ?");

    stmt.run('RESTART', 'SSL_STATUS');

    stmt.finalize();

    res.send({
      message: "Done",
      details: "SSL certificates saved"
    });

  } catch (error: any) {

    res.send({ message: "Error", details: error.message })

  }

});

app.get("/getSslStatus", async (req: any, res: Response) => {

  try {

    const status = await DB.getValueByName("SSL_STATUS");

    res.send({
      message: "Done",
      details: status[0].value
    })

  } catch (error: any) {

    res.send({ message: "Error", details: error.message })

  }

});

app.get("/restartServer", (req: any, res: Response) => {

  try {

    exec('/bin/bash docker restart client', (error, stdout, stderror) => {
      try {
        if (error) return res.send({ message: "Error", details: stderror, status: "error" });

        res.send({ message: "Done", details: stdout });
      } catch (error: Error | any) {
        res.status(500).send({ message: error.message })
      }
    })

  } catch (error: any) {

    res.send({ message: "Error", details: error.message })

  }

})

app.get("*", (req: any, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

httpServer.listen(process.env.PORT || 443, () => {
  console.log(`Listening on port ${process.env.PORT}`);
})


