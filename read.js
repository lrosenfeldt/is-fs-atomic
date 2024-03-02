import * as fs from "node:fs/promises";
import { setTimeout as sleep } from 'node:timers/promises';
import * as util from 'node:util';


const { values, positionals } = util.parseArgs({
  args: process.argv.slice(2),
  strict: true,
  allowPositionals: true,
  tokens: false,
  options: {
    delay: {
      type: 'string',
    },
    'chunk-size': {
      type: 'string',
    },
  },
});

const file = positionals.shift();
if (!file) {
  throw new Error('File argument is missing');
}
const chunkSize = parseInt(values["chunk-size"] ?? '32', 10);
if (!Number.isFinite(chunkSize)) {
  throw new Error('Bad argument for chunk size: ' + values["chunk-size"]);
}
const delay = parseInt(values.delay ?? '500', 10);
if (!Number.isFinite(delay)) {
  throw new Error('Bad argument for delay: ' + values.delay);
}


const decoder = new TextDecoder('utf-8');
const fd = await fs.open(file, fs.constants.O_SYNC);
const boofer = new Uint8Array(chunkSize);

for (let count = 0;;) {
  const { bytesRead } = await fd.read(boofer, 0, chunkSize, count * chunkSize);
  if (bytesRead < chunkSize) {
    count = 0;
  } else {
    count++;
  }
  const s = decoder.decode(boofer, { stream: true });
  console.log(count.toString() + ':', s);
  await sleep(delay);
}
