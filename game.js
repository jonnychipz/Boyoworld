(() => {
  "use strict";

  const VIDEOS = [
    ["eFhGFcPTNWc", "TONEDEF"],
    ["0o7RmMrxvko", "RED BRICK"],
    ["rRkw3Q7A8cQ", "SPITFIRE"],
    ["fuyD1Tkhkcc", "FUMING"],
    ["HNUtBySf-aU", "PAY ME"],
    ["u_IWzvxKSek", "DIOR"],
    ["9GRk3C1SbDQ", "SAVAGE"],
    ["J9dtVaabyVM", "PWY WYT TI"],
    ["SEBZABjtZBU", "RAW PAP"],
    ["-TRfGBNlQ5E", "RAW PAP TRAILER"]
  ];
  const QUOTES = ["WEAKIES", "LIAR", "TAP DOWN", "6P", "WET EGG", "SPIN THE BLOCK", "RUN IT"];

  const ui = {
    menu: document.getElementById("gameMenu"),
    levelCard: document.getElementById("levelCard"),
    pauseCard: document.getElementById("pauseCard"),
    rewardCard: document.getElementById("rewardCard"),
    rewardVideo: document.getElementById("rewardVideo"),
    rewardTitle: document.getElementById("rewardTitle"),
    guide: document.getElementById("gameGuide"),
    guideProgress: document.getElementById("guideProgress"),
    guideCount: document.getElementById("guideCount"),
    briefing: document.getElementById("gameBriefing"),
    machineStatus: document.getElementById("machineStatus"),
    scoreReadout: document.getElementById("scoreReadout"),
    lifeReadout: document.getElementById("lifeReadout"),
    objectiveReadout: document.getElementById("objectiveReadout"),
    quoteReadout: document.getElementById("quoteReadout"),
    announcements: document.getElementById("gameAnnouncements"),
    soundToggle: document.getElementById("soundToggle"),
    pauseButton: document.getElementById("pauseButton"),
    threeHud: document.getElementById("threeHud"),
    threeHealthBar: document.getElementById("threeHealthBar"),
    threeHealthText: document.getElementById("threeHealthText"),
    threeTarget: document.getElementById("threeTarget"),
    threeMinimap: document.getElementById("threeMinimap"),
    threeDistrict: document.getElementById("threeDistrict"),
    threeWave: document.getElementById("threeWave"),
    threeCoins: document.getElementById("threeCoins"),
    threeSignal: document.getElementById("threeSignal"),
    screen: document.getElementById("screen"),
    scratchCard: document.getElementById("scratchCard"),
    scratchCodePanel: document.getElementById("scratchCodePanel"),
    scratchCanvas: document.getElementById("scratchCanvas"),
    discountCode: document.getElementById("discountCode"),
    copyDiscountCode: document.getElementById("copyDiscountCode"),
    copyCodeStatus: document.getElementById("copyCodeStatus")
  };

  const state = {
    mode: "menu",
    score: 0,
    sound: true,
    audio: null,
    reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
    world: null,
    kills: 0,
    coins: 0,
    readyAt: 0,
    briefingTimer: null,
    quoteTimer: null,
    rewardTimer: null,
    copyResetTimer: null,
    lastVideo: -1,
    rewardScrollY: 0,
    pendingWarp: null
  };

  const controls = { down: new Set(), pressed: new Set() };

  function announce(message) {
    ui.announcements.textContent = "";
    setTimeout(() => { ui.announcements.textContent = message; }, 20);
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
    menu: () => tone(180, 0.07, "square", 0.028, 120),
    fire: () => {
      const audio = audioContext();
      if (!audio) return;
      const now = audio.currentTime;
      const duration = 0.13;
      const buffer = audio.createBuffer(1, Math.ceil(audio.sampleRate * duration), audio.sampleRate);
      const samples = buffer.getChannelData(0);
      for (let index = 0; index < samples.length; index += 1) {
        const envelope = Math.exp(-index / (audio.sampleRate * 0.022));
        samples[index] = (Math.random() * 2 - 1) * envelope;
      }
      const crack = audio.createBufferSource();
      const crackFilter = audio.createBiquadFilter();
      const crackGain = audio.createGain();
      crack.buffer = buffer;
      crackFilter.type = "bandpass";
      crackFilter.frequency.setValueAtTime(1850, now);
      crackFilter.Q.setValueAtTime(0.72, now);
      crackGain.gain.setValueAtTime(0.16, now);
      crackGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      crack.connect(crackFilter).connect(crackGain).connect(audio.destination);

      const body = audio.createOscillator();
      const bodyFilter = audio.createBiquadFilter();
      const bodyGain = audio.createGain();
      body.type = "sine";
      body.frequency.setValueAtTime(115, now);
      body.frequency.exponentialRampToValueAtTime(42, now + 0.09);
      bodyFilter.type = "lowpass";
      bodyFilter.frequency.value = 180;
      bodyGain.gain.setValueAtTime(0.085, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
      body.connect(bodyFilter).connect(bodyGain).connect(audio.destination);
      crack.start(now);
      crack.stop(now + duration);
      body.start(now);
      body.stop(now + 0.12);
    },
    hit: () => tone(88, 0.16, "sawtooth", 0.048, -48),
    collect: () => {
      tone(520, 0.08, "square", 0.04, 250);
      setTimeout(() => tone(820, 0.1, "triangle", 0.035), 60);
    },
    win: () => [330, 440, 550, 760].forEach((note, index) =>
      setTimeout(() => tone(note, 0.18, "square", 0.04, 100), index * 95))
  };

  function setMode(mode) {
    state.mode = mode;
    document.body.dataset.gameMode = mode;
  }

  function updateHud(kills = state.kills, target = 25) {
    state.kills = kills;
    state.score = kills * 1000 + state.coins * 500;
    ui.scoreReadout.textContent = `SCORE ${String(state.score).padStart(6, "0")}`;
    ui.guideProgress.style.width = `${(kills / target) * 100}%`;
    ui.guideCount.textContent = `${kills} / ${target}`;
    ui.objectiveReadout.textContent = `SURREALS ${kills} / ${target}`;
  }

  function showMenu() {
    destroyWorld();
    clearRewardTimer();
    setMode("menu");
    controls.down.clear();
    controls.pressed.clear();
    ui.menu.hidden = false;
    ui.levelCard.hidden = true;
    ui.pauseCard.hidden = true;
    ui.rewardCard.hidden = true;
    ui.guide.hidden = true;
    ui.briefing.hidden = true;
    ui.threeHud.hidden = true;
    ui.threeHud.setAttribute("aria-hidden", "true");
    ui.screen.classList.remove("three-active");
    ui.screen.classList.remove("reward-active");
    ui.machineStatus.textContent = "BOYOWORLD SIGNAL READY";
    ui.lifeReadout.textContent = "BOYO HP 100%";
    ui.objectiveReadout.textContent = "ENTER THE BOROUGH";
    updateHud(0);
    stopRewardVideo();
    announce("BOYOWORLD is ready.");
  }

  function isMobileGameView() {
    return matchMedia("(pointer: coarse)").matches || innerWidth <= 820;
  }

  async function enterMobileGame() {
    if (!isMobileGameView()) {
      startWorld();
      return;
    }
    const fullscreenTarget = document.querySelector(".cabinet");
    try {
      if (!document.fullscreenElement) {
        await fullscreenTarget.requestFullscreen({ navigationUI: "hide" });
      }
    } catch {
      fullscreenTarget.classList.add("is-mobile-expanded");
      document.body.classList.add("mobile-game-active");
    }
    try {
      await screen.orientation?.lock?.("landscape");
    } catch {
      // Orientation locking is optional and often unavailable outside installed apps.
    }
    startWorld();
  }

  function startWorld() {
    destroyWorld();
    clearRewardTimer();
    audioContext();
    setMode("playing");
    controls.down.clear();
    controls.pressed.clear();
    ui.menu.hidden = true;
    ui.levelCard.hidden = true;
    ui.pauseCard.hidden = true;
    ui.rewardCard.hidden = true;
    ui.guide.hidden = false;
    ui.briefing.hidden = false;
    ui.threeHud.hidden = false;
    ui.threeHud.setAttribute("aria-hidden", "false");
    ui.screen.classList.add("three-active");
    ui.screen.classList.remove("reward-active");
    ui.machineStatus.textContent = "BOROUGH ACTIVE";
    ui.threeHealthBar.style.width = "100%";
    ui.threeHealthText.textContent = "100%";
    ui.threeTarget.textContent = "SCANNING FOR SURREALS";
    ui.threeDistrict.textContent = "SPIN BLOCK CENTRAL";
    ui.threeWave.textContent = "25 KILLS TO CLEAR";
    ui.threeCoins.textContent = "BOYO COINS 0 / 30";
    state.kills = 0;
    state.coins = 0;
    state.readyAt = performance.now() + (state.reducedMotion ? 900 : 2300);
    updateHud(0);
    state.world = new window.BoyoThreeWorld(document.getElementById("gameCanvas"), {
      controls,
      reducedMotion: state.reducedMotion,
      readyAt: state.readyAt,
      minimap: ui.threeMinimap,
      sound,
      soundEnabled: () => state.sound,
      onProgress: (kills, target, enemyName, phrase) => {
        updateHud(kills, target);
        ui.threeWave.textContent = kills >= target ? "BOROUGH CLEARED" : `${target - kills} SURREALS REMAIN`;
        if (enemyName) {
          announce(
            `${enemyName} defeated. BOYO says ${phrase || "NO WEAKIES!"} ` +
            `${target - kills} surreal enemies remain.`
          );
        }

      },
      onHealth: (health) => {
        ui.threeHealthBar.style.width = `${health}%`;
        ui.threeHealthBar.style.background = health > 55 ? "#5df5c8" : health > 25 ? "#ffd33d" : "#e21c3d";
        ui.threeHealthText.textContent = `${health}%`;
        ui.lifeReadout.textContent = `BOYO HP ${health}%`;
      },
      onCoin: (coins, target, health) => {
        state.coins = coins;
        ui.threeCoins.textContent = `BOYO COINS ${coins} / ${target}`;
        updateHud();
        announce(`BOYO coin collected. ${coins} of ${target}. Health ${health} percent.`);
      },
      onTarget: (target) => { ui.threeTarget.textContent = target; },
      onDistrict: (district) => { ui.threeDistrict.textContent = district; },
      onComplete: completeWorld,
      onFail: failWorld,
      onMediaSignal: (name, dist, volume = 0) => {
        if (ui.threeSignal) {
          ui.threeSignal.textContent = name
            ? `📡 ${name} — ${Math.round(dist)}u · ${Math.round(volume * 100)}%`
            : "NO SIGNAL";
        }
      }
    });
    state.world.primeMedia?.();
    // Handle pending warp-to-station from deep-link buttons
    if (state.pendingWarp) {
      const id = state.pendingWarp;
      state.pendingWarp = null;
      setTimeout(() => state.world?.warpPlayerToStation?.(id), 600);
    }
    if (state.briefingTimer) clearTimeout(state.briefingTimer);
    state.briefingTimer = setTimeout(() => {
      ui.briefing.hidden = true;
      state.briefingTimer = null;
    }, state.reducedMotion ? 900 : 2300);
    rotateQuote();
    document.getElementById("gameCanvas").focus({ preventScroll: true });
    sound.menu();
    announce("BOYOWORLD started. Defeat twenty-five surreal enemies.");
  }

  function destroyWorld() {
    if (state.world) {
      state.world.destroy();
      state.world = null;
    }
    if (state.briefingTimer) clearTimeout(state.briefingTimer);
    if (state.quoteTimer) clearTimeout(state.quoteTimer);
  }

  function clearRewardTimer() {
    if (!state.rewardTimer) return;
    clearTimeout(state.rewardTimer);
    state.rewardTimer = null;
  }

  function togglePause(force) {
    if (!["playing", "paused"].includes(state.mode)) return;
    const paused = typeof force === "boolean" ? force : state.mode === "playing";
    setMode(paused ? "paused" : "playing");
    ui.pauseCard.hidden = !paused;
    ui.pauseButton.textContent = paused ? "Resume" : "Pause";
    ui.machineStatus.textContent = paused ? "SIGNAL HELD" : "BOROUGH ACTIVE";
    if (paused) state.world?.stopWorldAudio();
    state.world?.setPaused(paused);
    announce(paused ? "BOYOWORLD paused." : "BOYOWORLD resumed.");
  }

  function failWorld(message) {
    setMode("failed");
    state.world?.stopWorldAudio();
    state.world?.setPaused(true);
    ui.guide.hidden = true;
    ui.levelCard.hidden = false;
    document.getElementById("levelGenre").textContent = "BOYO DOWN / TRY AGAIN";
    document.getElementById("levelName").textContent = "NO WEAKIES.";
    document.getElementById("levelObjective").textContent = `${message} Re-enter BOYOWORLD and defeat twenty-five.`;
    ui.machineStatus.textContent = "RETRY READY";
    announce(message);
  }

  function completeWorld() {
    if (state.mode === "reward") return;
    state.rewardScrollY = scrollY;
    setMode("reward");
    state.world?.stopWorldAudio();
    state.world?.setPaused(true);
    ui.guide.hidden = true;
    ui.briefing.hidden = true;
    ui.machineStatus.textContent = "BOROUGH CLEARED";
    ui.objectiveReadout.textContent = "25 / 25 · TRANSMISSION UNLOCKED";
    sound.win();
    const completedWorld = state.world;
    state.rewardTimer = setTimeout(() => {
      state.rewardTimer = null;
      if (state.mode !== "reward" || state.world !== completedWorld) return;
      ui.rewardCard.hidden = false;
      ui.screen.classList.add("reward-active");
      setupScratchCard();
      loadRandomVideo();
      restoreRewardScroll();
    }, 0);
  }

  function setupScratchCard() {
    ui.discountCode.textContent = "TEST-NOT-REAL-CODE";
    ui.copyCodeStatus.textContent = "";
    ui.copyDiscountCode.textContent = "Copy code";
    ui.copyDiscountCode.hidden = true;
    ui.scratchCard.classList.remove("is-revealed");
    ui.scratchCodePanel.setAttribute("aria-hidden", "true");
    const canvas = ui.scratchCanvas;
    canvas.classList.remove("is-revealed");
    canvas.style.pointerEvents = "auto";
    const context = canvas.getContext("2d");
    context.globalCompositeOperation = "source-over";
    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#8a8d95");
    gradient.addColorStop(0.45, "#e7e7eb");
    gradient.addColorStop(1, "#6f727b");
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "rgba(255,255,255,.45)";
    context.lineWidth = 2;
    for (let x = -canvas.height; x < canvas.width; x += 18) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x + canvas.height, canvas.height);
      context.stroke();
    }

    context.fillStyle = "#111";
    context.font = "900 28px Consolas, monospace";
    context.textAlign = "center";
    context.fillText("SCRATCH ME", canvas.width / 2, canvas.height / 2 + 9);
    let scratching = false;
    let scratchMoves = 0;
    const revealCode = () => {
      ui.copyDiscountCode.hidden = false;
      ui.scratchCard.classList.add("is-revealed");
      ui.scratchCodePanel.setAttribute("aria-hidden", "false");
      canvas.classList.add("is-revealed");
      canvas.style.pointerEvents = "none";
    };
    const scratch = (event) => {
      if (!scratching && event.type !== "pointerdown") return;
      const rect = canvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
      const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
      context.globalCompositeOperation = "destination-out";
      context.beginPath();
      context.arc(x, y, 24, 0, Math.PI * 2);
      context.fill();
      scratchMoves += 1;
      if (scratchMoves >= 12) revealCode();
    };
    canvas.onpointerdown = (event) => {
      scratching = true;
      canvas.setPointerCapture?.(event.pointerId);
      scratch(event);
    };
    canvas.onpointermove = scratch;
    canvas.onpointerup = (event) => {
      scratching = false;
      canvas.releasePointerCapture?.(event.pointerId);
    };
    canvas.onpointercancel = () => { scratching = false; };
  }

  async function copyDiscountCode() {
    const code = ui.discountCode.textContent.trim();
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const input = document.createElement("textarea");
      input.value = code;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    ui.copyDiscountCode.textContent = "Copied";
    ui.copyCodeStatus.textContent = `${code} copied to clipboard`;
    if (state.copyResetTimer) clearTimeout(state.copyResetTimer);
    state.copyResetTimer = setTimeout(() => {
      ui.copyDiscountCode.textContent = "Copy code";
      state.copyResetTimer = null;
    }, 1800);
  }

  function loadRandomVideo() {
    let index = Math.floor(Math.random() * VIDEOS.length);
    if (VIDEOS.length > 1 && index === state.lastVideo) index = (index + 1) % VIDEOS.length;
    state.lastVideo = index;
    const [id, title] = VIDEOS[index];
    ui.rewardTitle.textContent = title;
    ui.rewardVideo.src =
      `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0&modestbranding=1`;
    requestAnimationFrame(restoreRewardScroll);
    setTimeout(restoreRewardScroll, 160);
  }

  function stopRewardVideo() {
    ui.rewardVideo.src = "";
  }

  function restoreRewardScroll() {
    if (state.mode === "reward") window.scrollTo({ top: state.rewardScrollY, behavior: "instant" });
  }

  function rotateQuote() {
    if (!["playing", "paused"].includes(state.mode)) return;
    ui.quoteReadout.textContent = `“${QUOTES[Math.floor(Math.random() * QUOTES.length)]}”`;
    state.quoteTimer = setTimeout(rotateQuote, 3200 + Math.random() * 2200);
  }

  function normalizeKey(key) {
    const value = key.toLowerCase();
    if (value === "arrowleft") return "left";
    if (value === "arrowright") return "right";
    if (value === "arrowup") return "up";
    if (value === "arrowdown") return "down";
    if (value === " ") return "action";
    if (value === "b") return "secondary";
    return value;
  }

  function keyDown(event) {
    const normalized = normalizeKey(event.key);
    if (["left", "right", "up", "down", "action"].includes(normalized) &&
        ["playing", "paused"].includes(state.mode)) event.preventDefault();
    if (event.key === "Escape") {
      if (document.fullscreenElement) {
        event.preventDefault();
        controls.down.clear();
        document.exitFullscreen().catch(() => {
          announce("Press Escape again to leave fullscreen.");
        });
        return;
      }
      togglePause();
      return;
    }
    if (event.key.toLowerCase() === "p") {
      togglePause();
      return;
    }
    if (event.key.toLowerCase() === "r" && ["playing", "paused", "failed"].includes(state.mode)) {
      startWorld();
      return;
    }
    if (state.mode !== "playing") return;
    if (!event.repeat) controls.pressed.add(normalized);
    controls.down.add(normalized);
  }

  function keyUp(event) {
    controls.down.delete(normalizeKey(event.key));
  }

  function bindTouchControls() {
    document.querySelectorAll("[data-input]").forEach((button) => {
      const input = button.dataset.input;
      const press = (event) => {
        event.preventDefault();
        button.classList.add("active");
        controls.down.add(input);
        controls.pressed.add(input);
      };
      const release = (event) => {
        event.preventDefault();
        button.classList.remove("active");
        controls.down.delete(input);
      };
      button.addEventListener("pointerdown", press);
      button.addEventListener("pointerup", release);
      button.addEventListener("pointercancel", release);
      button.addEventListener("pointerleave", release);
    });
  }

  function bindArchiveInteractions() {
    const archive = document.querySelector(".visual-archive");
    document.querySelectorAll(".marquee-strip a[href]").forEach((tile) => {
      tile.addEventListener("pointerdown", () => {
        archive.classList.add("is-paused");
        tile.classList.remove("is-kicked");
        void tile.offsetWidth;
        tile.classList.add("is-kicked");
        setTimeout(() => {
          archive.classList.remove("is-paused");
          tile.classList.remove("is-kicked");
        }, 900);
      });
    });
  }

  document.addEventListener("keydown", keyDown);
  document.addEventListener("keyup", keyUp);
  window.addEventListener("blur", () => {
    controls.down.clear();
    if (state.mode === "playing") togglePause(true);
  });
  let menuTapStart = null;
  ui.menu.addEventListener("pointerdown", (event) => {
    menuTapStart = { x: event.clientX, y: event.clientY };
  });
  ui.menu.addEventListener("pointerup", (event) => {
    if (state.mode !== "menu" || !menuTapStart) return;
    const distance = Math.hypot(
      event.clientX - menuTapStart.x,
      event.clientY - menuTapStart.y
    );
    menuTapStart = null;
    if (distance > 12 || event.target.closest("button, a")) return;
    enterMobileGame();
  });
  ui.menu.addEventListener("pointercancel", () => { menuTapStart = null; });
  ui.menu.addEventListener("keydown", (event) => {
    if (state.mode !== "menu" || !["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    enterMobileGame();
  });
  document.getElementById("startWorld").addEventListener("click", (event) => {
    event.stopPropagation();
    enterMobileGame();
  });
  document.getElementById("beginLevel").addEventListener("click", startWorld);
  document.getElementById("resumeGame").addEventListener("click", () => togglePause(false));
  document.getElementById("restartGame").addEventListener("click", startWorld);
  document.getElementById("exitGame").addEventListener("click", showMenu);
  document.getElementById("menuButton").addEventListener("click", showMenu);
  document.getElementById("pauseButton").addEventListener("click", () => togglePause());
  document.getElementById("playAgain").addEventListener("click", startWorld);
  document.getElementById("randomVideo").addEventListener("click", loadRandomVideo);
  ui.copyDiscountCode.addEventListener("click", copyDiscountCode);
  ui.rewardVideo.addEventListener("load", restoreRewardScroll);
  ui.soundToggle.addEventListener("click", () => {
    state.sound = !state.sound;
    ui.soundToggle.setAttribute("aria-pressed", String(state.sound));
    ui.soundToggle.setAttribute("aria-label", state.sound ? "Mute game sounds" : "Turn on game sounds");
    ui.soundToggle.lastChild.textContent = state.sound ? "Sound on" : "Sound off";
    if (state.sound) {
      state.world?.primeMedia?.();
      sound.menu();
    }
  });
  const fullscreenButton = document.getElementById("fullscreenButton");
  const fullscreenTarget = document.querySelector(".cabinet");
  const mobileFullscreenExit = document.getElementById("mobileFullscreenExit");
  const updateFullscreenUi = () => {
    const active = document.fullscreenElement === fullscreenTarget;
    fullscreenButton.setAttribute("aria-pressed", String(active));
    fullscreenButton.setAttribute(
      "aria-label",
      active ? "Exit fullscreen game mode" : "Enter fullscreen game mode"
    );
    fullscreenButton.lastChild.textContent = active ? " Exit full screen" : " Full screen";
    fullscreenTarget.classList.toggle("is-fullscreen", active);
    document.body.classList.toggle("mobile-game-active", active && isMobileGameView());
    if (!active) {
      controls.down.clear();
      fullscreenTarget.classList.remove("is-mobile-expanded");
      screen.orientation?.unlock?.();
      document.getElementById("gameCanvas")?.focus({ preventScroll: true });
    }
  };
  fullscreenButton.addEventListener("click", async () => {
    try {
      if (!document.fullscreenElement) await fullscreenTarget.requestFullscreen();
      else await document.exitFullscreen();
    } catch {
      announce("Fullscreen mode is not available in this browser.");
    }
  });
  document.addEventListener("fullscreenchange", updateFullscreenUi);
  updateFullscreenUi();

  mobileFullscreenExit.addEventListener("click", async () => {
    controls.down.clear();
    if (document.fullscreenElement) await document.exitFullscreen();
    fullscreenTarget.classList.remove("is-mobile-expanded");
    document.body.classList.remove("mobile-game-active");
    screen.orientation?.unlock?.();
  });
  bindTouchControls();
  bindArchiveInteractions();

  // Station deep-link warp buttons
  document.querySelectorAll(".station-warp-btn[data-station]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.station;
      if (["playing", "paused"].includes(state.mode) && state.world) {
        state.world.warpPlayerToStation?.(id);
      } else {
        state.pendingWarp = id;
        startWorld();
      }
      document.getElementById("game")?.scrollIntoView({
        behavior: state.reducedMotion ? "auto" : "smooth",
        block: "start"
      });
      document.getElementById("gameCanvas")?.focus({ preventScroll: true });
    });
  });

  // Hero poster parallax (respects reduced-motion)
  if (!state.reducedMotion) {
    const posters = document.querySelectorAll(".poster[data-parallax]");
    document.addEventListener("mousemove", (e) => {
      const cx = innerWidth / 2;
      const cy = innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      posters.forEach((el) => {
        const f = parseFloat(el.dataset.parallax) || 0;
        el.style.transform = `translate(${dx * f * 40}px, ${dy * f * 30}px)`;
      });
    });
  }

  const main = document.querySelector("main");
  const gameSection = document.getElementById("game");
  if (main.firstElementChild !== gameSection) main.prepend(gameSection);
  showMenu();

  const testParams = new URLSearchParams(location.search);
  const writeTestState = () => {
    const worldState = window.__BOYO_THREE_TEST__?.getState() || {};
    const videoRect = document.querySelector(".video-frame").getBoundingClientRect();
    const scratchRect = document.querySelector(".scratch-prize").getBoundingClientRect();
    document.body.dataset.testState = JSON.stringify({
      ...worldState,
      mode: state.mode,
      rewardVisible: !ui.rewardCard.hidden,
      rewardVideo: ui.rewardVideo.src,
      scratchVisible: Boolean(ui.scratchCanvas.offsetParent),
      discountCode: ui.discountCode.textContent,
      copyStatus: ui.copyCodeStatus.textContent,
      announcement: ui.announcements.textContent,
      gameFirst: document.querySelector("main").firstElementChild?.id === "game",
      viewportWidth: innerWidth,
      reducedMotion: state.reducedMotion,
      rewardOverlap: Math.max(0, Math.min(videoRect.bottom, scratchRect.bottom) -
        Math.max(videoRect.top, scratchRect.top))
    });
    if (testParams.get("cleanup") === "1") {
      destroyWorld();
      stopRewardVideo();
    }
  };
  if (testParams.get("testMode") === "1" && testParams.get("autoStart") === "1") {
    setTimeout(() => {
      startWorld();
      if (testParams.get("probe") === "1") {
        setTimeout(writeTestState, 3500);
      }
      if (testParams.get("autoKill") === "1") {
        setTimeout(() => window.__BOYO_THREE_TEST__?.defeatOne(), 2800);
        setTimeout(writeTestState, 3100);
      }
      if (testParams.get("autoPause") === "1") {
        setTimeout(() => {
          togglePause(true);
          setTimeout(writeTestState, 300);
        }, 3000);
      }
      if (testParams.get("restartRace") === "1") {
        setTimeout(() => window.__BOYO_THREE_TEST__?.defeatAll(), 2800);
        setTimeout(startWorld, 3000);
        setTimeout(writeTestState, 4300);
      }
      if (testParams.get("autoWin") === "1") {
        setTimeout(() => window.__BOYO_THREE_TEST__?.defeatAll(), 2800);
        setTimeout(() => {
          if (testParams.get("autoCopy") === "1") {
            ui.copyDiscountCode.hidden = false;
            ui.copyDiscountCode.click();
          }
        }, 4800);
        setTimeout(() => {
          writeTestState();
          destroyWorld();
          stopRewardVideo();
        }, 5200);
      }
    }, 120);
  }
})();
