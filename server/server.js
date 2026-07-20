const express = require('express');
const app = express();
const port = 3000;

app.get('/api/usage', (req, res) => {
  res.json({
    "geminiPro": {
      "monthly": 150,
      "daily": 5,
      "lastUsed": "2025-08-05T10:00:00.000Z",
      "totalUsed": 1500,
      "history": []
    },
    "veo": {
        "monthly": 20,
        "daily": 1,
        "lastUsed": "2025-08-05T11:00:00.000Z",
        "totalUsed": 200,
        "history": []
    },
    "imagen3": {
        "monthly": 50,
        "daily": 2,
        "lastUsed": "2025-08-05T12:00:00.000Z",
        "totalUsed": 500,
        "history": []
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});