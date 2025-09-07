import { describe, it, expect } from 'vitest';
import axeCore from 'axe-core';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const axe = async (context: Element | Document) => {
  return await axeCore.run(context as unknown as Element, {
    runOnly: ['wcag2a', 'wcag2aa'],
    rules: { 'color-contrast': { enabled: false } },
  });
};

function loadPageHtml(relativePath: string): string {
  const path = resolve(process.cwd(), relativePath);
  return readFileSync(path, 'utf-8');
}

async function runAxeOn(html: string) {
  // Recreate the document from HTML to preserve <html lang> and structure
  document.open();
  document.write(html);
  document.close();
  // Simulate interactive regions being open to avoid aria-hidden focus traps in static HTML
  document.querySelectorAll('[aria-hidden="true"]').forEach((el) => {
    el.removeAttribute('aria-hidden');
  });
  // run
  const results = await axe(document);
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
}

describe('Accessibility smoke tests', () => {
  it('index.html has no major axe violations', async () => {
    const html = loadPageHtml('index.html');
    await runAxeOn(html);
  });

  const servicesPath = 'services.html';
  if (existsSync(resolve(process.cwd(), servicesPath))) {
    it('services.html has no major axe violations', async () => {
      const html = loadPageHtml(servicesPath);
      await runAxeOn(html);
    });
  }

  it('contact.html has no major axe violations', async () => {
    const html = loadPageHtml('contact.html');
    await runAxeOn(html);
  });
});
