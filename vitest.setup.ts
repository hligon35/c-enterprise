import { afterEach, beforeEach } from 'vitest';

// No global/matchers needed; tests will call axe-core directly

beforeEach(() => {
  // ensure clean document for each test
  document.head.innerHTML = '';
  document.body.innerHTML = '';
});

afterEach(() => {
  document.head.innerHTML = '';
  document.body.innerHTML = '';
});
