const { Worker } = require("bullmq");
const IORedis = require("ioredis");
const axios = require("axios");
const { emails } = require("../router/google.router");

const connection = new IORedis({
  maxRetriesPerRequest: null
});

async function startWorker(session) {
  const worker = new Worker(
    "mails",
    async (job) => {
      if (job.name === "fetchmails") {
        const { task } = job.data;
        console.log(task);
        if (task === "fetchLatestEmail") {
          await emails(session);
        }
      }
      else {
        console.log("nothing");
      }
    },
    { connection }
  );
  
  worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
  });
  
  worker.on("failed", (job, error) => {
    console.log(`Job ${job.id} failed with ${error.message}`);
  });
}

module.exports = startWorker;