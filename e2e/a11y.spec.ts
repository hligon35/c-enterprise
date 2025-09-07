import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test('index.html has no major axe violations (smoke)', async ({ page }) => {
  const filePath = resolve(process.cwd(), 'index.html');
  await page.goto('file://' + filePath.replace(/\\/g, '/'));

  // inject axe
  const axeJs = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf-8');
  await page.addScriptTag({ content: axeJs });

  // Ensure menu overlay is not aria-hidden during analysis
  await page.evaluate(() => {
    document.querySelectorAll('[aria-hidden="true"]').forEach((el) => el.removeAttribute('aria-hidden'));
  });

  const results = await page.evaluate(async () => {
    // @ts-ignore
    return await window.axe.run(document, {
      runOnly: ['wcag2a', 'wcag2aa'],
      rules: { 'color-contrast': { enabled: false } },
    });
  });

  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});
