const { CohereClient } = require('cohere-ai');
require("dotenv").config();

const cohere = new CohereClient({
  token: 'Your API key',
});

(async () => {
  const response = await cohere.chat({
		message: "hello world!"
  });

  console.log(response);
})();