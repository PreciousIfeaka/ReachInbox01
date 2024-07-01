const express = require("express");
const scheduleRouter = express();
const startWorker = require("../scheduler/worker");
const scheduleJob = require("../scheduler/scheduler");


scheduleRouter.get("/emails", async (req, res) => {
  try {
    if (!req.session.tokens) {
      return res.redirect("/auth/google")
    }
    const resp = await startWorker(req.session.tokens);
    await scheduleJob().catch (error => {console.log(error)});
    res.send(resp.data);
  } catch(error) {
    res.status(400).send(error);
  }
});

module.exports = scheduleRouter;