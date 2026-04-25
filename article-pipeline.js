const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const OUTPUT_DIR = path.join(ROOT, 'output');
const QUEUE_PATH = path.join(OUTPUT_DIR, 'article-queue.json');
const LOCK_PATH = path.join(OUTPUT_DIR, '.article-pipeline.lock');
const REPORT_PATH = path.join(OUTPUT_DIR, 'article-pipeline-report.json');

function now() {
  return new Date().toISOString();
}

function log(step, msg) {
  console.log(`[${now()}] [${step}] ${msg}`);
}

// ✅ Ensure output directory exists
function ensureOutput() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

// ✅ Safe module loader (prevents crash)
function loadGenerator() {
  const generatorPath = path.join(ROOT, 'article-generator.js');

  if (!fs.existsSync(generatorPath)) {
    throw new Error(
      `Missing file: ${generatorPath}\nFix: create article-generator.js in repo root`
    );
  }

  const mod = require(generatorPath);

  if (!mod.writeArticle) {
    throw new Error(`article-generator.js must export writeArticle()`);
  }

  return mod.writeArticle;
}

// ✅ Lock system
function acquireLock() {
  if (fs.existsSync(LOCK_PATH)) {
    throw new Error('Pipeline lock exists. Another run is already active.');
  }

  fs.writeFileSync(
    LOCK_PATH,
    JSON.stringify({ pid: process.pid, startedAt: now() }, null, 2)
  );

  process.on('exit', releaseLock);
  process.on('SIGINT', () => { releaseLock(); process.exit(1); });
  process.on('SIGTERM', () => { releaseLock(); process.exit(1); });
}

function releaseLock() {
  try {
    if (fs.existsSync(LOCK_PATH)) fs.unlinkSync(LOCK_PATH);
  } catch {}
}

// ✅ Auto-create queue if missing
function loadQueue() {
  if (!fs.existsSync(QUEUE_PATH)) {
    log('INIT', 'Queue file missing, creating default queue');

    const defaultQueue = [
      { keyword: 'emergency cash options', status: 'pending' },
      { keyword: 'small personal loans', status: 'pending' }
    ];

    fs.writeFileSync(QUEUE_PATH, JSON.stringify(defaultQueue, null, 2));
    return defaultQueue;
  }

  return JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
}

function saveQueue(queue) {
  fs.writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2));
}

// ✅ Process one item safely
function processOne(item, writeArticle) {
  try {
    log('Agent-4', `Generating article for "${item.keyword}"`);

    const file = writeArticle({ keyword: item.keyword });

    return {
      ...item,
      status: 'done',
      generatedAt: now(),
      output: file
    };
  } catch (err) {
    log('ERROR', `Failed for "${item.keyword}": ${err.message}`);

    return {
      ...item,
      status: 'failed',
      error: err.message
    };
  }
}

// ✅ Reporting
function writeReport(result) {
  fs.writeFileSync(
    REPORT_PATH,
    JSON.stringify(
      {
        generatedAt: now(),
        processed: result.processed,
        remaining: result.remaining,
        files: result.files
      },
      null,
      2
    )
  );
}

// ✅ Main pipeline
function main() {
  ensureOutput();
  acquireLock();

  try {
    const writeArticle = loadGenerator();
    const queue = loadQueue();

    const files = [];
    let processed = 0;

    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];

      if (!item || item.status !== 'pending') continue;

      const updated = processOne(item, writeArticle);
      queue[i] = updated;

      if (updated.status === 'done') {
        processed++;
        files.push(updated.output);
      }
    }

    saveQueue(queue);

    const remaining = queue.filter(x => x.status === 'pending').length;

    writeReport({ processed, remaining, files });

    log('Agent-0', `Processed ${processed}, Remaining ${remaining}`);
  } finally {
    releaseLock();
  }
}

main();
