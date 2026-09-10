import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

test('favorites chapter enters, respects manual scope, exits and re-enters', () => {
  const source = readFileSync(new URL('./home.ts', import.meta.url), 'utf8');
  const activate = source.slice(source.indexOf('function activateStory('), source.indexOf('function navigateStory(')).replace('index: number', 'index');
  runInNewContext(`
    let activeStory = 0, favoriteOnly = false, selected = 0, visible = [];
    const stories = [{ favorites: false, clipIndex: 0 }, { favorites: true, clipIndex: 0 }, { favorites: false, clipIndex: 1 }];
    const storyTrack = { children: [] };
    function applyFilters() { visible = favoriteOnly ? [0, 2, 4] : [0, 1, 2, 3, 4]; }
    function refreshSelection() {}
    function closeMenus() {}
    ${activate}
    activateStory(1);
    assert.equal(favoriteOnly, true);
    assert.equal(selected, 0);
    assert.equal(visible.join(','), '0,2,4');
    favoriteOnly = false;
    activateStory(1);
    assert.equal(favoriteOnly, false);
    activateStory(2);
    assert.equal(favoriteOnly, false);
    assert.equal(selected, 1);
    activateStory(1);
    assert.equal(favoriteOnly, true);
    activateStory(0);
    assert.equal(favoriteOnly, false);
  `, { assert });
});

test('each record navigates to its content chapter, never the favorites chapter', () => {
  const source = readFileSync(new URL('./home.ts', import.meta.url), 'utf8');
  const definition = source.slice(source.indexOf('const stories = ['), source.indexOf('let activeStory'));
  runInNewContext(`
    const words = {};
    const clips = Array.from({ length: 10 }, () => ({}));
    ${definition}
    for (let index = 0; index < clips.length; index++) {
      const target = stories.findIndex((story, storyIndex) => storyIndex >= 2 && story.clipIndex === index);
      assert.ok(target >= 2);
      assert.equal(stories[target].favorites, false);
    }
    assert.equal(stories[1].favorites, true);
  `, { assert });
});

test('fast scrolling follows current position in both directions', () => {
  const source = readFileSync(new URL('./home.ts', import.meta.url), 'utf8');
  const update = source.slice(source.indexOf('function updateStory()'), source.indexOf('function requestStoryUpdate()')).replace('parentElement!', 'parentElement');
  for (const reduced of [false, true]) {
    runInNewContext(`
      let storyRaf = 1, raw = 0;
      const stories = Array(12), calls = [];
      const reduceMotion = { matches: reduced };
      const storyTrack = { style: { setProperty() {} }, parentElement: { clientHeight: 500 } };
      function storyPosition() { return { raw }; }
      function followScrollStory(index) { calls.push(index); }
      ${update}
      for (const position of [0, 1.2, 3.1, 7.2, 11, 8, 4, 0]) { raw = position; updateStory(); }
      assert.equal(calls.join(','), '0,1,3,7,11,8,4,0');
    `, { assert, reduced });
  }
});
