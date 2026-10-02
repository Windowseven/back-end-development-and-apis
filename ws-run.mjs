import WebSocket from "ws";

const projectId = Number(process.argv[2]);
const ws = new WebSocket("ws://localhost:8080");
const send = (event, data = {}) => ws.send(JSON.stringify({ event, data }));

const deadline = setTimeout(() => {
  console.log("--- timeout ---");
  process.exit(1);
}, 120000);

let finished = false;
let lastLine = "";

ws.on("open", () => {
  send("connect");
  setTimeout(() => send("select-project", { id: projectId }), 800);
  setTimeout(() => send("run-tests"), 3000);
});

ws.on("message", raw => {
  const msg = JSON.parse(raw.toString());

  if (msg.event === "update-tests") {
    const tests = msg.data?.tests ?? [];
    if (!tests.length) return;
    const line = tests
      .map(t => `${t.testId}${t.isLoading ? "..." : t.passed ? " PASS" : " FAIL"}`)
      .join(" | ");
    if (line !== lastLine) {
      console.log(line);
      lastLine = line;
    }
    return;
  }

  if (msg.event === "handle-project-finish") {
    finished = true;
    console.log(">>> handle-project-finish");
  }
});

ws.on("close", () => {
  clearTimeout(deadline);
  console.log(finished ? "RESULT: finished" : "RESULT: no finish event");
  process.exit(finished ? 0 : 1);
});