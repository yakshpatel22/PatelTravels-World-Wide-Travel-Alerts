//const { alertcollection } = require("./config");
import { alertcollection } from "./config";
import { Express } from "express";
import { Router } from "express";
import setupAlert from "./setupalerts.js";
import dbRtns from "./db_routines.js";
//const express = require("express");
//const router = express.Router();
//const dbRtns = require("./dbroutines");
//const setupAlert = require("./setupalerts");
router.get("/", async (req, res) => {
  try {
    let results = await setupAlert.loadDataFunction();
    res.status(200).send(results);
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("Could not execute setupalerts.js file.");
  }
});
module.exports = router;
