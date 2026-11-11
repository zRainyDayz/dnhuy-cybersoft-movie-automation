import fs from 'fs';
import path from 'path';
import { ENV } from './env';

type Level = 'debug' | 'info' | 'warn' | 'error';
const ORDER: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 };

const LOG_DIR = path.resolve(process.cwd(), 'logs');
const RUN_ID = process.env.PW_RUN_ID || new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
process.env.PW_RUN_ID = RUN_ID; // shared by all workers of one run
const RUN_FILE = path.join(LOG_DIR, `run-${RUN_ID}.log`);

function ensureDir() {
  if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
}

/**
 * Small dependency-free logger.
 * - Prints to console (respecting LOG_LEVEL)
 * - Appends every line to logs/run-<timestamp>.log
 * - Keeps the lines of the current test in memory so the fixture can attach them to the HTML report
 */
export class Logger {
  private lines: string[] = [];

  constructor(private readonly scope: string) {}

  private write(level: Level, message: string) {
    const line = `${new Date().toISOString()} [${level.toUpperCase().padEnd(5)}] [${this.scope}] ${message}`;
    this.lines.push(line);
    ensureDir();
    fs.appendFileSync(RUN_FILE, line + '\n');
    if (ORDER[level] >= ORDER[ENV.logLevel]) {
      // eslint-disable-next-line no-console
      (level === 'error' ? console.error : console.log)(line);
    }
  }

  debug(msg: string) { this.write('debug', msg); }
  info(msg: string) { this.write('info', msg); }
  warn(msg: string) { this.write('warn', msg); }
  error(msg: string) { this.write('error', msg); }

  /** Logs a named step; use for every user-visible action in page objects. */
  step(msg: string) { this.write('info', `STEP » ${msg}`); }

  get content(): string { return this.lines.join('\n'); }
  static get runFile(): string { return RUN_FILE; }
}
