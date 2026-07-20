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
  assert.match(world, /isNearMediaSite/);
  assert.match(world, /PANEL_W \* 0\.48/);
  assert.match(world, /BANSHEES_SITE/);
  assert.match(world, /attempts < 80/);
  assert.match(world, /collidesWorld\(nextX, enemy\.group\.position\.z, enemy\.radius\)/);
  assert.equal(existsSync(join(root, "assets/mask-dragon.png")), true);
  assert.match(world, /assets\/mask-dragon\.png/);
  assert.match(html, /class="mask-dragon"/);
});

test("mounts posed BOYO on an articulated procedural wooden horse", () => {
  assert.match(world, /createWoodTexture\(\)/);
  assert.match(world, /new THREE\.CanvasTexture\(canvas\)/);
  assert.match(world, /map: woodTexture/);
  assert.match(world, /bumpMap: woodTexture/);
  assert.match(world, /roughness: 0\.72/);
  assert.match(world, /createHorse\(\)/);
  assert.match(world, /mounted movement root/);
  assert.match(world, /mounted BOYO rider/);
  assert.match(world, /this\.horseLegs\.forEach/);
  assert.match(world, /footfallPhases = \[0, Math\.PI, Math\.PI \* 1\.5, Math\.PI \* 0\.5\]/);
  assert.match(world, /this\.rider\.rotation\.z/);
  assert.match(world, /this\.dashPoseUntil/);
  assert.match(world, /assets\/mask-dragon\.png/);
  assert.match(world, /makeMaskDecal\("BOYO", false\)/);
  assert.match(world, /const playerRadius = 2\.1/);
  for (const tack of [
    "left leather rein", "right leather rein", "left stirrup strap",
    "right stirrup strap", "left metal stirrup", "right metal stirrup",
    "Welsh red saddle cloth"
  ]) {
    assert.ok(world.includes(tack), `${tack} is missing`);
  }
  assert.match(world, /updateReins\(\)/);
  assert.match(world, /segment\.quaternion\.setFromUnitVectors\(UP/);
  assert.match(world, /this\.playerLimbs\.leftArm\.rotation\.x = -0\.72/);
  assert.match(world, /this\.playerLimbs\.rightArm\.rotation\.x = -0\.62/);
});

test("shows every required BOYO kill phrase in an anchored accessible bubble", () => {
  for (const phrase of [
    "LIAR!", "WEAKIE!", "TAP DOWN!", "BLEUGH!", "6P!", "'AVE IT!",
    "RUN IT!", "NO WEAKIES!", "SPIN THE BLOCK!"
  ]) {
    assert.ok(world.includes(`"${phrase}"`), `${phrase} is missing`);
  }
  assert.match(world, /createKillSpeechBubble/);
  assert.match(world, /this\.rider\.add\(this\.killSpeech\)/);
  assert.match(world, /this\.killSpeechUntil = this\.elapsed \+ rand\(1\.5, 2\)/);
  assert.match(world, /const phrase = this\.showKillSpeech\(\)/);
  assert.match(world, /debugDefeatAll\(\)[\s\S]*?this\.defeatEnemy\(enemy\)/);
  assert.match(world, /debugDefeatOne\(\)/);
  assert.match(game, /BOYO says \$\{phrase \|\| "NO WEAKIES!"\}/);
});

test("builds four rich building families and performant night dressing", () => {
  for (const variant of ["brick", "concrete", "render", "glassMetal"]) {
    assert.match(world, new RegExp(`id: "${variant}"`));
  }
  assert.match(world, /createBuildingTexture/);
  assert.match(world, /reservedMedia\.some[\s\S]*?< 23/);
  assert.match(world, /createStreetArtifacts/);
  assert.match(world, /new THREE\.InstancedMesh/);
  assert.match(world, /this\.streetArtifactCount \+= amount/);
  assert.match(world, /count\(category, transforms\.length\)/);
  for (const category of [
    "curb sidewalk ribbons", "crosswalks", "bollards", "complete benches",
    "identifiable hydrants", "road signs", "traffic lights", "parked stylized cars",
    "parked stylized vans", "utility boxes", "drains", "litter", "posters",
    "steam vents", "street markings"
  ]) {
    assert.ok(world.includes(`"${category}"`), `${category} street dressing is missing`);
  }
  for (const detail of [
    "building door", "shopfront", "shop awning", "rooftop water tank",
    "rooftop vent", "fire escape silhouette"
  ]) {
    assert.ok(world.includes(detail), `${detail} is missing`);
  }
  assert.match(world, /streetArtifactCategories:\s*\{ \.\.\.this\.streetArtifactCategories \}/);
  assert.match(world, /this\.starCount = mobile \? 720 : 1400/);
  assert.match(world, /this\.moon = new THREE\.Mesh/);
  assert.match(world, /this\.moonHalo = new THREE\.Sprite/);
});

test("upgrades enemy cloth, gait and recoil without changing combat invariants", () => {
  assert.match(world, /createEnemyFabricTexture/);
  assert.match(world, /bumpMap: fabric/);
  assert.match(world, /gaitScale:/);
  assert.match(world, /enemy\.recoil = 1/);
  assert.match(world, /enemy\.headGroup\.rotation\.x = -enemy\.recoil/);
  assert.match(world, /const health = boss \? 5 : index % 7 === 0 \? 3 : 2/);
});

test("bounds crowd detail and media playback for smooth proximity transitions", () => {
  assert.match(world, /refreshEnemyLod/);
  assert.match(world, /const fullLimit = mobile \? 8 : 14/);
  assert.match(world, /const faceLimit = mobile \? 3 : 7/);
  assert.match(world, /debugCrowdEnemies/);
  assert.match(world, /video\.preload = "metadata"/);
  assert.match(world, /primeMedia/);
  assert.match(world, /updateMediaPlayback/);
  assert.match(world, /playingMediaCount/);
  assert.match(world, /blockedMediaCount/);
  assert.match(game, /state\.world\.primeMedia/);
  assert.doesNotMatch(world, /this\.createBillboards\(\);/);
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
  assert.match(world, /const VIDEO_SOURCES = \[/);
  // 18 billboard displays backed by 9 shared official YouTube/TikTok sources
  assert.match(world, /BOYO TV/);
  assert.doesNotMatch(world, /LIVE FEED/);
  assert.match(world, /new THREE\.VideoTexture/);
  assert.match(world, /assets\/billboards\/red-brick\.mp4/);
  assert.match(world, /assets\/billboards\/dior\.mp4/);
  assert.match(world, /assets\/billboards\/tiktok-live-documents\.mp4/);
  assert.match(world, /assets\/billboards\/tiktok-battle-panic\.mp4/);
  assert.match(world, /assets\/billboards\/tiktok-high-on-life\.mp4/);
  for (const id of [
    "7648670517238730006",
    "7627545119566073110",
    "7619364492010343702"
  ]) {
    assert.match(world, new RegExp(id));
  }
  assert.match(world, /createCoins/);
  assert.match(world, /for \(let index = 0; index < 30/);
  assert.match(world, /createBansheesLandmark/);
  assert.match(world, /banshees-rise\.mp3/);
  assert.match(world, /BANSHEES RISE/);
});

test("uses only verified BOYOWORLD YouTube reward videos", () => {
  for (const id of [
    "eFhGFcPTNWc", "0o7RmMrxvko", "rRkw3Q7A8cQ", "fuyD1Tkhkcc",
    "HNUtBySf-aU", "u_IWzvxKSek", "9GRk3C1SbDQ", "J9dtVaabyVM",
    "SEBZABjtZBU", "-TRfGBNlQ5E"
  ]) {
    assert.match(game, new RegExp(id));
  }
  for (const id of ["6CNonJ8PaUE", "wY0ll0rtcWE", "MjKuMiU7b-w", "g5uCrJZbvXc", "2nJmvEeFbSE"]) {
    assert.doesNotMatch(game, new RegExp(id));
  }
});

test("keeps the video and scratch reward in the cabinet", () => {
  assert.match(game, /autoplay=1&playsinline=1/);
  assert.doesNotMatch(game, /mute=1/);
  assert.match(game, /setupScratchCard/);
  assert.match(game, /context\.fillText\("SCRATCH ME"/);
  assert.doesNotMatch(game, /SCRATCH \/ RUB TO REVEAL/);
  assert.match(game, /TEST-NOT-REAL-CODE/);
  assert.match(game, /navigator\.clipboard\.writeText/);
  assert.match(html, /id="copyDiscountCode"/);
  assert.match(game, /scratchMoves >= 12/);
  assert.match(game, /rewardScrollY/);
  assert.match(html, /id="scratchCanvas"/);
  assert.match(html, /id="scratchCodePanel" aria-hidden="true"/);
  assert.match(game, /scratchCard\.classList\.add\("is-revealed"\)/);
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

test("getState exposes extended display, media and camera fields", () => {
  // displayCount — 18 billboard displays
  assert.match(world, /displayCount:\s*this\.videoBillboards/);
  // uniqueMediaCount — 9 shared official video sources
  assert.match(world, /uniqueMediaCount:\s*this\.videoSources/);
  // aspectFitStatus present
  assert.match(world, /aspectFitStatus/);
  assert.match(world, /cameraPosition/);
  // active audible source tracking
  assert.match(world, /activeAudibleSource:\s*this\.activeAudibleName/);
  // camera intro state
  assert.match(world, /cameraIntro:\s*!this\.introComplete/);
  // signal stations count
  assert.match(world, /stationCount:\s*this\.signalStations/);
  assert.match(world, /signalStations:\s*this\.signalStations/);
  assert.match(world, /station\.active = dist <= 9/);
  // unified audio arbitration replaces per-video calls
  assert.match(world, /updateProximityAudio/);
  assert.match(world, /warpPlayerToStation/);
  assert.match(world, /activeIsOutOfRange && nearestDist < 50/);
  assert.match(world, /destination\.z \+ \(station \? 7 : 16\)/);
  assert.match(game, /\["playing", "paused"\]\.includes\(state\.mode\)/);
  assert.match(game, /scrollIntoView/);
  assert.match(game, /threeHud\.setAttribute\("aria-hidden", "false"\)/);
  assert.match(world, /mounted:\s*Boolean\(this\.horse && this\.rider\)/);
  assert.match(world, /horseParts:\s*this\.horseParts/);
  assert.match(world, /speechPhrase:\s*this\.killSpeechPhrase/);
  assert.match(world, /speechVisible:\s*this\.killSpeechVisible/);
  assert.match(world, /buildingVariantCount:\s*this\.buildingVariantCount/);
  assert.match(world, /moonVisible:\s*Boolean\(this\.moon\?\.visible\)/);
  assert.match(world, /starCount:\s*this\.starCount/);
  assert.match(world, /streetArtifactCount:\s*this\.streetArtifactCount/);
});
