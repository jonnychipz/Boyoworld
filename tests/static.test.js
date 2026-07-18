const { readFileSync, existsSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const root = join(__dirname, "..");
const read = (file) => readFileSync(join(root, file), "utf8");

test("ships the static game entry points", () => {
  for (const file of ["index.html", "styles.css", "game.js", ".nojekyll", "assets/vendor/phaser.min.js"]) {
    assert.equal(existsSync(join(root, file)), true, `${file} is missing`);
  }
});

test("contains five named playable levels", () => {
  const source = read("game.js");
  for (const level of [
    "RED BRICK RUN",
    "SPITFIRE BEAT",
    "FUMING ESCAPE",
    "RAW PAP ARENA",
    "PAY ME PANIC"
  ]) {
    assert.match(source, new RegExp(level));
  }
  assert.match(source, /completeLevel/);
  assert.match(source, /youtube-nocookie\.com/);
  assert.match(source, /class BoyoRig extends Phaser\.GameObjects\.Container/);
  assert.match(source, /class BoyoScene extends Phaser\.Scene/);
  assert.match(read("index.html"), /assets\/vendor\/phaser\.min\.js/);
});

test("includes expanded authorized visual worlds", () => {
  for (const level of ["red-brick", "spitfire", "fuming", "raw-pap", "pay-me"]) {
    for (let frame = 1; frame <= 3; frame += 1) {
      assert.equal(existsSync(join(root, "assets", "frames", `${level}-${frame}.jpg`)), true);
    }
  }
  const tiktokAssets = Array.from({ length: 13 }, (_, index) =>
    join(root, "assets", "tiktok", `boyo-${String(index + 1).padStart(2, "0")}.jpg`)
  );
  assert.equal(tiktokAssets.filter(existsSync).length >= 12, true);
});

test("exposes accessible controls and reduced motion", () => {
  const html = read("index.html");
  const css = read("styles.css");
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /id="soundToggle"/);
  assert.match(html, /id="touchControls"/);
  assert.match(html, /id="gameGuide"/);
  assert.match(html, /id="gameBriefing"/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /:focus-visible/);
});

test("explains win conditions and requests audible autoplay", () => {
  const source = read("game.js");
  for (const goal of [
    "COLLECT 6 RED BRICKS",
    "HIT 12 NOTES",
    "COLLECT 6 SIGNALS",
    "DESTROY 12 ENEMIES",
    "COMPLETE 3 PATTERNS"
  ]) {
    assert.match(source, new RegExp(goal));
  }
  assert.match(source, /autoplay=1&playsinline=1/);
  assert.doesNotMatch(source, /mute=1/);
  assert.match(source, /rewardScrollY = window\.scrollY/);
  assert.doesNotMatch(source, /nextLevel"\)\.focus/);
  assert.match(source, /updateGuide\(game\.(collected|hits|kills|round)\)/);
});

test("uses official BOYO destinations", () => {
  const html = read("index.html");
  for (const destination of [
    "youtube.com/@BOYOWORLD",
    "tiktok.com/@boyo_world",
    "instagram.com/boyoworld",
    "open.spotify.com/artist/7J2xeLqwL4RSJ4OqCWL00d",
    "music.apple.com/gb/artist/boyo/1562715707",
    "boyoworld.com"
  ]) {
    assert.match(html, new RegExp(destination.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});
