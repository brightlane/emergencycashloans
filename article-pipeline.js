const fs = require('fs');
const path = require('path');

// Paths
const ROOT = __dirname;
const OUTPUT_DIR = path.join(ROOT, 'output');
const QUEUE_PATH = path.join(OUTPUT_DIR, 'article-queue.json');
const LOCK_PATH = path.join(OUTPUT_DIR, '.article-pipeline.lock');
const REPORT_PATH = path.join(OUTPUT_DIR, 'article-pipeline-report.json');

// Affiliate URLs
const MAXLEND = "https://www.linkconnector.com/ta.php?lc=007949096598005765&atid=MaxlendeMergency";
const ROUND_SKY = "https://www.rnd3.com/ai/iframeRedirect.php?id=6AVVLZYHzfkHt4BOrsmmT2cyrXBjmNrJSlCWKYd1G4w.&subId=[SUB_ID_VALUE]&subId2=[SUB_ID2_VALUE]&subId3=[clickId]&firstName=[firstName]&lastName=[lastName]&email=[email]";

// Current timestamp in ISO format
function now() {
  return new Date().toISOString();
}

// Logging function
function log(step, msg) {
  console.log(`[${now()}] [${step}] ${msg}`);
}

// ✅ Ensure output directory exists
function ensureOutput() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    log('INIT', `Output directory created: ${OUTPUT_DIR}`);
  }
}

// ✅ Safe module loader (prevents crash if the module is missing)
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

// ✅ Lock system to prevent concurrent execution
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

// ✅ Release the lock
function releaseLock() {
  try {
    if (fs.existsSync(LOCK_PATH)) {
      fs.unlinkSync(LOCK_PATH);
      log('INFO', `Lock file removed: ${LOCK_PATH}`);
    }
  } catch (err) {
    log('ERROR', `Failed to remove lock file: ${err.message}`);
  }
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

// ✅ Save updated queue
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

// ✅ Write report to file
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
  log('INFO', `Report generated: ${REPORT_PATH}`);
}

// ✅ Clean article generation, remove placeholders, keep affiliate URLs intact
function buildArticle(i, keyword) {
  const slug = `${keyword.replace(/\s+/g, "-")}-${i}.html`;

  const affiliate = i % 7 === 0 ? ROUND_SKY : MAXLEND;

  return `
<!DOCTYPE html>
<html>
<head>
  <title>${keyword}</title>
  <meta name="description" content="Guide on ${keyword}">
</head>

<body style="font-family:Arial; max-width:900px; margin:auto;">

<h1>${keyword.toUpperCase()}</h1>

<p>
This article explains ${keyword} in detail, including how approval works,
what lenders look for, and how to choose the right financial option.
</p>

<h2>Overview</h2>
<p>
Many users searching for ${keyword} are looking for fast financial solutions.
Understanding the process helps avoid mistakes and delays.
</p>

<h2>Key Considerations</h2>
<ul>
<li>Loan approval requirements vary</li>
<li>State restrictions may apply</li>
<li>Repayment terms should always be reviewed</li>
</ul>

<h2>Recommended Option</h2>
<p>
<a href="${affiliate}" target="_blank">Click here to continue application</a>
</p>

<h2>Conclusion</h2>
<p>
Always compare options before committing to any financial agreement.
Responsible borrowing is important for long-term stability.
</p>

</body>
</html>
`;
}

// ✅ Main pipeline function
function main() {
  ensureOutput();
  acquireLock();

  try {
    const writeArticle = loadGenerator();
    const queue = loadQueue();

    const files = [];
    let processed = 0;

    // Process the queue
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

    // Save the updated queue
    saveQueue(queue);

    const remaining = queue.filter(x => x.status === 'pending').length;

    // Write the report
    writeReport({ processed, remaining, files });

    log('Agent-0', `Processed ${processed}, Remaining ${remaining}`);
  } catch (err) {
    log('ERROR', `Pipeline failed: ${err.message}`);
  } finally {
    releaseLock();
  }
}

// Execute the pipeline
main();
