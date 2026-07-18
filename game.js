(() => {
  "use strict";

  const W = 960;
  const H = 540;
  const cssRoot = getComputedStyle(document.documentElement);
  const css = (name) => cssRoot.getPropertyValue(name).trim();
  const CSS = {
    black: css("--cp-game-black"),
    blackSoft: css("--cp-game-black-soft"),
    charcoal: css("--cp-game-charcoal"),
    white: css("--cp-game-white"),
    offwhite: css("--cp-game-offwhite"),
    red: css("--cp-game-red"),
    redDark: css("--cp-game-red-dark"),
    redSoft: css("--cp-game-red-soft"),
    violet: css("--cp-game-violet"),
    violetDark: css("--cp-game-violet-dark"),
    chrome: css("--cp-game-chrome"),
    screen: css("--cp-game-screen"),
    screenInk: css("--cp-game-screen-ink"),
    screenDim: css("--cp-game-screen-dim"),
    yellow: css("--cp-game-yellow"),
    cyan: css("--cp-game-cyan")
  };

  function colorNumber(value) {
    const probe = document.createElement("canvas");
    probe.width = 1;
    probe.height = 1;
    const context = probe.getContext("2d");
    context.fillStyle = value;
    context.fillRect(0, 0, 1, 1);
    const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
    return (r << 16) | (g << 8) | b;
  }

  const P = Object.fromEntries(Object.entries(CSS).map(([key, value]) => [key, colorNumber(value)]));

  const LEVELS = [
    {
      name: "RED BRICK RUN",
      genre: "LEVEL 01 / CINEMATIC STREET RUNNER",
      objective: "Collect six red bricks. Vault street furniture with Space, Up, W, or the A button.",
      shortObjective: "BRICKS 0 / 6",
      frames: ["red1", "red2", "red3"]
    },
    {
      name: "SPITFIRE BEAT",
      genre: "LEVEL 02 / LIVE RHYTHM STRIKE",
      objective: "Hit twelve notes at the line. Use D, F, J, K or the four direction buttons.",
      shortObjective: "HITS 0 / 12",
      frames: ["spit1", "spit2", "spit3"]
    },
    {
      name: "FUMING ESCAPE",
      genre: "LEVEL 03 / TOP-DOWN URBAN CHASE",
      objective: "Collect six signals while the FUMING shadows hunt BOYO through the maze.",
      shortObjective: "SIGNALS 0 / 6",
      frames: ["fume1", "fume2", "fume3"]
    },
    {
      name: "RAW PAP ARENA",
      genre: "LEVEL 04 / 360 SURVIVAL SHOOTER",
      objective: "Move, aim with your direction, and fire with Space or A. Clear twelve pests.",
      shortObjective: "PESTS 0 / 12",
      frames: ["raw1", "raw2", "raw3"]
    },
    {
      name: "PAY ME PANIC",
      genre: "LEVEL 05 / MEMORY REACTION",
      objective: "Watch the four-panel sequence, then repeat it with arrows, D/F/J/K, or touch.",
      shortObjective: "ROUND 1 / 3",
      frames: ["pay1", "pay2", "pay3"]
    }
  ];

  const VIDEOS = [
    ["fuyD1Tkhkcc", "FUMING"], ["J9dtVaabyVM", "PWY WYT TI"],
    ["SEBZABjtZBU", "RAW PAP"], ["0o7RmMrxvko", "RED BRICK"],
    ["rRkw3Q7A8cQ", "SPITFIRE"], ["6CNonJ8PaUE", "SITUATION"],
    ["u_IWzvxKSek", "DIOR"], ["wY0ll0rtcWE", "VALLEY BOUNCE"],
    ["HNUtBySf-aU", "PAY ME"], ["f1ZQAc2dPCs", "MAUVAIS FEELING"],
    ["MjKuMiU7b-w", "CHROME"], ["g5uCrJZbvXc", "TWIN TOWN"],
    ["9GRk3C1SbDQ", "SAVAGE"], ["2nJmvEeFbSE", "S.T.A.R."],
    ["TxrqmFt3vio", "SALAIRE"], ["zQx9mhJSDUk", "8MILES"],
    ["Lo7p2QeYPRI", "NOUVEAU MONDE"], ["wUEAlmHSEng", "OCEAN"]
  ];

  const QUOTES = [
    "WEAKIES", "LIAR", "TAP DOWN", "6P", "WET EGG",
    "SPIN THE BLOCK", "NORMAL FACE", "PAY ME", "FUMING", "RUN IT"
  ];

  const ui = {
    menu: document.getElementById("gameMenu"),
    levelCard: document.getElementById("levelCard"),
    pauseCard: document.getElementById("pauseCard"),
    rewardCard: document.getElementById("rewardCard"),
    rewardVideo: document.getElementById("rewardVideo"),
    rewardTitle: document.getElementById("rewardTitle"),
    levelName: document.getElementById("levelName"),
    levelGenre: document.getElementById("levelGenre"),
    levelObjective: document.getElementById("levelObjective"),
    beginLevel: document.getElementById("beginLevel"),
    levelReadout: document.getElementById("levelReadout"),
    scoreReadout: document.getElementById("scoreReadout"),
    lifeReadout: document.getElementById("lifeReadout"),
    objectiveReadout: document.getElementById("objectiveReadout"),
    quoteReadout: document.getElementById("quoteReadout"),
    machineStatus: document.getElementById("machineStatus"),
    announcements: document.getElementById("gameAnnouncements"),
    soundToggle: document.getElementById("soundToggle"),
    pauseButton: document.getElementById("pauseButton")
  };

  const state = {
    mode: "menu",
    levelIndex: 0,
    score: 0,
    lives: 3,
    sound: true,
    audio: null,
    quote: "TAP DOWN",
    quoteTimer: 0,
    lastVideo: -1,
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches
  };

  const controls = { down: new Set(), pressed: new Set() };
  let phaserGame;

  function announce(message) {
    ui.announcements.textContent = "";
    window.setTimeout(() => { ui.announcements.textContent = message; }, 20);
  }

  function audioContext() {
    if (!state.sound) return null;
    if (!state.audio) {
      const Context = window.AudioContext || window.webkitAudioContext;
      if (!Context) return null;
      state.audio = new Context();
    }
    if (state.audio.state === "suspended") state.audio.resume();
    return state.audio;
  }

  function tone(frequency, duration = 0.08, type = "square", volume = 0.035, slide = 0) {
    const audio = audioContext();
    if (!audio) return;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    const now = audio.currentTime;
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    if (slide) oscillator.frequency.exponentialRampToValueAtTime(Math.max(30, frequency + slide), now + duration);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  const sound = {
    menu: () => tone(180, 0.06, "square", 0.025, 100),
    jump: () => tone(210, 0.14, "square", 0.04, 250),
    collect: () => {
      tone(520, 0.08, "square", 0.04, 250);
      window.setTimeout(() => tone(820, 0.1, "triangle", 0.035), 60);
    },
    hit: () => tone(92, 0.2, "sawtooth", 0.05, -50),
    fire: () => tone(170, 0.05, "square", 0.026, -80),
    beat: (lane) => tone(260 + lane * 120, 0.09, lane % 2 ? "triangle" : "square", 0.045, 90),
    miss: () => tone(70, 0.12, "sawtooth", 0.035, -20),
    win: () => [330, 440, 550, 760].forEach((note, index) =>
      window.setTimeout(() => tone(note, 0.18, "square", 0.04, 100), index * 95))
  };

  function setHud() {
    const level = LEVELS[state.levelIndex];
    ui.levelReadout.textContent = state.mode === "menu" ? "SELECT LEVEL" : level.name;
    ui.scoreReadout.textContent = `SCORE ${String(state.score).padStart(6, "0")}`;
    ui.lifeReadout.textContent = `BOYO × ${Math.max(0, state.lives)}`;
    ui.quoteReadout.textContent = `“${state.quote}”`;
  }

  function setObjective(text) {
    ui.objectiveReadout.textContent = text;
  }

  function hideOverlays() {
    ui.menu.hidden = true;
    ui.levelCard.hidden = true;
    ui.pauseCard.hidden = true;
    ui.rewardCard.hidden = true;
  }

  function scene() {
    return phaserGame?.scene.getScene("BoyoScene");
  }

  function showMenu() {
    state.mode = "menu";
    controls.down.clear();
    controls.pressed.clear();
    stopRewardVideo();
    hideOverlays();
    ui.menu.hidden = false;
    ui.machineStatus.textContent = "PHASER SYSTEM READY";
    setObjective("SELECT A LEVEL TO BOOT");
    setHud();
    scene()?.scene.restart({ mode: "menu", index: state.levelIndex });
    announce("Level select. Choose one of five BOYOWORLD games.");
  }

  function chooseLevel(index) {
    state.levelIndex = Number(index);
    state.mode = "brief";
    state.score = 0;
    state.lives = 3;
    hideOverlays();
    const level = LEVELS[state.levelIndex];
    ui.levelGenre.textContent = level.genre;
    ui.levelName.textContent = level.name;
    ui.levelObjective.textContent = level.objective;
    ui.beginLevel.textContent = "Start level";
    ui.levelCard.hidden = false;
    ui.machineStatus.textContent = "WORLD LOADED";
    setObjective(level.shortObjective);
    setHud();
    scene()?.scene.restart({ mode: "brief", index: state.levelIndex });
    sound.menu();
    announce(`${level.name}. ${level.objective}`);
    ui.beginLevel.focus({ preventScroll: true });
  }

  function startLevel() {
    audioContext();
    state.mode = "playing";
    state.score = 0;
    state.lives = 3;
    state.quoteTimer = 2.4;
    controls.down.clear();
    controls.pressed.clear();
    hideOverlays();
    ui.machineStatus.textContent = "WORLD ACTIVE";
    setHud();
    setObjective(LEVELS[state.levelIndex].shortObjective);
    scene()?.scene.restart({ mode: "playing", index: state.levelIndex });
    document.getElementById("gameCanvas").focus({ preventScroll: true });
    announce(`${LEVELS[state.levelIndex].name} started.`);
    sound.menu();
  }

  function togglePause(force) {
    if (!["playing", "paused"].includes(state.mode)) return;
    const pause = typeof force === "boolean" ? force : state.mode === "playing";
    state.mode = pause ? "paused" : "playing";
    ui.pauseCard.hidden = !pause;
    ui.pauseButton.textContent = pause ? "Resume" : "Pause";
    ui.machineStatus.textContent = pause ? "SIGNAL HELD" : "WORLD ACTIVE";
    if (pause) scene()?.physics.world.pause();
    else {
      scene()?.physics.world.resume();
      document.getElementById("gameCanvas").focus({ preventScroll: true });
    }
    announce(pause ? "Game paused." : "Game resumed.");
  }

  function failLevel(message) {
    if (state.mode !== "playing") return;
    state.mode = "brief";
    controls.down.clear();
    controls.pressed.clear();
    ui.levelGenre.textContent = "SIGNAL LOST / TRY AGAIN";
    ui.levelName.textContent = "NO WEAKIES.";
    ui.levelObjective.textContent = `${message} Restart ${LEVELS[state.levelIndex].name} and run it back.`;
    ui.beginLevel.textContent = "Retry level";
    ui.levelCard.hidden = false;
    ui.machineStatus.textContent = "RETRY READY";
    scene()?.freezeFailure();
    announce(`${message} Retry the level.`);
    sound.hit();
  }

  function completeLevel() {
    if (state.mode !== "playing") return;
    state.mode = "reward";
    controls.down.clear();
    controls.pressed.clear();
    ui.machineStatus.textContent = "LEVEL CLEARED";
    setObjective("TRANSMISSION UNLOCKED");
    sound.win();
    scene()?.celebrate();
    announce(`${LEVELS[state.levelIndex].name} complete. Official BOYO video unlocked.`);
    window.setTimeout(() => {
      hideOverlays();
      ui.rewardCard.hidden = false;
      loadRandomVideo();
      document.getElementById("nextLevel").focus({ preventScroll: true });
    }, state.reducedMotion ? 0 : 650);
  }

  function loadRandomVideo() {
    let index = Math.floor(Math.random() * VIDEOS.length);
    if (VIDEOS.length > 1 && index === state.lastVideo) index = (index + 1) % VIDEOS.length;
    state.lastVideo = index;
    const [id, title] = VIDEOS[index];
    ui.rewardTitle.textContent = title;
    ui.rewardVideo.src = `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`;
  }

  function stopRewardVideo() {
    ui.rewardVideo.src = "";
  }

  function goToNextLevel() {
    stopRewardVideo();
    chooseLevel((state.levelIndex + 1) % LEVELS.length);
  }

  function takePress(...names) {
    for (const name of names) {
      if (controls.pressed.has(name)) {
        controls.pressed.delete(name);
        return true;
      }
    }
    return false;
  }

  function down(name) {
    return controls.down.has(name);
  }

  class BoyoRig extends Phaser.GameObjects.Container {
    constructor(sceneRef, x, y, scale = 1) {
      super(sceneRef, x, y);
      this.scene = sceneRef;
      this.facing = 1;
      this.motion = 0;
      this.actionPulse = 0;
      this.shadow = sceneRef.add.ellipse(0, 3, 72, 18, P.black, 0.46);
      this.backArm = sceneRef.add.image(-26, -94, "boyoLimb").setOrigin(0.5, 0.08);
      this.backLeg = sceneRef.add.image(-14, -48, "boyoLeg").setOrigin(0.5, 0.08);
      this.frontLeg = sceneRef.add.image(14, -48, "boyoLeg").setOrigin(0.5, 0.08);
      this.torso = sceneRef.add.image(0, -90, "boyoTorso");
      this.scarf = sceneRef.add.image(0, -126, "boyoScarf");
      this.frontArm = sceneRef.add.image(26, -94, "boyoLimb").setOrigin(0.5, 0.08);
      this.head = sceneRef.add.image(0, -151, "boyoHead");
      this.dragon = sceneRef.add.image(0, -168, "dragon").setScale(0.44);
      this.name = sceneRef.add.text(-25, -153, "BOYO", {
        fontFamily: "Segoe UI, sans-serif", fontSize: "8px", fontStyle: "900",
        color: CSS.black
      }).setRotation(0.12);
      this.highlight = sceneRef.add.ellipse(-10, -162, 12, 5, P.white, 0.16);
      this.add([
        this.shadow, this.backArm, this.backLeg, this.frontLeg, this.torso,
        this.scarf, this.frontArm, this.head, this.dragon, this.name, this.highlight
      ]);
      this.setScale(scale);
      sceneRef.add.existing(this);
      this.setDepth(30);
    }

    animate(time, moving, airborne = false, action = false) {
      const cycle = Math.sin(time * (moving ? 0.014 : 0.004));
      const stride = moving ? cycle * 0.68 : cycle * 0.08;
      const bob = moving ? Math.abs(Math.sin(time * 0.014)) * 4 : cycle * 1.6;
      this.backLeg.rotation = stride;
      this.frontLeg.rotation = -stride;
      this.backArm.rotation = -stride * 0.82 - 0.08;
      this.frontArm.rotation = stride * 0.82 + (action ? -1.25 : 0.08);
      this.torso.y = -90 - bob;
      this.scarf.y = -126 - bob;
      this.head.y = -151 - bob;
      this.dragon.y = -168 - bob;
      this.name.y = -153 - bob;
      this.highlight.y = -162 - bob;
      this.head.rotation = cycle * 0.025;
      this.torso.rotation = moving ? cycle * 0.02 : 0;
      this.shadow.scaleX = airborne ? 0.62 : 1 + Math.abs(cycle) * 0.06;
      this.shadow.alpha = airborne ? 0.22 : 0.46;
      const directionScale = Math.abs(this.scaleX) || 1;
      this.scaleX = directionScale * this.facing;
    }

    face(direction) {
      if (direction) this.facing = direction < 0 ? -1 : 1;
    }
  }

  class BoyoScene extends Phaser.Scene {
    constructor() {
      super("BoyoScene");
    }

    preload() {
      this.load.image("maskPhoto", "assets/boyo-mask-reference.png");
      this.load.image("brandHero", "assets/brand-hero.png");
      this.load.image("tiktokHigh", "assets/tiktok/boyo-03.jpg");
      this.load.image("tiktokMask", "assets/tiktok/boyo-12.jpg");
      const assets = {
        red1: "assets/frames/red-brick-1.jpg", red2: "assets/frames/red-brick-2.jpg", red3: "assets/frames/red-brick-3.jpg",
        spit1: "assets/frames/spitfire-1.jpg", spit2: "assets/frames/spitfire-2.jpg", spit3: "assets/frames/spitfire-3.jpg",
        fume1: "assets/frames/fuming-1.jpg", fume2: "assets/frames/fuming-2.jpg", fume3: "assets/frames/fuming-3.jpg",
        raw1: "assets/frames/raw-pap-1.jpg", raw2: "assets/frames/raw-pap-2.jpg", raw3: "assets/frames/raw-pap-3.jpg",
        pay1: "assets/frames/pay-me-1.jpg", pay2: "assets/frames/pay-me-2.jpg", pay3: "assets/frames/pay-me-3.jpg"
      };
      Object.entries(assets).forEach(([key, path]) => this.load.image(key, path));
    }

    create(data = {}) {
      this.currentMode = data.mode || "menu";
      this.levelIndex = Number.isFinite(data.index) ? data.index : 0;
      this.elapsed = 0;
      this.finished = false;
      this.makeTextures();
      this.cameras.main.setBackgroundColor(P.screen);
      if (this.currentMode === "playing") this.startWorld(this.levelIndex);
      else this.createCinematicBackdrop(this.levelIndex, this.currentMode === "menu");
      this.input.on("pointerdown", (pointer) => {
        if (state.mode === "playing" && this.levelIndex === 4) this.memoryPointer(pointer.x, pointer.y);
      });
    }

    makeTextures() {
      if (!this.textures.exists("boyoHead")) {
        const head = this.textures.createCanvas("boyoHead", 90, 106);
        const c = head.context;
        const source = this.textures.get("maskPhoto").getSourceImage();
        c.save();
        c.beginPath();
        c.ellipse(45, 52, 38, 49, 0, 0, Math.PI * 2);
        c.clip();
        c.drawImage(source, 28, 0, 410, 455, 0, 0, 90, 106);
        c.globalAlpha = 0.2;
        c.strokeStyle = CSS.chrome;
        c.lineWidth = 0.6;
        for (let y = 7; y < 102; y += 4) {
          c.beginPath();
          c.moveTo(5, y);
          c.lineTo(85, y + 3);
          c.stroke();
        }
        c.restore();
        head.refresh();

        this.createGradientTexture("boyoTorso", 82, 94, CSS.blackSoft, CSS.black, (c2) => {
          c2.strokeStyle = CSS.red;
          c2.lineWidth = 4;
          c2.beginPath();
          c2.moveTo(10, 14); c2.lineTo(22, 82); c2.moveTo(72, 14); c2.lineTo(60, 82); c2.stroke();
          c2.fillStyle = CSS.white;
          c2.font = "900 11px Segoe UI";
          c2.textAlign = "center";
          c2.fillText("BOYO", 41, 49);
        }, 18);
        this.createGradientTexture("boyoLimb", 25, 78, CSS.blackSoft, CSS.black, null, 12);
        this.createGradientTexture("boyoLeg", 28, 82, CSS.charcoal, CSS.black, (c2) => {
          c2.fillStyle = CSS.white;
          c2.fillRect(2, 68, 24, 10);
          c2.fillStyle = CSS.red;
          c2.fillRect(4, 64, 20, 3);
        }, 12);
        this.createGradientTexture("boyoScarf", 64, 21, CSS.offwhite, CSS.chrome, (c2) => {
          c2.strokeStyle = CSS.white;
          for (let x = 3; x < 62; x += 4) {
            c2.beginPath(); c2.moveTo(x, 2); c2.lineTo(x + 2, 19); c2.stroke();
          }
        }, 9);
        this.drawTexture("dragon", 52, 36, (g) => {
          g.fillStyle(P.black, 1);
          g.fillPoints([
            {x:4,y:22},{x:13,y:11},{x:10,y:3},{x:24,y:11},{x:39,y:5},
            {x:35,y:17},{x:49,y:23},{x:32,y:24},{x:22,y:33},{x:15,y:26}
          ], true);
        });
        this.drawTexture("spark", 10, 10, (g) => {
          g.fillStyle(P.white, 1); g.fillCircle(5, 5, 5);
        });
        this.drawTexture("redSpark", 12, 12, (g) => {
          g.fillStyle(P.red, 1); g.fillCircle(6, 6, 6);
        });
        this.drawTexture("brick", 48, 28, (g) => {
          g.fillStyle(P.red, 1); g.fillRoundedRect(1, 1, 46, 26, 4);
          g.lineStyle(2, P.white, 0.8); g.strokeRoundedRect(1, 1, 46, 26, 4);
          g.lineBetween(24, 2, 24, 27); g.lineBetween(2, 14, 47, 14);
        });
        this.drawTexture("signal", 38, 38, (g) => {
          g.lineStyle(4, P.screenInk, 1); g.strokeRect(3, 3, 32, 32);
          g.fillStyle(P.red, 1); g.fillRect(13, 13, 12, 12);
        });
        this.drawTexture("enemy", 46, 46, (g) => {
          g.fillStyle(P.redDark, 1);
          const points = [];
          for (let i = 0; i < 16; i += 1) {
            const angle = Math.PI * 2 * i / 16;
            const radius = i % 2 ? 14 : 22;
            points.push({x:23 + Math.cos(angle) * radius, y:23 + Math.sin(angle) * radius});
          }
          g.fillPoints(points, true);
          g.lineStyle(2, P.white, 0.8); g.strokePoints(points, true);
          g.fillStyle(P.black, 1); g.fillCircle(18, 21, 3); g.fillCircle(29, 21, 3);
        });
      }
    }

    createGradientTexture(key, width, height, top, bottom, detail, radius) {
      const texture = this.textures.createCanvas(key, width, height);
      const context = texture.context;
      const gradient = context.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, top);
      gradient.addColorStop(1, bottom);
      context.fillStyle = gradient;
      context.beginPath();
      context.roundRect(1, 1, width - 2, height - 2, radius);
      context.fill();
      context.strokeStyle = CSS.chrome;
      context.globalAlpha = 0.5;
      context.stroke();
      context.globalAlpha = 1;
      if (detail) detail(context);
      texture.refresh();
    }

    drawTexture(key, width, height, draw) {
      const graphics = this.make.graphics({ add: false });
      draw(graphics);
      graphics.generateTexture(key, width, height);
      graphics.destroy();
    }

    createCinematicBackdrop(index, isMenu) {
      const frames = isMenu ? ["brandHero", "tiktokHigh", "tiktokMask"] : LEVELS[index].frames;
      this.addCover(frames[0], 0, 0, W, H, 1);
      this.add.rectangle(W / 2, H / 2, W, H, P.black, 0.58);
      const left = this.addCover(frames[1], 98, 292, 310, 360, 0.62).setRotation(-0.07);
      const right = this.addCover(frames[2], 842, 275, 290, 380, 0.56).setRotation(0.06);
      left.setTint(P.redSoft);
      right.setTint(P.violet);
      this.add.rectangle(W / 2, H - 72, W, 145, P.redDark, 0.72);
      this.add.text(38, 425, isMenu ? "PHASER POWERED / FIVE WORLDS" : LEVELS[index].name, {
        fontFamily: "Segoe UI, sans-serif", fontSize: isMenu ? "28px" : "44px",
        fontStyle: "900", color: CSS.white
      }).setRotation(-0.02);
      this.add.text(42, 470, isMenu ? "MASK ON. SIGNAL LIVE." : LEVELS[index].genre, {
        fontFamily: "Consolas, monospace", fontSize: "14px", fontStyle: "700", color: CSS.screenInk
      });
      if (!state.reducedMotion) {
        this.tweens.add({ targets: left, x: 120, duration: 5200, yoyo: true, repeat: -1, ease: "Sine.inOut" });
        this.tweens.add({ targets: right, x: 820, duration: 4300, yoyo: true, repeat: -1, ease: "Sine.inOut" });
      }
      this.addNoiseBars();
    }

    startWorld(index) {
      if (index === 0) this.createRunner();
      if (index === 1) this.createRhythm();
      if (index === 2) this.createChase();
      if (index === 3) this.createArena();
      if (index === 4) this.createMemory();
      this.addVignette();
    }

    createRunner() {
      this.createPhotoWorld(LEVELS[0].frames, 0.3);
      this.add.rectangle(W / 2, 477, W, 126, P.redDark, 0.92);
      this.roadLines = [];
      for (let x = 0; x < W + 100; x += 100) {
        this.roadLines.push(this.add.rectangle(x, 493, 56, 5, P.white, 0.5));
      }
      this.boyo = new BoyoRig(this, 165, 454, 0.84);
      this.runner = {
        y: 454, vy: 0, grounded: true, invulnerable: 0, speed: 330,
        obstacleTimer: 1.4, brickTimer: 0.6, obstacles: [], bricks: [], collected: 0
      };
      this.runnerParticles = this.add.particles(0, 0, "redSpark", {
        speed: { min: 80, max: 240 }, angle: { min: 190, max: 350 },
        lifespan: 520, scale: { start: 1, end: 0 }, emitting: false
      }).setDepth(40);
    }

    createRhythm() {
      this.createPhotoWorld(LEVELS[1].frames, 0.42);
      this.add.rectangle(W / 2, H / 2, W, H, P.black, 0.45);
      this.rhythm = {
        notes: [], timer: 0.22, next: 0, hits: 0, misses: 0,
        flashes: [0, 0, 0, 0], pattern: [0, 2, 1, 3, 0, 1, 3, 2, 2, 0, 3, 1, 0, 3, 1, 2]
      };
      this.laneColors = [P.red, P.yellow, P.cyan, P.violet];
      this.lanes = [];
      for (let i = 0; i < 4; i += 1) {
        const x = 265 + i * 145;
        const lane = this.add.polygon(x, 280, [-62,-230, 62,-230, 82,220, -82,220], P.black, 0.48)
          .setStrokeStyle(2, this.laneColors[i], 0.7);
        const label = this.add.text(x, 474, ["D","F","J","K"][i], {
          fontFamily: "Consolas, monospace", fontSize: "24px", fontStyle: "900", color: CSS.white
        }).setOrigin(0.5);
        this.lanes.push({ lane, label });
      }
      this.add.rectangle(482, 430, 600, 6, P.white, 1);
      this.add.rectangle(482, 437, 600, 3, P.red, 1);
      this.boyo = new BoyoRig(this, 95, 480, 0.67);
      this.beam = this.add.polygon(95, 210, [-42,-200, 42,-200, 115,250, -115,250], P.red, 0.14);
      if (!state.reducedMotion) {
        this.tweens.add({ targets: this.beam, angle: { from: -12, to: 12 }, duration: 1600, yoyo: true, repeat: -1 });
      }
      this.rhythmParticles = this.add.particles(0, 0, "spark", {
        speed: { min: 90, max: 260 }, lifespan: 420,
        scale: { start: 0.8, end: 0 }, tint: [P.red, P.yellow, P.cyan, P.violet],
        emitting: false
      }).setDepth(50);
    }

    createChase() {
      this.createPhotoWorld(LEVELS[2].frames, 0.24);
      this.add.rectangle(W / 2, H / 2, W, H, P.black, 0.68);
      this.chase = {
        collected: 0, invulnerable: 0,
        signals: [[180,100],[480,95],[800,120],[250,430],[530,310],[820,430]].map(([x,y]) =>
          this.add.image(x, y, "signal").setDepth(12)),
        enemies: [],
        walls: [
          {x:300,y:0,w:36,h:165},{x:300,y:250,w:36,h:290},
          {x:610,y:0,w:36,h:250},{x:610,y:338,w:36,h:202},{x:430,y:230,w:140,h:30}
        ]
      };
      this.chase.walls.forEach((wall, index) => {
        this.add.rectangle(wall.x + wall.w/2, wall.y + wall.h/2, wall.w, wall.h,
          index % 2 ? P.violetDark : P.redDark, 0.94).setStrokeStyle(2, P.white, 0.25);
      });
      [[850,80,92],[850,470,108],[470,485,82]].forEach(([x,y,speed], index) => {
        const enemy = this.add.image(x, y, "enemy").setTint(index === 1 ? P.violet : P.red);
        enemy.speed = speed;
        this.chase.enemies.push(enemy);
      });
      this.boyo = new BoyoRig(this, 120, 320, 0.52);
      if (!state.reducedMotion) {
        this.fog = this.add.particles(0, 0, "spark", {
          x: { min: 0, max: W }, y: { min: 0, max: H }, speedX: { min: 12, max: 30 },
          speedY: { min: -4, max: 4 }, lifespan: 5500, frequency: 150,
          alpha: { start: 0.08, end: 0 }, scale: { start: 3, end: 7 }, tint: P.screenInk
        }).setDepth(20);
      }
    }

    createArena() {
      this.createPhotoWorld(LEVELS[3].frames, 0.26);
      this.add.rectangle(W / 2, H / 2, W, H, P.black, 0.62);
      for (let radius = 76; radius <= 370; radius += 74) {
        this.add.circle(W/2, H/2, radius, P.black, 0).setStrokeStyle(3,
          radius % 148 === 0 ? P.red : P.white, radius % 148 === 0 ? 0.8 : 0.18);
      }
      this.arena = { enemies: [], bullets: [], spawn: 0.55, fire: 0, kills: 0, invulnerable: 0 };
      this.boyo = new BoyoRig(this, W / 2, H / 2 + 65, 0.56);
      this.aimLine = this.add.rectangle(W/2, H/2, 58, 3, P.screenInk, 0.9).setOrigin(0, 0.5);
      this.arenaParticles = this.add.particles(0, 0, "redSpark", {
        speed: { min: 100, max: 300 }, lifespan: 500,
        scale: { start: 1, end: 0 }, emitting: false
      }).setDepth(50);
    }

    createMemory() {
      this.createPhotoWorld(LEVELS[4].frames, 0.4);
      this.add.rectangle(W / 2, H / 2, W, H, P.black, 0.58);
      this.memory = {
        round: 1, sequence: [], inputIndex: 0, phase: "waiting", timer: 0.8,
        showIndex: -1, active: -1, pads: []
      };
      const positions = [[280,190],[680,190],[280,370],[680,370]];
      const keys = LEVELS[4].frames.concat(["tiktokMask"]);
      positions.forEach(([x,y], index) => {
        const frame = this.add.image(x, y, keys[index]).setDisplaySize(300, 126).setCrop(0, 0, 640, 360);
        const shade = this.add.rectangle(x, y, 300, 126, P.black, 0.58)
          .setStrokeStyle(4, [P.red,P.yellow,P.cyan,P.violet][index], 0.95);
        const label = this.add.text(x, y + 74, ["LEFT / D","UP / F","DOWN / J","RIGHT / K"][index], {
          fontFamily: "Segoe UI, sans-serif", fontSize: "18px", fontStyle: "900", color: CSS.white
        }).setOrigin(0.5);
        this.memory.pads.push({ x:x-150, y:y-63, w:300, h:126, frame, shade, label });
      });
      this.memoryTitle = this.add.text(W/2, 65, "WATCH BOYO'S MONEY", {
        fontFamily: "Segoe UI, sans-serif", fontSize: "28px", fontStyle: "900", color: CSS.white
      }).setOrigin(0.5);
      this.boyo = new BoyoRig(this, 85, 525, 0.58);
      this.prepareMemory(true);
    }

    createPhotoWorld(frames, alpha) {
      this.photoPanels = [];
      frames.forEach((key, index) => {
        const panel = this.addCover(key, index * 320 + 160, H / 2, 340, H, alpha + index * 0.05);
        panel.setTint(index === 0 ? P.white : index === 1 ? P.redSoft : P.violet);
        this.photoPanels.push(panel);
      });
      this.add.rectangle(W/2, H/2, W, H, P.black, 0.3);
      this.addNoiseBars();
    }

    addCover(key, x, y, width, height, alpha = 1) {
      const image = this.add.image(x, y, key).setAlpha(alpha);
      const source = this.textures.get(key).getSourceImage();
      const scale = Math.max(width / source.width, height / source.height);
      image.setDisplaySize(source.width * scale, source.height * scale);
      const cropWidth = width / scale;
      const cropHeight = height / scale;
      image.setCrop((source.width - cropWidth) / 2, (source.height - cropHeight) / 2, cropWidth, cropHeight);
      return image;
    }

    addNoiseBars() {
      this.noiseBars = [];
      for (let i = 0; i < 8; i += 1) {
        const bar = this.add.rectangle(W/2, 20 + i * 74, W, 1 + (i % 3), P.white, 0.05).setDepth(80);
        this.noiseBars.push(bar);
      }
    }

    addVignette() {
      this.add.rectangle(W/2, H/2, W - 5, H - 5, P.black, 0)
        .setStrokeStyle(14, P.black, 0.5).setDepth(90);
      this.levelLabel = this.add.text(20, 18, LEVELS[this.levelIndex].name, {
        fontFamily: "Consolas, monospace", fontSize: "13px", fontStyle: "900",
        color: CSS.screenInk, backgroundColor: CSS.black
      }).setPadding(8, 5).setDepth(95);
    }

    update(time, delta) {
      if (state.mode !== "playing" || this.finished) return;
      const dt = Math.min(0.034, delta / 1000);
      this.elapsed += dt;
      state.quoteTimer -= dt;
      if (state.quoteTimer <= 0) {
        let quote = state.quote;
        while (quote === state.quote) quote = Phaser.Utils.Array.GetRandom(QUOTES);
        state.quote = quote;
        state.quoteTimer = 3 + Math.random() * 2.8;
        ui.quoteReadout.textContent = `“${state.quote}”`;
        this.flashQuote();
      }
      if (this.levelIndex === 0) this.updateRunner(time, dt);
      if (this.levelIndex === 1) this.updateRhythm(time, dt);
      if (this.levelIndex === 2) this.updateChase(time, dt);
      if (this.levelIndex === 3) this.updateArena(time, dt);
      if (this.levelIndex === 4) this.updateMemory(time, dt);
      this.noiseBars?.forEach((bar, index) => {
        bar.x = W/2 + Math.sin(time * 0.001 + index) * 8;
        bar.alpha = 0.025 + Math.abs(Math.sin(time * 0.003 + index)) * 0.04;
      });
      controls.pressed.clear();
      setHud();
    }

    updateRunner(time, dt) {
      const game = this.runner;
      game.speed = Math.min(485, 330 + this.elapsed * 5);
      game.invulnerable = Math.max(0, game.invulnerable - dt);
      const moving = down("left") || down("right");
      if ((takePress("action", "up") || down("up")) && game.grounded) {
        game.vy = -690; game.grounded = false; sound.jump();
      }
      if (down("left")) this.boyo.x = Math.max(90, this.boyo.x - 190 * dt);
      if (down("right")) this.boyo.x = Math.min(350, this.boyo.x + 190 * dt);
      this.boyo.face(down("left") ? -1 : 1);
      game.vy += 1750 * dt;
      game.y += game.vy * dt;
      if (game.y >= 454) { game.y = 454; game.vy = 0; game.grounded = true; }
      this.boyo.y = game.y;
      this.boyo.animate(time, moving || game.speed > 0, !game.grounded);
      this.roadLines.forEach((line) => {
        line.x -= game.speed * dt;
        if (line.x < -55) line.x += W + 100;
      });
      this.photoPanels.forEach((panel, index) => {
        panel.x -= game.speed * dt * (0.05 + index * 0.025);
        if (panel.x < -230) panel.x += W + 420;
      });
      game.obstacleTimer -= dt;
      if (game.obstacleTimer <= 0) {
        const height = Phaser.Math.Between(52, 92);
        const type = Math.random() > 0.5 ? "BIN" : "BOLLARD";
        const body = this.add.rectangle(W + 50, 454 - height/2, type === "BIN" ? 54 : 34, height,
          type === "BIN" ? P.charcoal : P.redDark, 1).setStrokeStyle(3, P.chrome, 0.8).setDepth(25);
        const label = this.add.text(W + 50, 454 - height + 8, type, {
          fontFamily: "Consolas", fontSize: "9px", color: CSS.white
        }).setOrigin(0.5).setDepth(26);
        game.obstacles.push({ body, label, h: height, w: body.width, hit: false });
        game.obstacleTimer = 1.15 + Math.random() * 0.85;
      }
      game.brickTimer -= dt;
      if (game.brickTimer <= 0) {
        const brick = this.add.image(W + 35, Math.random() > 0.48 ? 355 : 295, "brick").setDepth(28);
        game.bricks.push(brick);
        game.brickTimer = 0.95 + Math.random() * 0.72;
      }
      game.obstacles.forEach((obstacle) => {
        obstacle.body.x -= game.speed * dt; obstacle.label.x = obstacle.body.x;
        if (!obstacle.hit && game.invulnerable <= 0 &&
            Phaser.Geom.Intersects.RectangleToRectangle(
              new Phaser.Geom.Rectangle(this.boyo.x - 22, this.boyo.y - 132, 44, 132),
              obstacle.body.getBounds())) {
          obstacle.hit = true; game.invulnerable = 1.15; state.lives -= 1;
          this.cameraShake(180, 0.018); sound.hit();
          this.boyo.setAlpha(0.55);
          this.time.delayedCall(250, () => this.boyo?.setAlpha(1));
          if (state.lives <= 0) failLevel("The street furniture won.");
        }
      });
      game.bricks.forEach((brick) => {
        brick.x -= game.speed * dt; brick.rotation += dt * 4.5;
        if (!brick.taken && Phaser.Math.Distance.Between(this.boyo.x, this.boyo.y - 72, brick.x, brick.y) < 55) {
          brick.taken = true; brick.setVisible(false); game.collected += 1; state.score += 1000;
          setObjective(`BRICKS ${game.collected} / 6`); sound.collect();
          if (!state.reducedMotion) this.runnerParticles.explode(20, brick.x, brick.y);
          this.cameraFlash(90, 255, 30, 50);
          if (game.collected >= 6) completeLevel();
        }
      });
      game.obstacles = game.obstacles.filter((obstacle) => {
        if (obstacle.body.x < -80) { obstacle.body.destroy(); obstacle.label.destroy(); return false; }
        return true;
      });
      game.bricks = game.bricks.filter((brick) => {
        if (brick.x < -50 || brick.taken) { brick.destroy(); return false; }
        return true;
      });
    }

    updateRhythm(time, dt) {
      const game = this.rhythm;
      this.boyo.animate(time, true, false, Math.sin(time * 0.01) > 0.75);
      this.boyo.x = 95 + Math.sin(time * 0.004) * 8;
      game.timer -= dt;
      if (game.timer <= 0) {
        const lane = game.pattern[game.next % game.pattern.length];
        const note = this.add.image(265 + lane * 145, -30, "signal")
          .setTint(this.laneColors[lane]).setScale(1.18).setDepth(35);
        note.lane = lane; game.notes.push(note); game.next += 1; game.timer = 0.57;
      }
      const hits = [
        takePress("lane0", "left"), takePress("lane1", "down"),
        takePress("lane2", "up"), takePress("lane3", "right")
      ];
      hits.forEach((pressed, lane) => {
        if (!pressed) return;
        const candidates = game.notes.filter((note) => note.lane === lane && !note.hit)
          .sort((a,b) => Math.abs(a.y-430)-Math.abs(b.y-430));
        const note = candidates[0];
        this.lanes[lane].lane.setFillStyle(this.laneColors[lane], 0.58);
        this.time.delayedCall(100, () => this.lanes[lane]?.lane.setFillStyle(P.black, 0.48));
        if (note && Math.abs(note.y - 430) < 78) {
          note.hit = true; game.hits += 1; state.score += Math.abs(note.y-430) < 25 ? 1400 : 900;
          sound.beat(lane); setObjective(`HITS ${game.hits} / 12`);
          if (!state.reducedMotion) this.rhythmParticles.explode(22, note.x, 430);
          this.cameraShake(60, 0.004);
          if (game.hits >= 12) completeLevel();
        } else { state.score = Math.max(0, state.score - 100); sound.miss(); }
      });
      game.notes.forEach((note) => {
        note.y += 325 * dt;
        const perspective = Phaser.Math.Linear(0.62, 1.25, Phaser.Math.Clamp(note.y / 460, 0, 1));
        note.setScale(perspective);
        if (!note.hit && note.y > 510) { note.hit = true; game.misses += 1; sound.miss(); }
      });
      game.notes = game.notes.filter((note) => {
        if (note.hit) { note.destroy(); return false; }
        return true;
      });
    }

    updateChase(time, dt) {
      const game = this.chase;
      game.invulnerable = Math.max(0, game.invulnerable - dt);
      let dx = (down("right")?1:0) - (down("left")?1:0);
      let dy = (down("down")?1:0) - (down("up")?1:0);
      if (dx || dy) {
        const length = Math.hypot(dx, dy); dx /= length; dy /= length;
        this.moveInMaze(this.boyo, dx * 235 * dt, dy * 235 * dt, game.walls, 22);
        this.boyo.face(dx); this.boyo.animate(time, true);
      } else this.boyo.animate(time, false);
      game.signals = game.signals.filter((signal) => {
        signal.rotation += dt * 2.8;
        if (Phaser.Math.Distance.Between(this.boyo.x, this.boyo.y - 60, signal.x, signal.y) < 48) {
          game.collected += 1; state.score += 1500; sound.collect(); signal.destroy();
          setObjective(`SIGNALS ${game.collected} / 6`);
          this.cameraFlash(100, 50, 255, 100);
          if (game.collected >= 6) completeLevel();
          return false;
        }
        return true;
      });
      game.enemies.forEach((enemy, index) => {
        enemy.rotation += dt * (index % 2 ? -2 : 2);
        const vx = this.boyo.x - enemy.x, vy = (this.boyo.y - 65) - enemy.y;
        const length = Math.max(1, Math.hypot(vx, vy));
        const wobble = Math.sin(this.elapsed * 2 + index) * 0.28;
        this.moveInMaze(enemy, ((vx/length)-(vy/length)*wobble)*enemy.speed*dt,
          ((vy/length)+(vx/length)*wobble)*enemy.speed*dt, game.walls, 20);
        if (game.invulnerable <= 0 &&
            Phaser.Math.Distance.Between(this.boyo.x, this.boyo.y-65, enemy.x, enemy.y) < 46) {
          game.invulnerable = 1.25; state.lives -= 1; this.boyo.x = 120; this.boyo.y = 320;
          this.cameraShake(220, 0.022); sound.hit();
          if (state.lives <= 0) failLevel("The shadows caught BOYO fuming.");
        }
      });
    }

    updateArena(time, dt) {
      const game = this.arena;
      game.invulnerable = Math.max(0, game.invulnerable - dt);
      game.fire = Math.max(0, game.fire - dt);
      let dx = (down("right")?1:0) - (down("left")?1:0);
      let dy = (down("down")?1:0) - (down("up")?1:0);
      if (dx || dy) {
        const length = Math.hypot(dx,dy); dx/=length; dy/=length;
        this.boyo.x = Phaser.Math.Clamp(this.boyo.x + dx*245*dt, 55, W-55);
        this.boyo.y = Phaser.Math.Clamp(this.boyo.y + dy*245*dt, 130, H-10);
        this.arenaAngle = Math.atan2(dy,dx); this.boyo.face(dx);
      }
      this.boyo.animate(time, Boolean(dx||dy), false, down("action"));
      game.spawn -= dt;
      if (game.spawn <= 0) {
        const edge = Phaser.Math.Between(0,3);
        let x, y;
        if (edge===0) {x=Math.random()*W;y=-30;} else if(edge===1){x=W+30;y=Math.random()*H;}
        else if(edge===2){x=Math.random()*W;y=H+30;} else{x=-30;y=Math.random()*H;}
        const enemy = this.add.image(x,y,"enemy").setTint(Math.random()>0.5?P.red:P.violet).setDepth(25);
        enemy.speed = 78 + Math.random()*52; game.enemies.push(enemy);
        game.spawn = Math.max(0.42, 0.95 - this.elapsed*0.012);
      }
      if ((down("action") || takePress("action")) && game.fire <= 0) {
        let angle = this.arenaAngle || 0;
        const nearest = game.enemies.slice().sort((a,b) =>
          Phaser.Math.Distance.Between(this.boyo.x,this.boyo.y,a.x,a.y) -
          Phaser.Math.Distance.Between(this.boyo.x,this.boyo.y,b.x,b.y))[0];
        if (nearest) angle = Phaser.Math.Angle.Between(this.boyo.x,this.boyo.y-62,nearest.x,nearest.y);
        this.arenaAngle = angle;
        const bullet = this.add.image(this.boyo.x+Math.cos(angle)*30,this.boyo.y-62+Math.sin(angle)*30,"spark")
          .setTint(P.screenInk).setScale(1.2).setDepth(40);
        bullet.vx=Math.cos(angle)*610;bullet.vy=Math.sin(angle)*610;game.bullets.push(bullet);
        game.fire=0.16;sound.fire();
      }
      this.aimLine.setPosition(this.boyo.x,this.boyo.y-62).setRotation(this.arenaAngle||0);
      game.bullets.forEach((bullet)=>{bullet.x+=bullet.vx*dt;bullet.y+=bullet.vy*dt;});
      game.enemies.forEach((enemy)=>{
        enemy.rotation += dt*2;
        const angle=Phaser.Math.Angle.Between(enemy.x,enemy.y,this.boyo.x,this.boyo.y-62);
        enemy.x+=Math.cos(angle)*enemy.speed*dt;enemy.y+=Math.sin(angle)*enemy.speed*dt;
        if(game.invulnerable<=0 && !enemy.dead &&
          Phaser.Math.Distance.Between(this.boyo.x,this.boyo.y-62,enemy.x,enemy.y)<45){
          enemy.dead=true;game.invulnerable=1.1;state.lives-=1;this.cameraShake(210,0.025);sound.hit();
          if(state.lives<=0)failLevel("The arena folded BOYO.");
        }
        game.bullets.forEach((bullet)=>{
          if(!enemy.dead && Phaser.Math.Distance.Between(bullet.x,bullet.y,enemy.x,enemy.y)<30){
            enemy.dead=true;bullet.dead=true;game.kills+=1;state.score+=950;sound.collect();
            if(!state.reducedMotion)this.arenaParticles.explode(24,enemy.x,enemy.y);
            setObjective(`PESTS ${game.kills} / 12`);
            if(game.kills>=12)completeLevel();
          }
        });
      });
      game.bullets=game.bullets.filter((bullet)=>{
        if(bullet.dead||bullet.x<-40||bullet.x>W+40||bullet.y<-40||bullet.y>H+40){bullet.destroy();return false;}
        return true;
      });
      game.enemies=game.enemies.filter((enemy)=>{if(enemy.dead){enemy.destroy();return false;}return true;});
    }

    updateMemory(time, dt) {
      const game = this.memory;
      this.boyo.animate(time, false, false, game.active >= 0);
      game.timer -= dt;
      if (game.phase === "waiting" && game.timer <= 0) {
        game.phase = "showing"; game.showIndex = 0; this.activatePad(game.sequence[0]); game.timer = 0.5;
      } else if (game.phase === "showing" && game.timer <= 0) {
        if (game.active >= 0) {
          this.deactivatePads(); game.timer = 0.2;
        } else {
          game.showIndex += 1;
          if (game.showIndex >= game.sequence.length) {
            game.phase = "input"; game.inputIndex = 0; this.memoryTitle.setText("PAY THE PATTERN");
            setObjective(`ROUND ${game.round} / 3 — REPEAT`);
            announce(`Repeat the ${game.sequence.length} panel sequence.`);
          } else { this.activatePad(game.sequence[game.showIndex]); game.timer = 0.5; }
        }
      } else if (game.phase === "flash" && game.timer <= 0) {
        this.deactivatePads(); game.phase = "input";
      }
    }

    prepareMemory(fresh) {
      const game = this.memory;
      if (fresh) {
        game.sequence = Array.from({length:game.round+2},()=>Phaser.Math.Between(0,3));
      }
      game.inputIndex=0;game.phase="waiting";game.timer=0.8;game.showIndex=-1;game.active=-1;
      this.memoryTitle?.setText("WATCH BOYO'S MONEY");
      setObjective(`ROUND ${game.round} / 3 — WATCH`);
    }

    activatePad(index) {
      const game = this.memory;
      this.deactivatePads();
      game.active=index;
      const pad=game.pads[index];
      pad.shade.setFillStyle([P.red,P.yellow,P.cyan,P.violet][index],0.28).setScale(1.04);
      pad.frame.setAlpha(1).setScale(1.04);
      pad.label.setScale(1.08);
      sound.beat(index);
      this.cameraFlash(55,
        index===0?255:index===2?30:90,index===1?230:40,index===2?255:index===3?220:50);
    }

    deactivatePads() {
      const game=this.memory;
      game.active=-1;
      game.pads.forEach((pad)=>{
        pad.shade.setFillStyle(P.black,0.58).setScale(1);
        pad.frame.setAlpha(0.88).setScale(1);
        pad.label.setScale(1);
      });
    }

    memoryPointer(x,y) {
      const game=this.memory;
      if(!game||game.phase!=="input")return;
      game.pads.forEach((pad,index)=>{
        if(x>=pad.x&&x<=pad.x+pad.w&&y>=pad.y&&y<=pad.y+pad.h)this.memoryPress(index);
      });
    }

    memoryPress(index) {
      const game=this.memory;
      if(!game||game.phase!=="input")return;
      this.activatePad(index);game.phase="flash";game.timer=0.17;
      if(index!==game.sequence[game.inputIndex]){
        state.lives-=1;state.score=Math.max(0,state.score-250);sound.hit();this.cameraShake(180,0.02);
        announce("Wrong panel. Watch the sequence again.");
        if(state.lives<=0){failLevel("PAY ME PANIC broke the pattern.");return;}
        this.time.delayedCall(380,()=>{if(state.mode==="playing")this.prepareMemory(false);});
        return;
      }
      state.score+=500;game.inputIndex+=1;
      if(game.inputIndex>=game.sequence.length){
        if(game.round>=3){completeLevel();return;}
        game.round+=1;state.score+=1000;announce(`Round ${game.round-1} clear. Watch the next pattern.`);
        this.time.delayedCall(450,()=>{if(state.mode==="playing")this.prepareMemory(true);});
      }
    }

    moveInMaze(object, dx, dy, walls, radius) {
      const nextX=Phaser.Math.Clamp(object.x+dx,radius,W-radius);
      if(!walls.some((wall)=>this.circleRect(nextX,object.y,radius,wall)))object.x=nextX;
      const nextY=Phaser.Math.Clamp(object.y+dy,radius,H-radius);
      if(!walls.some((wall)=>this.circleRect(object.x,nextY,radius,wall)))object.y=nextY;
    }

    circleRect(x,y,radius,rect) {
      const nearX=Phaser.Math.Clamp(x,rect.x,rect.x+rect.w);
      const nearY=Phaser.Math.Clamp(y,rect.y,rect.y+rect.h);
      return Phaser.Math.Distance.Between(x,y,nearX,nearY)<radius;
    }

    flashQuote() {
      if (!this.boyo || state.reducedMotion) return;
      const bubble=this.add.container(this.boyo.x+40,this.boyo.y-176).setDepth(100);
      const text=this.add.text(0,0,state.quote,{
        fontFamily:"Segoe UI, sans-serif",fontSize:"14px",fontStyle:"900",
        color:CSS.black,backgroundColor:CSS.white,padding:{x:10,y:7}
      }).setOrigin(0.5);
      bubble.add(text);
      this.tweens.add({targets:bubble,y:"-=20",alpha:0,duration:1450,ease:"Cubic.out",
        onComplete:()=>bubble.destroy()});
    }

    freezeFailure() {
      this.finished=true;
      this.cameraShake(260,0.025);
      this.cameraFlash(260, 160, 0, 20);
    }

    celebrate() {
      this.finished=true;
      this.cameraFlash(320,255,255,255);
      if (state.reducedMotion) return;
      this.tweens.add({targets:this.cameras.main,zoom:1.06,duration:420,ease:"Cubic.easeOut"});
      if(this.boyo)this.tweens.add({targets:this.boyo,y:"-=28",duration:170,yoyo:true,repeat:2});
      const emitter=this.add.particles(W/2,H/2,"spark",{
        speed:{min:150,max:540},angle:{min:0,max:360},lifespan:900,
        scale:{start:1.4,end:0},tint:[P.white,P.red,P.screenInk],emitting:false
      }).setDepth(120);
      emitter.explode(90,W/2,H/2);
    }

    cameraShake(duration, intensity) {
      if (!state.reducedMotion) this.cameras.main.shake(duration, intensity);
    }

    cameraFlash(duration, red, green, blue) {
      if (!state.reducedMotion) this.cameras.main.flash(duration, red, green, blue, false);
    }
  }

  function normalizeKey(key) {
    const value = key.toLowerCase();
    if (value === "arrowleft" || value === "a") return "left";
    if (value === "arrowright") return "right";
    if (value === "arrowup" || value === "w") return "up";
    if (value === "arrowdown" || value === "s") return "down";
    if (value === " " || value === "enter") return "action";
    return value;
  }

  function keyDown(event) {
    const key=event.key.toLowerCase();
    const isGameplayKey=["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"," "].includes(event.key);
    const isInteractive=event.target instanceof Element &&
      Boolean(event.target.closest("button, a, input, textarea, select"));
    if (isGameplayKey && ["playing","paused"].includes(state.mode)) event.preventDefault();
    if (isInteractive && !["playing","paused"].includes(state.mode)) return;
    if(key==="p"||key==="escape"){togglePause();return;}
    if(key==="r"&&["playing","paused"].includes(state.mode)){startLevel();return;}
    if(state.mode==="brief"&&(key==="enter"||key===" ")){startLevel();return;}
    const lanes={d:"lane0",f:"lane1",j:"lane2",k:"lane3"};
    if((state.levelIndex===1||state.levelIndex===4)&&lanes[key]){
      if(!event.repeat)controls.pressed.add(lanes[key]);controls.down.add(lanes[key]);
      if(state.levelIndex===4)scene()?.memoryPress(Number(lanes[key].slice(-1)));
      return;
    }
    const normalized=normalizeKey(event.key);
    if(!event.repeat)controls.pressed.add(normalized);
    controls.down.add(normalized);
    if(state.levelIndex===4&&state.mode==="playing"){
      const map={left:0,up:1,down:2,right:3};if(normalized in map)scene()?.memoryPress(map[normalized]);
    }
  }

  function keyUp(event) {
    const key=event.key.toLowerCase();
    const lanes={d:"lane0",f:"lane1",j:"lane2",k:"lane3"};
    if(lanes[key])controls.down.delete(lanes[key]);
    controls.down.delete(normalizeKey(event.key));
  }

  document.addEventListener("keydown",keyDown);
  document.addEventListener("keyup",keyUp);
  window.addEventListener("blur",()=>{controls.down.clear();if(state.mode==="playing")togglePause(true);});

  document.querySelectorAll("[data-level]").forEach((button)=>
    button.addEventListener("click",()=>chooseLevel(button.dataset.level)));
  document.querySelectorAll("[data-launch]").forEach((button)=>button.addEventListener("click",()=>{
    document.getElementById("game").scrollIntoView({behavior:state.reducedMotion?"auto":"smooth"});
    window.setTimeout(()=>chooseLevel(button.dataset.launch),state.reducedMotion?0:420);
  }));
  document.querySelectorAll("[data-input]").forEach((button)=>{
    const input=button.dataset.input;
    const press=(event)=>{
      event.preventDefault();button.classList.add("active");
      const mapped=input==="secondary"?"action":input;
      controls.down.add(mapped);controls.pressed.add(mapped);
      if(state.levelIndex===4&&state.mode==="playing"){
        const map={left:0,up:1,down:2,right:3};if(mapped in map)scene()?.memoryPress(map[mapped]);
      }
    };
    const release=(event)=>{event.preventDefault();button.classList.remove("active");
      controls.down.delete(input==="secondary"?"action":input);};
    button.addEventListener("pointerdown",press);button.addEventListener("pointerup",release);
    button.addEventListener("pointercancel",release);button.addEventListener("pointerleave",release);
  });

  ui.beginLevel.addEventListener("click",startLevel);
  document.getElementById("resumeGame").addEventListener("click",()=>togglePause(false));
  document.getElementById("restartGame").addEventListener("click",startLevel);
  document.getElementById("exitGame").addEventListener("click",showMenu);
  document.getElementById("menuButton").addEventListener("click",showMenu);
  document.getElementById("pauseButton").addEventListener("click",()=>togglePause());
  document.getElementById("nextLevel").addEventListener("click",goToNextLevel);
  document.getElementById("skipReward").addEventListener("click",goToNextLevel);
  document.getElementById("randomVideo").addEventListener("click",loadRandomVideo);
  ui.soundToggle.addEventListener("click",()=>{
    state.sound=!state.sound;ui.soundToggle.setAttribute("aria-pressed",String(state.sound));
    ui.soundToggle.setAttribute("aria-label",state.sound?"Mute game sounds":"Turn on game sounds");
    ui.soundToggle.lastChild.textContent=state.sound?"Sound on":"Sound off";
    if(state.sound)sound.menu();announce(state.sound?"Sound on.":"Sound muted.");
  });
  document.getElementById("fullscreenButton").addEventListener("click",async()=>{
    try{
      if(!document.fullscreenElement)await document.querySelector(".game-section").requestFullscreen();
      else await document.exitFullscreen();
    }catch{announce("Fullscreen mode is not available in this browser.");}
  });

  phaserGame = new Phaser.Game({
    type: Phaser.AUTO,
    width: W,
    height: H,
    parent: "gameCanvas",
    transparent: false,
    backgroundColor: CSS.screen,
    render: { antialias: true, roundPixels: false, powerPreference: "high-performance" },
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: W, height: H },
    physics: { default: "arcade", arcade: { gravity: { y: 0 }, debug: false } },
    scene: [BoyoScene],
    audio: { noAudio: true }
  });

  setHud();
  showMenu();
})();
