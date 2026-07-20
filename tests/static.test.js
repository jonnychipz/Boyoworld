const { readFileSync, existsSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const root = join(__dirname, "..");
const read = (file) => readFileSync(join(root, file), "utf8");
const game = read("game.js");
const world = read("three-world.js");
const html = read("index.html");

test("ships one flagship game", () => {
  for (const file of [
    "index.html", "styles.css", "game.js", "three-world.js",
    "assets/vendor/three.min.js", ".nojekyll"
  ]) {
    assert.equal(existsSync(join(root, file)), true, `${file} is missing`);
  }
  assert.match(world, /class BoyoThreeWorld/);
  assert.doesNotMatch(html, /phaser/i);
  assert.equal(existsSync(join(root, "assets/vendor/phaser.min.js")), false);
});

test("creates the 50-enemy surreal city", () => {
  assert.match(world, /const ENEMY_COUNT = 50/);
  assert.match(world, /const WIN_TARGET = 25/);
  assert.match(world, /SILLY_NAMES/);
  assert.match(world, /WEAKIE WALLY/);
  assert.match(world, /WET EGG WENDY/);
  assert.match(world, /makeEnemyHealthLabel/);
  assert.match(world, /healthVisibleUntil/);
});

test("builds the procedural BOYO character and city", () => {
  assert.match(world, /createKnitTexture/);
  assert.match(world, /createAsphaltTexture/);
  assert.match(world, /createFacadeTexture/);
  assert.match(world, /createStreetlights/);
  assert.match(world, /createPuddles/);
  assert.match(world, /resolvePlayerPenetration/);
});

test("supports arrows, firing, touch look and pinch zoom", () => {
  assert.match(game, /arrowleft/);
  assert.match(game, /arrowright/);
  assert.match(game, /Space|action/);
  assert.match(world, /activePointers\.size >= 2/);
  assert.match(world, /pinchDistance/);
  assert.match(world, /cameraDistance/);
});

test("integrates music, coins, Banshees and video billboards", () => {
  assert.match(world, /const VIDEO_BILLBOARDS = \[/);
  assert.equal((world.match(/LIVE FEED/g) || []).length, 6);
  assert.match(world, /new THREE\.VideoTexture/);
  assert.match(world, /assets\/billboards\/red-brick\.mp4/);
  assert.match(world, /createCoins/);
  assert.match(world, /for \(let index = 0; index < 30/);
  assert.match(world, /createBansheesLandmark/);
  assert.match(world, /banshees-rise\.mp3/);
  assert.match(world, /BANSHEES RISE/);
});

test("keeps the video and scratch reward in the cabinet", () => {
  assert.match(game, /autoplay=1&playsinline=1/);
  assert.doesNotMatch(game, /mute=1/);
  assert.match(game, /setupScratchCard/);
  assert.match(game, /TEST-NOT-REAL-CODE/);
  assert.match(game, /navigator\.clipboard\.writeText/);
  assert.match(html, /id="copyDiscountCode"/);
  assert.match(game, /scratchMoves >= 12/);
  assert.match(game, /rewardScrollY/);
  assert.match(html, /id="scratchCanvas"/);
  assert.match(world, /stopWorldAudio/);
  assert.match(world, /billboard\.video\.volume = 0/);
  assert.match(world, /billboard\.video\.muted = true/);
  assert.match(world, /billboard\.video\.pause\(\)/);
  assert.match(world, /this\.updateEnemies\(delta\);\s*if \(this\.paused\) return;/);
  assert.match(world, /completionTimer/);
  assert.match(game, /clearRewardTimer/);
  assert.match(game, /function failWorld\(message\) \{[\s\S]*?stopWorldAudio\(\);[\s\S]*?setPaused\(true\);/);
});

test("preserves official links and public-facing copy", () => {
  for (const destination of [
    "youtube.com/@BOYOWORLD", "tiktok.com/@boyo_world",
    "instagram.com/boyoworld", "boyoworld.com"
  ]) {
    assert.match(html, new RegExp(destination.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.doesNotMatch(html, /Three\.js|WebGL|renderer|Phaser/);
  assert.match(html, /BOYOWORLD/);
});
