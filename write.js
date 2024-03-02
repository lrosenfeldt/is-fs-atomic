import * as fs from "node:fs/promises";
import { setTimeout as sleep } from "node:timers/promises";
import * as os from 'node:os';
import * as util from "node:util";

const { values, positionals } = util.parseArgs({
  args: process.argv.slice(2),
  strict: true,
  allowPositionals: true,
  tokens: false,
  options: {
    delay: {
      type: "string",
    },
    "chunk-size": {
      type: "string",
    },
    char: {
      type: "string",
    },
  },
});

const file = positionals.shift();
if (!file) {
  throw new Error("File argument is missing");
}
const chunkSize = parseInt(values["chunk-size"] ?? "32", 10);
if (!Number.isFinite(chunkSize)) {
  throw new Error("Bad argument for chunk size: " + values["chunk-size"]);
}
const delay = parseInt(values.delay ?? "500", 10);
if (!Number.isFinite(delay)) {
  throw new Error("Bad argument for delay: " + values.delay);
}
const char = values.char ?? 'o';

const fd = await fs.open(file, fs.constants.O_WRONLY);
const boofer = new Uint8Array(chunkSize).fill(char.charCodeAt(0));
boofer[chunkSize - 1] = os.EOL.charCodeAt(0);

for (let count = 0; count <= 20; count++) {
  const { bytesWritten } = await fd.write(
    boofer,
    0,
    chunkSize,
    count * chunkSize,
  );
  if (bytesWritten < chunkSize) {
    throw new Error("FAILED TO WRITE. BAD!");
  }
  await sleep(delay);
}
