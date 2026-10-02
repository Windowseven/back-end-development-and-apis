import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ optionsSuccessStatus: 200 }));

app.use(express.static("public"));

app.get("/", (_req, res) => {
  res.sendFile(import.meta.dirname + "/views/index.html");
});

// Do not change code above this line

const parseDate = (value) => {
  if (/^\d+$/.test(value)) {
    return new Date(Number(value));
  }

  const asUtc = new Date(`${value} UTC`);

  return Number.isNaN(asUtc.getTime()) ? new Date(value) : asUtc;
};

const handleTimestamp = (req, res) => {
  const { date } = req.params;
  const parsed = date ? parseDate(date) : new Date();

  if (Number.isNaN(parsed.getTime())) {
    return res.json({ error: "Invalid Date" });
  }

  return res.json({ unix: parsed.getTime(), utc: parsed.toUTCString() });
};

app.get(["/api", "/api/:date"], handleTimestamp);

// Do not change code below this line

const PORT = 8000;
const listener = app.listen(PORT, "::1", function () {
  console.log("Your app is listening on port " + listener.address().port);
});
