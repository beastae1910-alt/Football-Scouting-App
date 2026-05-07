
import { test } from 'node:test';
import assert from 'node:assert';
import { generateReport } from '../generateReport.js';

const defaultStats = { pace: 85, shooting: 85, passing: 85, dribbling: 85, defending: 85, physical: 85 };

test('normalizeStats - boundary values', async (t) => {
  await t.test('claps stats above 100 to 100', () => {
    const player = { position: 'Forward', age: 20, stats: { ...defaultStats, pace: 110 } };
    const report = generateReport(player);
    assert.ok(report.includes('exceptional pace to beat defenders in behind'), 'Should treat 110 as 100 (> 80)');
  });

  await t.test('clamps stats below 0 to 0', () => {
    const player = { position: 'Forward', age: 20, stats: { ...defaultStats, defending: -10 } };
    const report = generateReport(player);
    assert.ok(report.includes('poor defensive positioning and weak in the challenge'), 'Should treat -10 as 0 (< 65)');
  });

  await t.test('handles exactly 0', () => {
    const player = { position: 'Forward', age: 20, stats: { ...defaultStats, defending: 0 } };
    const report = generateReport(player);
    assert.ok(report.includes('poor defensive positioning and weak in the challenge'), 'Should treat 0 as 0 (< 65)');
  });

  await t.test('handles exactly 100', () => {
    const player = { position: 'Forward', age: 20, stats: { ...defaultStats, pace: 100 } };
    const report = generateReport(player);
    assert.ok(report.includes('exceptional pace to beat defenders in behind'), 'Should treat 100 as 100 (> 80)');
  });
});

test('normalizeStats - invalid inputs', async (t) => {
  await t.test('handles non-numeric string', () => {
    const player = { position: 'Forward', age: 20, stats: { ...defaultStats, pace: 'fast' } };
    const report = generateReport(player);
    assert.ok(report.includes('has invalid pace data'), 'Should return invalid data message');
  });

  await t.test('handles NaN', () => {
    const player = { position: 'Forward', age: 20, stats: { ...defaultStats, pace: NaN } };
    const report = generateReport(player);
    assert.ok(report.includes('has invalid pace data'), 'Should return invalid data message');
  });

  await t.test('handles numeric string', () => {
    const player = { position: 'Forward', age: 20, stats: { ...defaultStats, pace: '90' } };
    const report = generateReport(player);
    assert.ok(report.includes('exceptional pace to beat defenders in behind'), 'Should convert numeric string to number');
  });
});

test('normalizeStats - missing data', async (t) => {
  await t.test('handles missing stats object', () => {
    const player = { position: 'Forward', age: 20, stats: null };
    const report = generateReport(player);
    assert.ok(report.includes('no recorded stats yet'), 'Should handle null stats');
  });

  await t.test('handles missing specific stat', () => {
    const { shooting, ...incompleteStats } = defaultStats;
    const player = { position: 'Forward', age: 20, stats: incompleteStats };
    const report = generateReport(player);
    assert.ok(report.includes('Missing shooting'), 'Should report missing stat');
  });

  await t.test('handles empty string as missing stat', () => {
    const player = { position: 'Forward', age: 20, stats: { ...defaultStats, pace: '' } };
    const report = generateReport(player);
    assert.ok(report.includes('Missing pace'), 'Should treat empty string as missing');
  });
});
