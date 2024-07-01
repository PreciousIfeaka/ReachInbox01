const IORedis = require("ioredis");
const { Queue } = require("bullmq");

const connection = new IORedis({
  maxRetriesPerRequest: null
});

const mailQueue = new Queue("mails", { connection });

async function scheduleJob() {
  await mailQueue.add(
    "fetchmails",
    { task: "fetchLatestEmail" },
    { repeat:
      { cron: "* * * * *" }
    }
  );
  console.log("This job is meant to run every minute");
}

module.exports = scheduleJob;