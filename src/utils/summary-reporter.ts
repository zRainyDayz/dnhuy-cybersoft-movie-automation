import fs from 'fs';
import path from 'path';
import type { FullResult, Reporter, TestCase, TestResult } from '@playwright/test/reporter';

interface Row { id: string; title: string; project: string; status: string; duration: number; error?: string; }

/**
 * Writes reports/summary.md: pass/fail counts and one row per test case ID,
 * so results can be copied straight into the "Test Execution" sheet.
 */
export default class SummaryReporter implements Reporter {
  private rows: Row[] = [];
  private start = Date.now();

  onTestEnd(test: TestCase, result: TestResult) {
    const id = (test.title.match(/TC_[A-Z]+_\d+/) || ['-'])[0];
    this.rows.push({
      id,
      title: test.title,
      project: test.parent.project()?.name || '',
      status: result.status,
      duration: result.duration,
      error: result.error?.message?.split('\n')[0]?.replace(/\u001b\[[0-9;]*m/g, '').slice(0, 160),
    });
  }

  onEnd(result: FullResult) {
    const dir = path.resolve(process.cwd(), 'reports');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const count = (s: string) => this.rows.filter(r => r.status === s).length;
    const lines = [
      `# Automation run summary`,
      ``,
      `- Finished: ${new Date().toISOString()}  (overall: **${result.status}**)`,
      `- Duration: ${((Date.now() - this.start) / 1000).toFixed(1)} s`,
      `- Total: ${this.rows.length} | Passed: ${count('passed')} | Failed: ${count('failed') + count('timedOut')} | Skipped: ${count('skipped')}`,
      ``,
      `| TC ID | Project | Status | Time (s) | Title | First error line |`,
      `|---|---|---|---|---|---|`,
      ...this.rows
        .sort((a, b) => a.id.localeCompare(b.id))
        .map(r => `| ${r.id} | ${r.project} | ${r.status} | ${(r.duration / 1000).toFixed(1)} | ${r.title.replace(/\|/g, '/')} | ${(r.error || '').replace(/\|/g, '/')} |`),
    ];
    fs.writeFileSync(path.join(dir, 'summary.md'), lines.join('\n'));
  }
}
