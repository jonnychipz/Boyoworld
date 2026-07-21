(() => {
  "use strict";

  const THREE = window.THREE;
  if (!THREE) throw new Error("Three.js must load before three-world.js");

  const WORLD_SIZE = 240;
  const HALF_WORLD = WORLD_SIZE / 2 - 5;
  const ENEMY_COUNT = 50;
  const WIN_TARGET = 25;
  const UP = new THREE.Vector3(0, 1, 0);

  const ENEMY_TYPES = [
    "BUM MAN",
    "WEAKIE WALLY",
    "WET EGG",
    "LAMP LAD",
    "BIN GOBLIN",
    "SOFA STEVE",
    "TRAFFIC TONY",
    "PLUG HEAD PETE",
    "CABBAGE FACE",
    "MICROWAVE MIKE"
  ];

  const SILLY_NAMES = [
    "BUM MAN", "WEAKIE WALLY", "WET EGG WENDY", "LAMP LAD LARRY", "BIN GOBLIN BARRY",
    "SOFA STEVE", "TRAFFIC TONY", "PLUG HEAD PETE", "CABBAGE FACE CARL", "MICROWAVE MIKE",
    "DAMP SOCK DEREK", "GRAVEL GARY", "WOBBLY GERALD", "CARPET TILE KYLE", "MUSTARD MERV",
    "DUSTBIN DEBBIE", "SCART LEAD SID", "MOIST KEITH", "TROLLEY TREVOR", "KETTLE KAREN",
    "BREAD BAG BRIAN", "PUDDLE PAUL", "FORKLIFT FRANK", "CURTAIN ROD COLIN", "MOP BUCKET MICK",
    "SHOWER CAP SHANE", "CROCS CLIVE", "RADIATOR RON", "PARKING METER PAT", "TOASTER TINA",
    "GUTTERBALL GAVIN", "WHEELIE BIN WILF", "MATTRESS MANDY", "CABLE TIE CRAIG", "DOORMAT DAVE",
    "HOOVER HARRIET", "CHIP PAN CHRIS", "LOOSE CHANGE LEE", "BROKEN UMBRELLA BOB", "TIN FOIL TIM",
    "PLASTIC CHAIR PHIL", "EGG CUP ERIC", "LINT ROLLER LISA", "SPARE TYRE SIMON", "BROOMSTICK BEV",
    "FLAT BATTERY FRED", "CARDBOARD KEVIN", "TRAFFIC ISLAND TERRY", "WET WIPE WAYNE", "WALL PLUG WALTER"
  ];

  const DISTRICTS = [
    { name: "SPIN BLOCK CENTRAL", x: 0, z: 0, color: 0xe21c3d },
    { name: "BANSHEES QUARTER", x: -72, z: -62, color: 0xff4a82 },
    { name: "WEAKIE WALLY WAY", x: 70, z: -62, color: 0x8d6cff },
    { name: "WET EGG PLAZA", x: -70, z: 66, color: 0xffd33d },
    { name: "RAW PAP YARD", x: 72, z: 68, color: 0x40f5c3 }
  ];

  const VIDEO_SOURCES = [
    {
      src: "assets/billboards/red-brick.mp4",
      label: "RED BRICK · YOUTUBE",
      aspect: 16 / 9,
      sourceUrl: "https://www.youtube.com/watch?v=0o7RmMrxvko"
    },
    {
      src: "assets/billboards/spitfire.mp4",
      label: "SPITFIRE · YOUTUBE",
      aspect: 16 / 9,
      sourceUrl: "https://www.youtube.com/watch?v=rRkw3Q7A8cQ"
    },
    {
      src: "assets/billboards/fuming.mp4",
      label: "FUMING · YOUTUBE",
      aspect: 16 / 9,
      sourceUrl: "https://www.youtube.com/watch?v=fuyD1Tkhkcc"
    },
    {
      src: "assets/billboards/raw-pap.mp4",
      label: "RAW PAP · YOUTUBE",
      aspect: 16 / 9,
      sourceUrl: "https://www.youtube.com/watch?v=SEBZABjtZBU"
    },
    {
      src: "assets/billboards/pay-me.mp4",
      label: "PAY ME · YOUTUBE",
      aspect: 16 / 9,
      sourceUrl: "https://www.youtube.com/watch?v=HNUtBySf-aU"
    },
    {
      src: "assets/billboards/dior.mp4",
      label: "DIOR · YOUTUBE",
      aspect: 16 / 9,
      sourceUrl: "https://www.youtube.com/watch?v=u_IWzvxKSek"
    },
    {
      src: "assets/billboards/tiktok-live-documents.mp4",
      label: "LIVE DOCUMENTS · TIKTOK",
      aspect: 16 / 9,
      sourceUrl: "https://www.tiktok.com/@boyo_world/video/7648670517238730006"
    },
    {
      src: "assets/billboards/tiktok-battle-panic.mp4",
      label: "BATTLE PANIC · TIKTOK",
      aspect: 16 / 9,
      sourceUrl: "https://www.tiktok.com/@boyo_world/video/7627545119566073110"
    },
    {
      src: "assets/billboards/tiktok-high-on-life.mp4",
      label: "HIGH ON LIFE · TIKTOK",
      aspect: 16 / 9,
      sourceUrl: "https://www.tiktok.com/@boyo_world/video/7619364492010343702"
    }
  ];

  // 15 TikTok gallery portrait videos (newest-first)
  const TIKTOK_GALLERY_SOURCES = [
    { src: "assets/tiktok-gallery/boyo-01.mp4", id: "7648670517238730006", label: "LIVE DOCUMENTS", sourceUrl: "https://www.tiktok.com/@boyo_world/video/7648670517238730006" },
    { src: "assets/tiktok-gallery/boyo-02.mp4", id: "7627545119566073110", label: "BATTLE PANIC", sourceUrl: "https://www.tiktok.com/@boyo_world/video/7627545119566073110" },
    { src: "assets/tiktok-gallery/boyo-03.mp4", id: "7619364492010343702", label: "HIGH ON LIFE", sourceUrl: "https://www.tiktok.com/@boyo_world/video/7619364492010343702" },
    { src: "assets/tiktok-gallery/boyo-04.mp4", id: "7615712891869678851", label: "BOOTCUT DENIM", sourceUrl: "https://www.tiktok.com/@boyo_world/video/7615712891869678851" },
    { src: "assets/tiktok-gallery/boyo-05.mp4", id: "7599376993511116054", label: "NORMAL FACE", sourceUrl: "https://www.tiktok.com/@boyo_world/video/7599376993511116054" },
    { src: "assets/tiktok-gallery/boyo-06.mp4", id: "7592335944011762966", label: "SCRATCH & SNIFF", sourceUrl: "https://www.tiktok.com/@boyo_world/video/7592335944011762966" },
    { src: "assets/tiktok-gallery/boyo-07.mp4", id: "7591264423742934294", label: "FULL MOON 2", sourceUrl: "https://www.tiktok.com/@boyo_world/video/7591264423742934294" },
    { src: "assets/tiktok-gallery/boyo-08.mp4", id: "7591254868870958358", label: "FULL MOON", sourceUrl: "https://www.tiktok.com/@boyo_world/video/7591254868870958358" },
    { src: "assets/tiktok-gallery/boyo-09.mp4", id: "7590880902985780502", label: "LEVELING UP", sourceUrl: "https://www.tiktok.com/@boyo_world/video/7590880902985780502" },
    { src: "assets/tiktok-gallery/boyo-10.mp4", id: "7589740720076918038", label: "ALBUM BTS", sourceUrl: "https://www.tiktok.com/@boyo_world/video/7589740720076918038" },
    { src: "assets/tiktok-gallery/boyo-11.mp4", id: "7587161206012562691", label: "CHRISTMAS FILMS 2", sourceUrl: "https://www.tiktok.com/@boyo_world/video/7587161206012562691" },
    { src: "assets/tiktok-gallery/boyo-12.mp4", id: "7586800323251997974", label: "CHRISTMAS FILMS 1", sourceUrl: "https://www.tiktok.com/@boyo_world/video/7586800323251997974" },
    { src: "assets/tiktok-gallery/boyo-13.mp4", id: "7585237955367816470", label: "BOYO LIVE", sourceUrl: "https://www.tiktok.com/@boyo_world/video/7585237955367816470" },
    { src: "assets/tiktok-gallery/boyo-14.mp4", id: "7584912647728991510", label: "MAD IN THE VALLEY", sourceUrl: "https://www.tiktok.com/@boyo_world/video/7584912647728991510" },
    { src: "assets/tiktok-gallery/boyo-15.mp4", id: "7575975465240825110", label: "RED BRICK", sourceUrl: "https://www.tiktok.com/@boyo_world/video/7575975465240825110" }
  ];

  // 2 Banshees TikTok video sources
  const BANSHEES_VIDEO_SOURCES = [
    { src: "assets/banshees/banshees-01.mp4", id: "7661072748499733782", label: "BANSHEES 01 · TIKTOK" },
    { src: "assets/banshees/banshees-02.mp4", id: "7654762225353198870", label: "BANSHEES 02 · TIKTOK" }
  ];
  const BANSHEES_VIDEO_SITES = [
    { x: 70, y: 8, z: 94 },
    { x: 104, y: 8, z: 70 }
  ];

  // TikTok Alley layout: 15 portrait screens along x=-108, facing east (toward world center)
  const TIKTOK_ALLEY_X = -108;
  const TIKTOK_ALLEY_Z_START = -88;
  const TIKTOK_ALLEY_Z_STEP = 12;
  const TIKTOK_ALLEY_CLEARANCE = { minX: -116, maxX: -86, minZ: -98, maxZ: 94 };

  // 18 displays: each of the nine official YouTube/TikTok sources appears twice.
  const VIDEO_BILLBOARDS = [
    { x: -28, y: 10, z: -36, s: 0 },
    { x: 28, y: 10, z: -36, s: 1 },
    { x: -28, y: 10, z: 36, s: 2 },
    { x: 28, y: 10, z: 36, s: 3 },
    { x: -58, y: 10, z: -72, s: 4 },
    { x: 58, y: 10, z: -72, s: 5 },
    { x: -58, y: 10, z: 72, s: 6 },
    { x: 58, y: 10, z: 72, s: 7 },
    { x: -72, y: 10, z: -48, s: 8 },
    { x: 92, y: 10, z: 8, s: 0 },
    { x: -72, y: 10, z: 8, s: 1 },
    { x: 92, y: 10, z: 52, s: 2 },
    { x: -72, y: 10, z: 52, s: 3 },
    { x: 92, y: 10, z: -48, s: 4 },
    { x: -32, y: 12, z: -104, s: 5 },
    { x: 32, y: 12, z: -104, s: 6 },
    { x: -64, y: 12, z: 104, s: 7 },
    { x: 64, y: 12, z: 104, s: 8 }
  ];

  const SIGNAL_STATIONS = [
    { id: "red-brick", label: "RED BRICK",  poster: "assets/video-red-brick.jpg",  x: -78, z:  28, color: 0xe21c3d, section: "#world" },
    { id: "spitfire",  label: "SPITFIRE",   poster: "assets/video-spitfire.jpg",   x:  86, z: -32, color: 0xff4a82, section: "#music" },
    { id: "fuming",    label: "FUMING",     poster: "assets/video-fuming.jpg",     x:   0, z: -96, color: 0xffd33d, section: "#music" },
    { id: "raw-pap",   label: "RAW PAP",    poster: "assets/video-raw-pap.jpg",    x:  36, z:  88, color: 0x40f5c3, section: "#world" },
    { id: "pay-me",    label: "PAY ME",     poster: "assets/video-pay-me.jpg",     x: -86, z: -86, color: 0x8d6cff, section: "#music" }
  ];
  const BANSHEES_SITE = { x: 92, z: 92 };
  const KILL_PHRASES = [
    "LIAR!", "WEAKIE!", "TAP DOWN!", "BLEUGH!", "6P!", "'AVE IT!",
    "RUN IT!", "NO WEAKIES!", "SPIN THE BLOCK!",
    "MASK ON!", "BACK TO THE BIN!", "BOROUGH BUSINESS!", "NEXT!"
  ];

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const rand = (min, max) => min + Math.random() * (max - min);

  function disposeObject(object) {
    object.traverse((child) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((material) => {
          Object.values(material).forEach((value) => {
            if (value?.isTexture) value.dispose();
          });
          material.dispose();
        });
      }
    });
  }

  // Polished font family for all in-world labels
  const LABEL_FONT_FAMILY = "Bahnschrift, 'Aptos Display', 'Arial Narrow', 'Segoe UI', sans-serif";

  // Fit text into maxWidth, shrinking fontSize down to minSize, with optional wrapping.
  // Returns the font size used and whether wrapping occurred.
  function fitCanvasText(ctx, text, maxWidth, initFontSize, fontWeight, minSize = 18) {
    let size = initFontSize;
    while (size >= minSize) {
      ctx.font = `${fontWeight} ${size}px ${LABEL_FONT_FAMILY}`;
      if (ctx.measureText(text).width <= maxWidth) return { size, wrapped: false };
      size -= 2;
    }
    ctx.font = `${fontWeight} ${minSize}px ${LABEL_FONT_FAMILY}`;
    return { size: minSize, wrapped: ctx.measureText(text).width > maxWidth };
  }

  function roundedCanvasTexture(text, options = {}) {
    const {
      width = 512,
      height = 128,
      background = "rgba(7,7,7,.88)",
      foreground = "#ffffff",
      accent = "#e21c3d",
      subtext = "",
      fontSize = 54,
      minFontSize = 16
    } = options;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, width, height);
    context.fillStyle = background;
    context.beginPath();
    context.roundRect(3, 3, width - 6, height - 6, 18);
    context.fill();
    context.strokeStyle = accent;
    context.lineWidth = 6;
    context.stroke();
    context.fillStyle = foreground;
    const pad = Math.round(width * 0.045);
    const { size } = fitCanvasText(context, text, width - pad * 2, fontSize, 900, minFontSize);
    context.font = `900 ${size}px ${LABEL_FONT_FAMILY}`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, width / 2, subtext ? height * 0.42 : height / 2);
    if (subtext) {
      context.fillStyle = accent;
      const { size: subSize } = fitCanvasText(context, subtext, width - pad * 2, 25, 800, 12);
      context.font = `800 ${subSize}px ${LABEL_FONT_FAMILY}`;
      context.fillText(subtext, width / 2, height * 0.76);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }

  class BoyoThreeWorld {
    constructor(container, options = {}) {
      this.container = container;
      this.options = options;
      this.controls = options.controls;
      this.reducedMotion = Boolean(options.reducedMotion);
      this.readyAt = options.readyAt || performance.now();
      this.paused = false;
      this.destroyed = false;
      this.celebrating = false;
      this.worldComplete = false;
      this.completionTimer = null;
      this.health = 100;
      this.kills = 0;
      this.fireCooldown = 0;
      this.hitCooldown = 0;
      this.dashCooldown = 0;
      this.damageGraceUntil = this.readyAt + 5000;
      this.yaw = -0.18;
      this.pitch = -0.16;
      this.cameraDistance = 18;
      this.clock = new THREE.Clock();
      this.elapsed = 0;
      this.bullets = [];
      this.enemies = [];
      this.coins = [];
      this.coinCount = 0;
      this.obstacles = [];
      this.portals = [];
      this.particles = [];
      this.signalStations = [];
      this.buildingVariantCount = 0;
      this.streetArtifactCount = 0;
      this.streetArtifactCategories = {};
      this.starCount = 0;
      this.enemyLodTimer = 0;
      this.fullDetailEnemies = new Set();
      this.faceDetailEnemies = new Set();
      this.mediaPrimed = false;
      this.killSpeechPhrase = "";
      this.killSpeechVisible = false;
      this.killSpeechUntil = 0;
      this.killSpeechStartedAt = 0;
      this.killSpeechIndex = 0;
      this.dashPoseUntil = 0;
      // Cinematic intro
      this.introElapsed = 0;
      this.introDuration = this.reducedMotion ? 0 : 4.2;
      this.introComplete = Boolean(this.reducedMotion);
      this.introStartedAt = performance.now();
      this.introProgress = this.introComplete ? 1 : 0;
      // Unified proximity audio arbitration
      this.audioActiveSource = null;
      this.audioActiveDist = Infinity;
      this.audioVolumeTimer = 0;
      this.activeAudibleName = "";
      this.activeAudibleDist = -1;
      this.bansheesVolume = 0;
      this.galleryVideoSources = [];
      this.bansheesVideoSourcesArr = [];
      this.bansheesVideoScreens = [];
      this.tiktokGallery = [];
      this.clickableMediaScreens = [];
      this.celebrationPhase = "";
      this.celebrationProgress = 0;
      this.celebrationStartedAt = 0;
      this.celebrationPlayerPos = new THREE.Vector3();
      this.celebrationPlayerRotation = 0;
      this.celebrationCameraOrbit = 0;
      this.wayfindingCount = 0;
      this.labelFitCount = 0;
      this.activeVolume = 0;
      this.speechAnchor = "rider.head";
      this.pointer = {
        dragging: false,
        x: 0,
        y: 0,
        startX: 0,
        startY: 0,
        moved: false,
        pinchDistance: 0,
        pinchX: 0,
        pinchY: 0
      };
      this.pointerNdc = new THREE.Vector2();
      this.activePointers = new Map();
      this.temp = {
        a: new THREE.Vector3(),
        b: new THREE.Vector3(),
        c: new THREE.Vector3(),
        matrix: new THREE.Matrix4(),
        quaternion: new THREE.Quaternion()
      };

      this.createRenderer();
      this.createScene();
      this.createWorld();
      this.createPlayer();
      this.createEnemies();
      if (this.reducedMotion) this.updateCamera(1);
      this.bindInput();
      this.options.onProgress?.(0, WIN_TARGET);
      this.options.onHealth?.(this.health);
      this.options.onDistrict?.(DISTRICTS[0].name);
      this.animate = this.animate.bind(this);
      this.frameId = requestAnimationFrame(this.animate);

      if (new URLSearchParams(location.search).get("testMode") === "1") {
        window.__BOYO_THREE_TEST__ = {
          getState: () => this.getState(),
          defeatAll: () => this.debugDefeatAll(),
          defeatOne: () => this.debugDefeatOne(),
          damage: (amount = 10) => this.damagePlayer(amount),
          collectCoin: () => this.debugCollectCoin(),
          setPlayer: (x, z) => this.player.position.set(x, 0, z),
          getDisplayCount: () => this.videoBillboards?.length || 0,
          getUniqueMediaCount: () => this.videoSources?.length || 0,
          getStationCount: () => this.signalStations?.length || 0,
          getActiveAudibleSource: () => this.activeAudibleName || null,
          getCameraIntro: () => !this.introComplete,
          warpToStation: (id) => this.warpPlayerToStation(id),
          getMounted: () => Boolean(this.horse && this.rider),
          getHorsePartCount: () => this.horseParts?.length || 0,
          getSpeechState: () => ({
            phrase: this.killSpeechPhrase,
            visible: this.killSpeechVisible
          }),
          crowdEnemies: (count = 30) => this.debugCrowdEnemies(count),
          getEnvironmentState: () => ({
            buildingVariantCount: this.buildingVariantCount,
            moonVisible: Boolean(this.moon?.visible),
            starCount: this.starCount,
            streetArtifactCount: this.streetArtifactCount
          }),
          getGalleryCount: () => this.tiktokGallery?.length || 0,
          getGalleryLinks: () => this.tiktokGallery?.map((screen) => screen.sourceUrl) || [],
          openGalleryLink: (index = 0) => this.openExternalMediaUrl(
            this.tiktokGallery?.[index]?.sourceUrl,
            this.tiktokGallery?.[index]?.label
          ),
          getBansheesSourceCount: () => this.bansheesVideoSourcesArr?.length || 0,
          getPlayingMedia: () => {
            const all = [
              ...(this.videoSources || []),
              ...(this.galleryVideoSources || []),
              ...(this.bansheesVideoSourcesArr || [])
            ];
            return all.map((s) => ({ label: s.label, paused: s.video.paused, blocked: s.playBlocked }));
          },
          getCelebration: () => ({ phase: this.celebrationPhase, progress: this.celebrationProgress }),
          getWayfindingCount: () => this.wayfindingCount,
          getLabelFit: () => ({ count: this.labelFitCount }),
          getSpeechAnchor: () => this.speechAnchor
        };
      }
    }

    createRenderer() {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance"
      });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      this.renderer.setSize(960, 540, false);
      this.renderer.shadowMap.enabled = false;
      this.renderer.shadowMap.type = THREE.PCFShadowMap;
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.48;
      this.renderer.domElement.className = "three-world-canvas";
      this.renderer.domElement.setAttribute("aria-label", "BOYOWORLD game world");
      this.container.appendChild(this.renderer.domElement);
    }

    createScene() {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x1a0e2d);
      this.scene.fog = new THREE.FogExp2(0x33204c, 0.0042);
      this.camera = new THREE.PerspectiveCamera(60, 16 / 9, 0.1, 500);
      this.camera.position.set(0, 14, -42);

      // Richer violet-dusk hemisphere — bright sky, warm-violet bounce
      const hemisphere = new THREE.HemisphereLight(0xcddaff, 0x2e0b3a, 2.8);
      this.scene.add(hemisphere);
      this.scene.add(new THREE.AmbientLight(0xb9a7da, 0.72));

      // Primary directional — warm dusk angle
      this.sun = new THREE.DirectionalLight(0xffe0cc, 4.2);
      this.sun.position.set(-35, 58, -28);
      this.sun.castShadow = false;
      this.sun.shadow.mapSize.set(1024, 1024);
      this.sun.shadow.camera.left = -80;
      this.sun.shadow.camera.right = 80;
      this.sun.shadow.camera.top = 80;
      this.sun.shadow.camera.bottom = -80;
      this.sun.shadow.camera.near = 1;
      this.sun.shadow.camera.far = 180;
      this.sun.shadow.bias = -0.0002;
      this.scene.add(this.sun);

      // Violet fill from opposite side
      const fill = new THREE.DirectionalLight(0x4a1880, 1.6);
      fill.position.set(35, 28, 28);
      this.scene.add(fill);

      this.textureLoader = new THREE.TextureLoader();
      this.textureLoader.setCrossOrigin("anonymous");
      this.raycaster = new THREE.Raycaster();
    }

    createWorld() {
      this.createSky();
      this.createGround();
      this.createRoadGrid();
      this.createDistricts();
      this.createVideoBillboards();
      this.createBansheesLandmark();
      this.createTikTokAlley();
      this.primeMedia();
      this.createBuildings();
      this.createWorldProps();
      this.createStreetArtifacts();
      this.createStreetlights();
      this.createPuddles();
      this.createPortals();
      this.createCoins();
      this.createSignalStations();
      this.createWayfinding();
      this.createAtmosphere();
    }

    createAsphaltTexture() {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const context = canvas.getContext("2d");
      context.fillStyle = "#282b36";
      context.fillRect(0, 0, 512, 512);
      const image = context.getImageData(0, 0, 512, 512);
      for (let index = 0; index < image.data.length; index += 4) {
        const grain = Math.floor(rand(-13, 18));
        image.data[index] = clamp(38 + grain, 14, 72);
        image.data[index + 1] = clamp(40 + grain, 14, 74);
        image.data[index + 2] = clamp(49 + grain, 18, 84);
        image.data[index + 3] = 255;
      }
      context.putImageData(image, 0, 0);
      context.strokeStyle = "rgba(2,2,3,.75)";
      context.lineWidth = 2;
      for (let crack = 0; crack < 35; crack += 1) {
        let x = rand(0, 512);
        let y = rand(0, 512);
        context.beginPath();
        context.moveTo(x, y);
        for (let segment = 0; segment < 5; segment += 1) {
          x += rand(-24, 24);
          y += rand(5, 28);
          context.lineTo(x, y);
        }
        context.stroke();
      }
      context.fillStyle = "rgba(255,255,255,.035)";
      for (let spot = 0; spot < 420; spot += 1) {
        context.fillRect(rand(0, 512), rand(0, 512), rand(1, 4), rand(1, 4));
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(12, 12);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = Math.min(8, this.renderer.capabilities.getMaxAnisotropy());
      return texture;
    }

    createFacadeTexture(accent = "#e21c3d") {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 512;
      const context = canvas.getContext("2d");
      context.fillStyle = "#20202a";
      context.fillRect(0, 0, 256, 512);
      for (let floor = 0; floor < 12; floor += 1) {
        for (let column = 0; column < 4; column += 1) {
          const lit = Math.random() > 0.38;
          context.fillStyle = lit ? accent : "#0a0a0d";
          context.globalAlpha = lit ? rand(0.45, 1.0) : 1;
          context.fillRect(18 + column * 60, 16 + floor * 41, 36, 20);
          context.globalAlpha = 1;
        }
      }
      context.fillStyle = "rgba(0,0,0,.18)";
      for (let drip = 0; drip < 70; drip += 1) {
        context.fillRect(rand(0, 256), rand(0, 512), rand(1, 4), rand(10, 80));
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1.4, 1);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    }

    createBuildingTexture(kind, accent) {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 512;
      const context = canvas.getContext("2d");
      const bases = {
        brick: "#5b302e",
        concrete: "#67656d",
        render: "#69536f",
        glassMetal: "#182b3d"
      };
      context.fillStyle = bases[kind];
      context.fillRect(0, 0, canvas.width, canvas.height);
      if (kind === "brick") {
        context.strokeStyle = "rgba(25,12,15,.55)";
        context.lineWidth = 2;
        for (let y = 0; y < 512; y += 18) {
          context.beginPath();
          context.moveTo(0, y);
          context.lineTo(256, y);
          context.stroke();
          for (let x = (y / 18) % 2 ? 0 : 22; x < 256; x += 44) {
            context.fillRect(x, y, 2, 18);
          }
        }
      } else if (kind === "concrete") {
        for (let i = 0; i < 420; i += 1) {
          const alpha = rand(0.02, 0.12);
          context.fillStyle = `rgba(10,8,18,${alpha})`;
          context.fillRect(rand(0, 256), rand(0, 512), rand(1, 7), rand(1, 24));
        }
      } else if (kind === "render") {
        context.strokeStyle = "rgba(255,255,255,.1)";
        for (let y = 0; y < 512; y += 7) {
          context.beginPath();
          context.moveTo(0, y);
          context.bezierCurveTo(60, y + 4, 180, y - 3, 256, y + 2);
          context.stroke();
        }
      } else {
        context.strokeStyle = "rgba(120,180,220,.32)";
        context.lineWidth = 3;
        for (let x = 0; x < 256; x += 42) context.strokeRect(x, 0, 40, 512);
      }
      for (let floor = 0; floor < 12; floor += 1) {
        for (let column = 0; column < 4; column += 1) {
          const lit = (floor * 7 + column * 3 + kind.length) % 5 !== 0;
          context.fillStyle = lit ? accent : "#090910";
          context.globalAlpha = lit ? rand(0.45, 0.92) : 0.86;
          context.fillRect(16 + column * 61, 15 + floor * 41, kind === "glassMetal" ? 46 : 34, 21);
        }
      }
      context.globalAlpha = 1;
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1.25, 1);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    }

    createWoodTexture() {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 256;
      const context = canvas.getContext("2d");
      context.fillStyle = "#8f552d";
      context.fillRect(0, 0, canvas.width, canvas.height);
      for (let y = 0; y < canvas.height; y += 4) {
        context.strokeStyle = `rgba(${45 + y % 26},${20 + y % 13},8,${rand(0.12, 0.35)})`;
        context.lineWidth = rand(0.6, 2.2);
        context.beginPath();
        for (let x = 0; x <= canvas.width; x += 12) {
          const wave = Math.sin(x * 0.025 + y * 0.11) * 4 + Math.sin(x * 0.008) * 5;
          if (x === 0) context.moveTo(x, y + wave);
          else context.lineTo(x, y + wave);
        }
        context.stroke();
      }
      for (let knot = 0; knot < 14; knot += 1) {
        context.strokeStyle = "rgba(44,20,8,.42)";
        context.beginPath();
        context.ellipse(rand(0, 512), rand(0, 256), rand(8, 24), rand(3, 9), 0, 0, Math.PI * 2);
        context.stroke();
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(2.2, 1.2);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    }

    createKnitTexture() {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const context = canvas.getContext("2d");
      context.fillStyle = "#efefed";
      context.fillRect(0, 0, 512, 512);
      for (let x = 0; x < 512; x += 12) {
        context.strokeStyle = x % 24 === 0 ? "#d4d4d1" : "#fafaf8";
        context.lineWidth = 5;
        context.beginPath();
        for (let y = 0; y <= 512; y += 8) {
          const wave = Math.sin(y * 0.18 + x) * 2.2;
          if (y === 0) context.moveTo(x + wave, y);
          else context.lineTo(x + wave, y);
        }
        context.stroke();
      }
      context.globalAlpha = 0.32;
      context.strokeStyle = "#bcbdbb";
      context.lineWidth = 1;
      for (let y = 0; y < 512; y += 8) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(512, y + 5);
        context.stroke();
      }
      context.globalAlpha = 1;
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(2.2, 2.6);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    }

    createSky() {
      const geometry = new THREE.SphereGeometry(260, 32, 18);
      const material = new THREE.ShaderMaterial({
        side: THREE.BackSide,
        uniforms: {
          topColor: { value: new THREE.Color(0x8058b7) },
          bottomColor: { value: new THREE.Color(0x351b4a) },
          offset: { value: 14 },
          exponent: { value: 0.65 }
        },
        vertexShader: `
          varying vec3 vWorldPosition;
          void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 topColor;
          uniform vec3 bottomColor;
          uniform float offset;
          uniform float exponent;
          varying vec3 vWorldPosition;
          void main() {
            float h = normalize(vWorldPosition + offset).y;
            gl_FragColor = vec4(mix(bottomColor, topColor, pow(max(h, 0.0), exponent)), 1.0);
          }
        `
      });
      this.sky = new THREE.Mesh(geometry, material);
      this.scene.add(this.sky);

      const mobile = Math.min(innerWidth, innerHeight) < 700;
      this.starCount = mobile ? 720 : 1400;
      const starPositions = new Float32Array(this.starCount * 3);
      for (let index = 0; index < this.starCount; index += 1) {
        const theta = rand(0, Math.PI * 2);
        const phi = rand(0.12, Math.PI * 0.48);
        const radius = rand(205, 245);
        starPositions[index * 3] = Math.cos(theta) * Math.sin(phi) * radius;
        starPositions[index * 3 + 1] = Math.cos(phi) * radius;
        starPositions[index * 3 + 2] = Math.sin(theta) * Math.sin(phi) * radius;
      }
      const starGeometry = new THREE.BufferGeometry();
      starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
      this.stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({
        color: 0xe9e4ff,
        size: mobile ? 0.7 : 0.85,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.82,
        depthWrite: false,
        fog: false
      }));
      this.scene.add(this.stars);

      const moonMaterial = new THREE.MeshStandardMaterial({
        color: 0xf5f0da,
        emissive: 0xb9b5d8,
        emissiveIntensity: 1.8,
        roughness: 0.86
      });
      this.moon = new THREE.Mesh(new THREE.SphereGeometry(12, 28, 20), moonMaterial);
      this.moon.position.set(-46, 70, 158);
      this.scene.add(this.moon);
      const haloCanvas = document.createElement("canvas");
      haloCanvas.width = haloCanvas.height = 256;
      const haloContext = haloCanvas.getContext("2d");
      const haloGradient = haloContext.createRadialGradient(128, 128, 24, 128, 128, 126);
      haloGradient.addColorStop(0, "rgba(235,230,255,.55)");
      haloGradient.addColorStop(0.35, "rgba(169,139,255,.2)");
      haloGradient.addColorStop(1, "rgba(100,70,180,0)");
      haloContext.fillStyle = haloGradient;
      haloContext.fillRect(0, 0, 256, 256);
      const haloTexture = new THREE.CanvasTexture(haloCanvas);
      this.moonHalo = new THREE.Sprite(new THREE.SpriteMaterial({
        map: haloTexture, transparent: true, depthWrite: false, fog: false
      }));
      this.moonHalo.position.copy(this.moon.position);
      this.moonHalo.scale.set(48, 48, 1);
      this.scene.add(this.moonHalo);
      const moonRim = new THREE.DirectionalLight(0xa99cff, 1.6);
      moonRim.position.copy(this.moon.position);
      this.scene.add(moonRim);
    }

    createGround() {
      this.asphaltTexture = this.createAsphaltTexture();
      const groundMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x3a3d50,
        map: this.asphaltTexture,
        bumpMap: this.asphaltTexture,
        bumpScale: 0.1,
        roughness: 0.48,
        metalness: 0.28,
        clearcoat: 0.52,
        clearcoatRoughness: 0.24
      });
      const ground = new THREE.Mesh(new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE), groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      this.scene.add(ground);

      const underGlow = new THREE.Mesh(
        new THREE.CircleGeometry(32, 64),
        new THREE.MeshBasicMaterial({ color: 0xe21c3d, transparent: true, opacity: 0.08 })
      );
      underGlow.rotation.x = -Math.PI / 2;
      underGlow.position.y = 0.012;
      this.scene.add(underGlow);
    }

    createRoadGrid() {
      const roadTexture = this.asphaltTexture.clone();
      roadTexture.repeat.set(2, 18);
      roadTexture.needsUpdate = true;
      const roadMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x2a2d3a,
        map: roadTexture,
        bumpMap: roadTexture,
        bumpScale: 0.12,
        roughness: 0.18,
        metalness: 0.54,
        clearcoat: 0.92,
        clearcoatRoughness: 0.14
      });
      const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xff5578 });
      [-72, 0, 72].forEach((offset) => {
        const vertical = new THREE.Mesh(new THREE.PlaneGeometry(18, WORLD_SIZE), roadMaterial);
        vertical.rotation.x = -Math.PI / 2;
        vertical.position.set(offset, 0.025, 0);
        vertical.receiveShadow = true;
        this.scene.add(vertical);

        const horizontal = new THREE.Mesh(new THREE.PlaneGeometry(WORLD_SIZE, 18), roadMaterial);
        horizontal.rotation.x = -Math.PI / 2;
        horizontal.position.set(0, 0.026, offset);
        horizontal.receiveShadow = true;
        this.scene.add(horizontal);

        for (let marker = -105; marker <= 105; marker += 14) {
          const vLine = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 6), lineMaterial);
          vLine.rotation.x = -Math.PI / 2;
          vLine.position.set(offset, 0.04, marker);
          this.scene.add(vLine);
          const hLine = new THREE.Mesh(new THREE.PlaneGeometry(6, 0.35), lineMaterial);
          hLine.rotation.x = -Math.PI / 2;
          hLine.position.set(marker, 0.041, offset);
          this.scene.add(hLine);
        }
      });

      const grid = new THREE.GridHelper(WORLD_SIZE, 48, 0xd92f58, 0x4b4d61);
      grid.position.y = 0.05;
      grid.material.transparent = true;
      grid.material.opacity = 0.34;
      this.scene.add(grid);
    }

    createDistricts() {
      DISTRICTS.forEach((district, index) => {
        const group = new THREE.Group();
        group.position.set(district.x, 0, district.z);
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(index === 0 ? 15 : 10, index === 0 ? 16 : 11, 64),
          new THREE.MeshBasicMaterial({
            color: district.color,
            transparent: true,
            opacity: index === 0 ? 0.52 : 0.34,
            side: THREE.DoubleSide
          })
        );
        ring.rotation.x = -Math.PI / 2;
        ring.position.y = 0.08;
        group.add(ring);
        const label = this.makeLabel(district.name, `DISTRICT ${index + 1}`, district.color, 7, 1.75);
        label.position.set(0, 5.8, 0);
        group.add(label);
        this.scene.add(group);
      });
    }

    createBuildings() {
      const buildingGeometry = new THREE.BoxGeometry(1, 1, 1);
      const roofGeometry = new THREE.BoxGeometry(1, 1, 1);
      const variants = [
        { id: "brick", accent: "#ef6a61", roughness: 0.88, metalness: 0.04 },
        { id: "concrete", accent: "#ffd36a", roughness: 0.94, metalness: 0.02 },
        { id: "render", accent: "#c28cff", roughness: 0.82, metalness: 0.03 },
        { id: "glassMetal", accent: "#62dcff", roughness: 0.22, metalness: 0.68 }
      ];
      this.buildingVariantCount = variants.length;
      const materials = variants.map((variant) => {
        const texture = this.createBuildingTexture(variant.id, variant.accent);
        return new THREE.MeshStandardMaterial({
          color: 0xffffff,
          map: texture,
          bumpMap: texture,
          bumpScale: variant.id === "glassMetal" ? 0.025 : 0.11,
          roughness: variant.roughness,
          metalness: variant.metalness
        });
      });
      const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x17171f, roughness: 0.65, metalness: 0.35 });
      const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x12141a, roughness: 0.42, metalness: 0.58 });
      const shopGlassMaterial = new THREE.MeshStandardMaterial({
        color: 0x70b8c8, emissive: 0x173442, emissiveIntensity: 0.8, roughness: 0.2, metalness: 0.45
      });
      const awningMaterial = new THREE.MeshStandardMaterial({ color: 0xb51f3d, roughness: 0.76 });
      const roofMetalMaterial = new THREE.MeshStandardMaterial({ color: 0x5d626b, roughness: 0.42, metalness: 0.72 });
      const escapeMaterial = new THREE.MeshStandardMaterial({ color: 0x17191e, roughness: 0.5, metalness: 0.8 });
      const doorGeometry = new THREE.BoxGeometry(1.65, 2.9, 0.18);
      const shopGeometry = new THREE.BoxGeometry(4.6, 2.6, 0.2);
      const awningGeometry = new THREE.BoxGeometry(4.9, 0.18, 1.15);
      const ventGeometry = new THREE.BoxGeometry(1.25, 0.85, 1.1);
      const tankGeometry = new THREE.CylinderGeometry(1.45, 1.55, 2.8, 12);
      const escapeLandingGeometry = new THREE.BoxGeometry(3.2, 0.14, 1.05);
      const escapeRailGeometry = new THREE.BoxGeometry(0.1, 1.0, 0.1);
      const reserved = [
        [-26, 26, -26, 26],
        [-89, -55, -79, -45],
        [53, 87, -79, -45],
        [-88, -54, 49, 83],
        [55, 89, 51, 85]
      ];
      const tiktokAlleySites = TIKTOK_GALLERY_SOURCES.map((_, i) => ({
        x: TIKTOK_ALLEY_X,
        z: TIKTOK_ALLEY_Z_START + i * TIKTOK_ALLEY_Z_STEP
      }));
      const reservedMedia = [
        ...VIDEO_BILLBOARDS, ...SIGNAL_STATIONS, BANSHEES_SITE,
        ...BANSHEES_VIDEO_SITES, ...tiktokAlleySites
      ];

      for (let index = 0; index < 42; index += 1) {
        let x;
        let z;
        let attempts = 0;
        let blocked;
        do {
          x = rand(-108, 108);
          z = rand(-108, 108);
          attempts += 1;
          blocked = Math.abs(x) < 13 || Math.abs(z) < 13 ||
            this.isInTikTokAlleyClearance(x, z, 6) ||
            reserved.some(([minX, maxX, minZ, maxZ]) => x > minX && x < maxX && z > minZ && z < maxZ) ||
            reservedMedia.some((site) => Math.hypot(x - site.x, z - site.z) < 23);
        } while (attempts < 120 && blocked);
        if (blocked) continue;

        const width = rand(7, 16);
        const depth = rand(7, 16);
        const height = rand(10, 42);
        const variantIndex = index % variants.length;
        const material = materials[variantIndex];
        const group = new THREE.Group();
        const building = new THREE.Mesh(buildingGeometry, material);
        building.scale.set(width, height, depth);
        building.position.y = height / 2;
        building.castShadow = !this.reducedMotion && index % 3 === 0;
        building.receiveShadow = true;
        group.add(building);
        if (index % 3 === 0) {
          const setback = new THREE.Mesh(buildingGeometry, material);
          setback.scale.set(width * 0.68, height * 0.22, depth * 0.7);
          setback.position.set((index % 2 ? -1 : 1) * width * 0.08, height * 1.11, 0);
          group.add(setback);
        }
        const parapet = new THREE.Mesh(roofGeometry, roofMaterial);
        parapet.scale.set(width * 0.84, 0.42, depth * 0.84);
        parapet.position.y = height + 0.2;
        group.add(parapet);
        if (index % 4 === 1) {
          const canopy = new THREE.Mesh(roofGeometry, material);
          canopy.scale.set(width * 0.64, 0.28, 2.2);
          canopy.position.set(0, 3.1, depth / 2 + 0.9);
          group.add(canopy);
        }
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.name = "building door";
        door.position.set(width * (index % 2 ? -0.2 : 0.2), 1.45, depth / 2 + 0.1);
        door.castShadow = !this.reducedMotion && index % 6 === 0;
        group.add(door);
        if (index % 3 !== 2) {
          const shopfront = new THREE.Mesh(shopGeometry, shopGlassMaterial);
          shopfront.name = "shopfront";
          shopfront.scale.x = Math.min(1.35, width / 6);
          shopfront.position.set(-width * 0.13, 1.55, depth / 2 + 0.115);
          group.add(shopfront);
          const awning = new THREE.Mesh(awningGeometry, awningMaterial);
          awning.name = "shop awning";
          awning.scale.x = shopfront.scale.x;
          awning.position.set(shopfront.position.x, 3.05, depth / 2 + 0.55);
          awning.rotation.x = -0.12;
          awning.castShadow = !this.reducedMotion && index % 4 === 0;
          group.add(awning);
        }
        if (index % 7 === 0) {
          const waterTank = new THREE.Mesh(tankGeometry, roofMetalMaterial);
          waterTank.name = "rooftop water tank";
          waterTank.position.set(width * 0.2, height + 1.7, 0);
          waterTank.castShadow = !this.reducedMotion;
          group.add(waterTank);
          [-0.9, 0.9].forEach((legX) => {
            const leg = new THREE.Mesh(escapeRailGeometry, escapeMaterial);
            leg.scale.y = 1.6;
            leg.position.set(width * 0.2 + legX, height + 0.65, 0);
            group.add(leg);
          });
        } else {
          const vent = new THREE.Mesh(ventGeometry, roofMetalMaterial);
          vent.name = "rooftop vent";
          vent.position.set(width * 0.18, height + 0.65, depth * 0.12);
          group.add(vent);
        }
        if (index % 6 === 2) {
          const fireEscape = new THREE.Group();
          fireEscape.name = "fire escape silhouette";
          for (let floor = 0; floor < Math.min(4, Math.floor(height / 6)); floor += 1) {
            const landing = new THREE.Mesh(escapeLandingGeometry, escapeMaterial);
            landing.position.set(0, 4.8 + floor * 4.5, depth / 2 + 0.56);
            fireEscape.add(landing);
            [-1.45, 1.45].forEach((railX) => {
              const rail = new THREE.Mesh(escapeRailGeometry, escapeMaterial);
              rail.position.set(railX, 5.3 + floor * 4.5, depth / 2 + 0.56);
              fireEscape.add(rail);
            });
            if (floor > 0) {
              const ladder = new THREE.Mesh(new THREE.BoxGeometry(0.12, 4.2, 0.12), escapeMaterial);
              ladder.position.set(1.15, 2.65 + floor * 4.5, depth / 2 + 0.72);
              ladder.rotation.z = 0.2;
              fireEscape.add(ladder);
            }
          }
          group.add(fireEscape);
        }
        group.position.set(x, 0, z);
        group.userData.buildingVariant = variants[variantIndex].id;
        this.scene.add(group);
        this.obstacles.push({ x, z, radius: Math.max(width, depth) * 0.58 });

        if (index % 5 === 0) {
          const aerial = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.12, rand(5, 12), 8),
            new THREE.MeshStandardMaterial({ color: 0xbfc2ca, metalness: 0.9, roughness: 0.18 })
          );
          aerial.position.set(x, height + aerial.geometry.parameters.height / 2, z);
          aerial.castShadow = true;
          this.scene.add(aerial);
        }
      }
    }

    createStreetArtifacts() {
      const metal = new THREE.MeshStandardMaterial({ color: 0x666d78, metalness: 0.82, roughness: 0.3 });
      const darkMetal = new THREE.MeshStandardMaterial({ color: 0x20242b, metalness: 0.74, roughness: 0.4 });
      const wood = new THREE.MeshStandardMaterial({ color: 0x704329, roughness: 0.84 });
      const red = new THREE.MeshStandardMaterial({ color: 0xc7243f, roughness: 0.48, metalness: 0.34 });
      const roadPaint = new THREE.MeshBasicMaterial({ color: 0xe9e3ce, transparent: true, opacity: 0.78 });
      const pavement = new THREE.MeshStandardMaterial({ color: 0x777985, roughness: 0.92, metalness: 0.04 });
      const glass = new THREE.MeshStandardMaterial({ color: 0x88b9c5, roughness: 0.18, metalness: 0.36 });
      const rubber = new THREE.MeshStandardMaterial({ color: 0x111217, roughness: 0.88 });
      const paper = new THREE.MeshStandardMaterial({ color: 0xe7d9bd, roughness: 0.98, side: THREE.DoubleSide });
      const matrix = new THREE.Matrix4();
      const quaternion = new THREE.Quaternion();
      const rotation = new THREE.Euler(0, 0, 0, "YXZ");
      const scale = new THREE.Vector3();
      const roads = [-72, 0, 72];
      const curbLanes = [-83, -61, -11, 11, 61, 83];
      const count = (category, amount = 1) => {
        this.streetArtifactCount += amount;
        this.streetArtifactCategories[category] = (this.streetArtifactCategories[category] || 0) + amount;
      };
      const addArtifact = (category, object) => {
        object.name = `street ${category}`;
        this.scene.add(object);
        count(category);
      };
      const addInstances = (category, geometry, material, transforms, shadows = false) => {
        if (!transforms.length) return;
        const mesh = new THREE.InstancedMesh(geometry, material, transforms.length);
        mesh.name = `instanced street ${category}`;
        transforms.forEach((item, index) => {
          rotation.set(item.rx || 0, item.rotation || 0, item.rz || 0);
          quaternion.setFromEuler(rotation);
          scale.set(item.sx || 1, item.sy || 1, item.sz || 1);
          matrix.compose(new THREE.Vector3(item.x, item.y || 0, item.z), quaternion, scale);
          mesh.setMatrixAt(index, matrix);
        });
        mesh.instanceMatrix.needsUpdate = true;
        mesh.castShadow = shadows && !this.reducedMotion;
        mesh.receiveShadow = true;
        this.scene.add(mesh);
        count(category, transforms.length);
      };
      const clear = (x, z, radius = 0.8, mediaClearance = 15) =>
        !this.isNearMediaSite(x, z, mediaClearance) && !this.collidesWorld(x, z, radius);
      const streetOccupied = [];
      const edgeCandidates = [];
      curbLanes.forEach((lane, laneIndex) => {
        for (let offset = -104; offset <= 104; offset += 13) {
          edgeCandidates.push(laneIndex % 2 ? { x: lane, z: offset, rotation: 0 } :
            { x: offset, z: lane, rotation: Math.PI / 2 });
        }
      });
      const pick = (limit, radius, step = 1, mediaClearance = 15, reserve = false) => {
        const selected = [];
        const preferred = edgeCandidates.filter((_, index) => index % step === step - 1);
        const candidates = [...preferred, ...edgeCandidates.filter((item) => !preferred.includes(item))];
        for (const item of candidates) {
          if (selected.length >= limit) break;
          const alongX = Math.abs(item.rotation) > 0.1;
          const spacing = radius + 2.2;
          const options = [0, spacing, -spacing].map((offset) => ({
            ...item,
            x: item.x + (alongX ? offset : 0),
            z: item.z + (alongX ? 0 : offset)
          }));
          const candidate = options.find((option) => {
            const occupiedPool = reserve
              ? [...streetOccupied, ...selected.map((selectedItem) => ({ ...selectedItem, radius }))]
              : streetOccupied;
            const overlaps = occupiedPool.some((occupied) =>
              Math.hypot(option.x - occupied.x, option.z - occupied.z) < radius + occupied.radius
            );
            return clear(option.x, option.z, radius, mediaClearance) && !overlaps;
          });
          if (candidate) selected.push(candidate);
        }
        if (reserve) selected.forEach((item) => streetOccupied.push({ ...item, radius }));
        return selected;
      };

      const sidewalkTransforms = [];
      roads.forEach((road) => {
        [-10.4, 10.4].forEach((side) => {
          for (let offset = -102; offset <= 102; offset += 17) {
            if (!this.isNearMediaSite(road + side, offset, 21)) {
              sidewalkTransforms.push({ x: road + side, y: 0.1, z: offset, sx: 2.4, sy: 0.18, sz: 14 });
            }
            if (!this.isNearMediaSite(offset, road + side, 21)) {
              sidewalkTransforms.push({ x: offset, y: 0.1, z: road + side, sx: 14, sy: 0.18, sz: 2.4 });
            }
          }
        });
      });
      addInstances("curb sidewalk ribbons", new THREE.BoxGeometry(1, 1, 1), pavement, sidewalkTransforms);

      const crosswalks = [];
      roads.forEach((x) => roads.forEach((z) => {
        if (this.isNearMediaSite(x, z, 20)) return;
        for (let stripe = -4; stripe <= 4; stripe += 1) {
          crosswalks.push({ x: x + stripe * 1.35, y: 0.075, z: z + 7.0, sx: 0.75, sy: 1, sz: 3.3 });
          crosswalks.push({ x: x + 7.0, y: 0.076, z: z + stripe * 1.35, sx: 3.3, sy: 1, sz: 0.75 });
        }
      }));
      addInstances("crosswalks", new THREE.PlaneGeometry(1, 1), roadPaint,
        crosswalks.map((item) => ({ ...item, rx: -Math.PI / 2, sy: item.sz, sz: 1 })));

      addInstances("bollards", new THREE.CylinderGeometry(0.18, 0.25, 1.25, 8), metal,
        pick(42, 0.35, 2).map((item) => ({ ...item, y: 0.72 })));

      pick(14, 1.8, 5, 15, true).forEach((item, index) => {
        const bench = new THREE.Group();
        const seat = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.2, 0.72), wood);
        seat.position.y = 1.0;
        bench.add(seat);
        const back = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.75, 0.16), wood);
        back.position.set(0, 1.42, -0.3);
        back.rotation.x = -0.1;
        bench.add(back);
        [-1.05, 1.05].forEach((x) => {
          const leg = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.95, 0.55), darkMetal);
          leg.position.set(x, 0.5, 0);
          bench.add(leg);
        });
        bench.position.set(item.x, 0, item.z);
        bench.rotation.y = item.rotation;
        bench.children.forEach((part) => { part.castShadow = !this.reducedMotion && index % 3 === 0; });
        addArtifact("complete benches", bench);
      });

      pick(12, 0.75, 7, 15, true).forEach((item) => {
        const hydrant = new THREE.Group();
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.38, 1.15, 10), red);
        body.position.y = 0.63;
        hydrant.add(body);
        const top = new THREE.Mesh(new THREE.SphereGeometry(0.34, 10, 7), red);
        top.scale.y = 0.58;
        top.position.y = 1.25;
        hydrant.add(top);
        [-0.38, 0.38].forEach((x) => {
          const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.18, 10), metal);
          cap.rotation.z = Math.PI / 2;
          cap.position.set(x, 0.83, 0);
          hydrant.add(cap);
        });
        hydrant.position.set(item.x, 0, item.z);
        addArtifact("identifiable hydrants", hydrant);
      });

      pick(12, 0.55, 8, 15, true).forEach((item, index) => {
        const sign = new THREE.Group();
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 3.8, 8), metal);
        pole.position.y = 1.9;
        sign.add(pole);
        const face = new THREE.Mesh(
          index % 2 ? new THREE.BoxGeometry(1.25, 0.82, 0.12) : new THREE.CylinderGeometry(0.65, 0.65, 0.12, 8),
          index % 2 ? darkMetal : red
        );
        if (index % 2 === 0) face.rotation.x = Math.PI / 2;
        face.position.y = 3.45;
        sign.add(face);
        sign.position.set(item.x, 0, item.z);
        sign.rotation.y = item.rotation;
        addArtifact("road signs", sign);
      });

      pick(9, 0.65, 11, 15, true).forEach((item, index) => {
        const trafficLight = new THREE.Group();
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 5.2, 8), darkMetal);
        pole.position.y = 2.6;
        trafficLight.add(pole);
        const housing = new THREE.Mesh(new THREE.BoxGeometry(0.62, 1.8, 0.55), darkMetal);
        housing.position.set(0, 4.35, 0.18);
        trafficLight.add(housing);
        [0xd9263f, 0xf0bd31, 0x38c978].forEach((color, lightIndex) => {
          const lens = new THREE.Mesh(new THREE.CircleGeometry(0.2, 12), new THREE.MeshBasicMaterial({
            color, transparent: true, opacity: lightIndex === index % 3 ? 1 : 0.28
          }));
          lens.position.set(0, 4.88 - lightIndex * 0.52, 0.47);
          trafficLight.add(lens);
        });
        trafficLight.position.set(item.x, 0, item.z);
        trafficLight.rotation.y = item.rotation;
        addArtifact("traffic lights", trafficLight);
      });

      const vehicleCandidates = [];
      roads.forEach((road, roadIndex) => {
        [-6.6, 6.6].forEach((side, sideIndex) => {
          for (let offset = -96; offset <= 96; offset += 32) {
            const vertical = (roadIndex + sideIndex) % 2 === 0;
            const item = vertical
              ? { x: road + side, z: offset, rotation: 0 }
              : { x: offset, z: road + side, rotation: Math.PI / 2 };
            if (clear(item.x, item.z, 2.7, 17)) vehicleCandidates.push(item);
          }
        });
      });
      vehicleCandidates.slice(0, 14).forEach((item, index) => {
        const vehicle = new THREE.Group();
        const isVan = index % 4 === 0;
        const bodyMaterial = new THREE.MeshStandardMaterial({
          color: [0x7e1834, 0x30506e, 0x73747a, 0x175447][index % 4], roughness: 0.38, metalness: 0.52
        });
        const body = new THREE.Mesh(new THREE.BoxGeometry(2.5, isVan ? 1.5 : 0.8, isVan ? 5.1 : 4.3), bodyMaterial);
        body.position.y = isVan ? 1.15 : 0.78;
        body.castShadow = !this.reducedMotion && index % 3 === 0;
        vehicle.add(body);
        const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.18, isVan ? 1.1 : 0.75, isVan ? 2.6 : 2.15), glass);
        cabin.position.set(0, isVan ? 2.05 : 1.43, isVan ? -0.35 : -0.2);
        vehicle.add(cabin);
        [-1.15, 1.15].forEach((x) => [-1.35, 1.35].forEach((z) => {
          const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.24, 10), rubber);
          wheel.rotation.z = Math.PI / 2;
          wheel.position.set(x, 0.46, z * (isVan ? 1.25 : 1));
          vehicle.add(wheel);
        }));
        vehicle.position.set(item.x, 0, item.z);
        vehicle.rotation.y = item.rotation;
        addArtifact(isVan ? "parked stylized vans" : "parked stylized cars", vehicle);
        this.obstacles.push({ x: item.x, z: item.z, radius: isVan ? 2.65 : 2.3 });
      });

      pick(11, 0.9, 9, 15, true).forEach((item) => {
        const box = new THREE.Mesh(new THREE.BoxGeometry(1.35, 2.1, 0.9), darkMetal);
        box.position.set(item.x, 1.05, item.z);
        box.rotation.y = item.rotation;
        addArtifact("utility boxes", box);
      });

      addInstances("drains", new THREE.BoxGeometry(1.25, 0.08, 0.48), darkMetal,
        pick(28, 0.25, 3).map((item) => ({ ...item, y: 0.09 })));

      addInstances("litter", new THREE.PlaneGeometry(0.55, 0.32), paper,
        pick(32, 0.15, 2).map((item, index) => ({
          x: item.x + (index % 2 ? 0.7 : -0.7), y: 0.09, z: item.z,
          rotation: item.rotation + index * 0.37, rx: -Math.PI / 2
        })));

      pick(10, 0.45, 10, 15, true).forEach((item, index) => {
        const poster = new THREE.Group();
        const backing = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.2, 0.12), darkMetal);
        backing.position.y = 1.5;
        poster.add(backing);
        const label = this.makeLabel(index % 2 ? "BOYO" : "NO WEAKIES", "TONIGHT", index % 2 ? 0xe21c3d : 0x8d6cff, 1.35, 1.85);
        label.position.set(0, 1.5, 0.07);
        poster.add(label);
        poster.position.set(item.x, 0, item.z);
        poster.rotation.y = item.rotation;
        addArtifact("posters", poster);
      });

      pick(8, 0.8, 13, 15, true).forEach((item) => {
        const vent = new THREE.Group();
        const grate = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.08, 16), darkMetal);
        grate.position.y = 0.08;
        vent.add(grate);
        [0.7, 1.25, 1.8].forEach((height, index) => {
          const steam = new THREE.Mesh(new THREE.SphereGeometry(0.38 + index * 0.12, 8, 6),
            new THREE.MeshBasicMaterial({ color: 0xd8d5e1, transparent: true, opacity: 0.09, depthWrite: false }));
          steam.scale.y = 1.6;
          steam.position.set(index % 2 ? 0.2 : -0.15, height, 0);
          vent.add(steam);
        });
        vent.position.set(item.x, 0, item.z);
        addArtifact("steam vents", vent);
      });

      const streetMarkings = [];
      roads.forEach((road) => {
        for (let offset = -96; offset <= 96; offset += 24) {
          if (!this.isNearMediaSite(road, offset, 15)) {
            streetMarkings.push({ x: road - 3.8, y: 0.073, z: offset, sx: 0.35, sy: 4.5, rx: -Math.PI / 2 });
            streetMarkings.push({ x: road + 3.8, y: 0.073, z: offset, sx: 0.35, sy: 4.5, rx: -Math.PI / 2 });
          }
          if (!this.isNearMediaSite(offset, road, 15)) {
            streetMarkings.push({ x: offset, y: 0.074, z: road - 3.8, sx: 4.5, sy: 0.35, rx: -Math.PI / 2 });
            streetMarkings.push({ x: offset, y: 0.074, z: road + 3.8, sx: 4.5, sy: 0.35, rx: -Math.PI / 2 });
          }
        }
      });
      addInstances("street markings", new THREE.PlaneGeometry(1, 1), roadPaint, streetMarkings);
    }

    createBillboards() {
      const billboardData = [
        ["assets/frames/raw-pap-1.jpg", -44, -18, Math.PI / 2],
        ["assets/frames/raw-pap-2.jpg", 44, -18, -Math.PI / 2],
        ["assets/frames/raw-pap-3.jpg", -44, 20, Math.PI / 2],
        ["assets/tiktok/boyo-12.jpg", 44, 20, -Math.PI / 2],
        ["assets/video-red-brick.jpg", -8, 91, Math.PI],
        ["assets/video-fuming.jpg", 8, -91, 0],
        ["assets/youtube/u_IWzvxKSek.jpg", -91, 14, Math.PI / 2],
        ["assets/youtube/2nJmvEeFbSE.jpg", 91, -14, -Math.PI / 2],
        ["assets/tiktok/boyo-03.jpg", -72, 87, Math.PI],
        ["assets/tiktok/boyo-08.jpg", 72, -87, 0],
        ["assets/brand-hero.png", 0, 108, Math.PI],
        ["assets/channel-banner.jpg", 0, -108, 0]
      ];
      billboardData.forEach(([path, x, z, rotation], index) => {
        const group = new THREE.Group();
        const backing = new THREE.Mesh(
          new THREE.BoxGeometry(18, 11, 0.45),
          new THREE.MeshStandardMaterial({ color: 0x050505, metalness: 0.62, roughness: 0.24 })
        );
        backing.castShadow = true;
        group.add(backing);
        const texture = this.textureLoader.load(path);
        texture.colorSpace = THREE.SRGBColorSpace;
        const image = new THREE.Mesh(
          new THREE.PlaneGeometry(17, 9.5),
          new THREE.MeshBasicMaterial({ map: texture, toneMapped: false })
        );
        image.position.z = 0.24;
        group.add(image);
        const trim = new THREE.Mesh(
          new THREE.PlaneGeometry(18.8, 10.8),
          new THREE.MeshBasicMaterial({
            color: index % 2 ? 0x8d6cff : 0xe21c3d,
            transparent: true,
            opacity: 0.2
          })
        );
        trim.position.z = -0.245;
        group.add(trim);
        group.position.set(x, 10, z);
        group.rotation.y = rotation;
        this.scene.add(group);
      });
    }

    isInTikTokAlleyClearance(x, z, margin = 0) {
      return x >= TIKTOK_ALLEY_CLEARANCE.minX - margin &&
        x <= TIKTOK_ALLEY_CLEARANCE.maxX + margin &&
        z >= TIKTOK_ALLEY_CLEARANCE.minZ - margin &&
        z <= TIKTOK_ALLEY_CLEARANCE.maxZ + margin;
    }

    isNearMediaSite(x, z, clearance = 13) {
      // Check billboard sites, signal stations, banshees main site
      if ([
        ...VIDEO_BILLBOARDS, ...SIGNAL_STATIONS, BANSHEES_SITE,
        ...BANSHEES_VIDEO_SITES
      ].some(
        (site) => Math.hypot(x - site.x, z - site.z) < clearance
      )) return true;
      if (this.isInTikTokAlleyClearance(x, z, clearance * 0.3)) return true;
      return false;
    }

    findClearPropPosition(centerX, centerZ, spread, clearance = 13) {
      for (let attempt = 0; attempt < 40; attempt += 1) {
        const x = centerX + rand(-spread, spread);
        const z = centerZ + rand(-spread, spread);
        if (!this.isNearMediaSite(x, z, clearance)) return new THREE.Vector2(x, z);
      }
      return new THREE.Vector2(centerX, centerZ);
    }

    createWorldProps() {
      const chrome = new THREE.MeshStandardMaterial({ color: 0xbfc4cc, metalness: 0.88, roughness: 0.2 });
      const red = new THREE.MeshStandardMaterial({ color: 0xc81435, emissive: 0x3d020d, roughness: 0.42 });
      const yellow = new THREE.MeshStandardMaterial({ color: 0xf2cb39, roughness: 0.64 });

      for (let index = 0; index < 18; index += 1) {
        const position = this.findClearPropPosition(-70, 66, 17);
        const egg = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 16), yellow);
        egg.scale.set(rand(1.2, 2.6), rand(2, 4.6), rand(1.2, 2.6));
        egg.position.set(position.x, egg.scale.y, position.y);
        egg.castShadow = true;
        egg.receiveShadow = true;
        this.scene.add(egg);
      }

      for (let index = 0; index < 22; index += 1) {
        const position = this.findClearPropPosition(70, -62, 18);
        const cone = new THREE.Group();
        const body = new THREE.Mesh(new THREE.ConeGeometry(1.15, 3.5, 18), red);
        body.position.y = 1.75;
        body.castShadow = true;
        cone.add(body);
        const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.63, 0.85, 0.42, 18), chrome);
        stripe.position.y = 1.7;
        cone.add(stripe);
        cone.position.set(position.x, 0, position.y);
        this.scene.add(cone);
      }

      for (let index = 0; index < 16; index += 1) {
        const position = this.findClearPropPosition(-72, -62, 18);
        const bin = new THREE.Mesh(new THREE.BoxGeometry(2.8, 4.2, 2.6), new THREE.MeshStandardMaterial({
          color: index % 2 ? 0x25252b : 0x4c1531,
          metalness: 0.45,
          roughness: 0.55
        }));
        bin.position.set(position.x, 2.1, position.y);
        bin.rotation.y = rand(0, Math.PI);
        bin.castShadow = true;
        this.scene.add(bin);
        this.obstacles.push({ x: bin.position.x, z: bin.position.z, radius: 1.7 });
      }
    }

    createStreetlights() {
      const poleMaterial = new THREE.MeshStandardMaterial({
        color: 0x8a8e96,
        metalness: 0.92,
        roughness: 0.22
      });
      const bulbMaterial = new THREE.MeshStandardMaterial({
        color: 0xffe8b8,
        emissive: 0xffd06a,
        emissiveIntensity: 6,
        roughness: 0.12
      });
      const poolMaterial = new THREE.MeshBasicMaterial({
        color: 0xffc46b, transparent: true, opacity: 0.055, depthWrite: false
      });
      const positions = [];
      [-72, 0, 72].forEach((road) => {
        for (let offset = -100; offset <= 100; offset += 20) {
          positions.push([road - 11, offset], [road + 11, offset]);
          positions.push([offset, road - 11], [offset, road + 11]);
        }
      });
      positions.filter((_, index) => index % 2 === 0).forEach(([x, z], index) => {
        if (this.isNearMediaSite(x, z, 11)) return;
        const group = new THREE.Group();
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.2, 8.5, 10), poleMaterial);
        pole.position.y = 4.25;
        pole.castShadow = true;
        group.add(pole);
        const arm = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.14, 0.14), poleMaterial);
        arm.position.set(0.95, 8.35, 0);
        group.add(arm);
        const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.34, 14, 10), bulbMaterial);
        lamp.position.set(2, 8.1, 0);
        group.add(lamp);
        // Luminous pool decal — cheap, no dynamic light
        const pool = new THREE.Mesh(new THREE.CircleGeometry(3.8, 24), poolMaterial);
        pool.rotation.x = -Math.PI / 2;
        pool.position.set(2, 0.055, 0);
        group.add(pool);
        // One real point light every 8 lamps for performance
        if (index % 8 === 0) {
          const light = new THREE.PointLight(0xffc46b, 16, 30, 2);
          light.position.set(2, 7.8, 0);
          light.castShadow = false;
          group.add(light);
        }
        group.position.set(x, 0, z);
        group.rotation.y = index % 2 ? Math.PI : 0;
        this.scene.add(group);
        this.obstacles.push({ x, z, radius: 0.72 });
      });
    }

    createPuddles() {
      const puddleMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x59698f,
        transparent: true,
        opacity: 0.38,
        roughness: 0.08,
        metalness: 0.32,
        clearcoat: 1,
        clearcoatRoughness: 0.03,
        depthWrite: false
      });
      for (let index = 0; index < 34; index += 1) {
        const x = rand(-110, 110);
        const z = rand(-110, 110);
        if (this.isNearMediaSite(x, z, 11)) continue;
        const puddle = new THREE.Mesh(new THREE.CircleGeometry(rand(1.2, 4.2), 28), puddleMaterial);
        puddle.rotation.x = -Math.PI / 2;
        puddle.scale.y = rand(0.28, 0.7);
        puddle.position.set(x, 0.055, z);
        this.scene.add(puddle);
      }
    }

    createCoins() {
      const gold = new THREE.MeshStandardMaterial({
        color: 0xffd24a,
        emissive: 0x6f4800,
        emissiveIntensity: 1.3,
        metalness: 0.86,
        roughness: 0.19
      });
      const dark = new THREE.MeshStandardMaterial({ color: 0x141414, metalness: 0.7, roughness: 0.25 });
      for (let index = 0; index < 30; index += 1) {
        const group = new THREE.Group();
        const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.18, 28), gold);
        coin.rotation.x = Math.PI / 2;
        coin.castShadow = true;
        group.add(coin);
        const inset = new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.07, 8, 24), dark);
        inset.position.z = 0.11;
        group.add(inset);
        const mark = this.makeLabel("B", "", 0xffd24a, 0.66, 0.66);
        mark.position.z = 0.13;
        group.add(mark);
        const district = DISTRICTS[index % DISTRICTS.length];
        const angle = (index / 30) * Math.PI * 2 + index * 0.7;
        const radius = 15 + (index % 5) * 6;
        group.position.set(
          clamp(district.x + Math.sin(angle) * radius, -108, 108),
          1.55,
          clamp(district.z + Math.cos(angle) * radius, -108, 108)
        );
        if (this.isNearMediaSite(group.position.x, group.position.z, 10)) {
          const position = this.findClearPropPosition(district.x, district.z, 30, 10);
          group.position.set(position.x, 1.55, position.y);
        }
        group.rotation.y = angle;
        this.scene.add(group);
        this.coins.push({ group, baseY: group.position.y, phase: index * 0.53, collected: false });
      }
    }

    createGraffitiTexture(text, color) {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 256;
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.save();
      context.translate(canvas.width / 2, canvas.height / 2);
      context.rotate(rand(-0.035, 0.035));
      context.textAlign = "center";
      context.textBaseline = "middle";
      const { size } = fitCanvasText(context, text, 900, 104, 1000, 36);
      context.font = `1000 ${size}px ${LABEL_FONT_FAMILY}`;
      context.lineWidth = 16;
      context.strokeStyle = "rgba(0,0,0,.75)";
      context.strokeText(text, 0, 0);
      context.fillStyle = color;
      context.fillText(text, 0, 0);
      context.globalAlpha = 0.32;
      for (let drip = 0; drip < 26; drip += 1) {
        const x = rand(-420, 420);
        context.fillRect(x, rand(30, 70), rand(3, 10), rand(25, 100));
      }
      context.restore();
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    }

    createBansheesLandmark() {
      const position = new THREE.Vector3(BANSHEES_SITE.x, 10, BANSHEES_SITE.z);
      const texture = this.textureLoader.load("assets/banshees/opening-1.jpg");
      texture.colorSpace = THREE.SRGBColorSpace;
      const backing = new THREE.Mesh(
        new THREE.BoxGeometry(25, 31, 1),
        new THREE.MeshStandardMaterial({ color: 0x050507, metalness: 0.72, roughness: 0.22 })
      );
      backing.position.copy(position);
      backing.castShadow = true;
      this.scene.add(backing);
      const logo = new THREE.Mesh(
        new THREE.PlaneGeometry(23, 29),
        new THREE.MeshBasicMaterial({ map: texture, toneMapped: false })
      );
      logo.position.copy(position).add(new THREE.Vector3(0, 0, 0.51));
      this.scene.add(logo);
      const goldLight = new THREE.PointLight(0xffd13f, 25, 52, 2);
      goldLight.position.set(position.x, 13, position.z - 5);
      this.scene.add(goldLight);
      const blueLight = new THREE.PointLight(0x2c4167, 20, 42, 2);
      blueLight.position.set(position.x - 7, 8, position.z + 4);
      this.scene.add(blueLight);
      this.bansheesPosition = position;
      this.obstacles.push({ x: position.x, z: position.z, radius: 13 });

      const graffiti = [
        ["BANSHEES RISE", "#ffd13f", -88, 12, 93, 0],
        ["BOYOWORLD BANSHEES", "#ffffff", 0, 11, 110, Math.PI],
        ["BANSHEES RISE", "#e21c3d", 110, 10, 36, -Math.PI / 2],
        ["BOYOWORLD BANSHEES", "#8d6cff", -110, 13, -24, Math.PI / 2],
        ["BANSHEES RISE", "#49f5c0", 36, 9, -110, 0]
      ];
      graffiti.forEach(([text, color, x, y, z, rotation]) => {
        const plane = new THREE.Mesh(
          new THREE.PlaneGeometry(text.length > 14 ? 23 : 17, 4.5),
          new THREE.MeshBasicMaterial({
            map: this.createGraffitiTexture(text, color),
            transparent: true,
            depthWrite: false
          })
        );
        plane.position.set(x, y, z);
        plane.rotation.y = rotation;
        this.scene.add(plane);
      });

      this.bansheesAudio = new Audio("assets/banshees/banshees-rise.mp3");
      this.bansheesAudio.loop = true;
      this.bansheesAudio.preload = "metadata";
      this.bansheesAudio.volume = 0;
      // Banshees TikTok video sources (proximity audio candidates, ideally replacing mp3)
      this.bansheesVideoSourcesArr = BANSHEES_VIDEO_SOURCES.map((source) => {
        const video = document.createElement("video");
        video.src = source.src;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.preload = "metadata";
        video.crossOrigin = "anonymous";
        video.volume = 0;
        const texture = new THREE.VideoTexture(video);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        return { ...source, video, texture, currentVolume: 0, playBlocked: false, aspect: 9 / 16 };
      });
      const backingGeometry = new THREE.BoxGeometry(7.8, 13.8, 0.6);
      const screenGeometry = new THREE.PlaneGeometry(6.75, 12);
      const backingMaterial = new THREE.MeshStandardMaterial({
        color: 0x050507, metalness: 0.76, roughness: 0.2
      });
      this.bansheesVideoScreens = this.bansheesVideoSourcesArr.map((source, index) => {
        const site = BANSHEES_VIDEO_SITES[index];
        const group = new THREE.Group();
        const backing = new THREE.Mesh(backingGeometry, backingMaterial);
        backing.castShadow = true;
        group.add(backing);
        const screen = new THREE.Mesh(
          screenGeometry,
          new THREE.MeshBasicMaterial({ map: source.texture, toneMapped: false })
        );
        screen.position.z = 0.32;
        group.add(screen);
        const label = this.makeLabel(
          index ? "JOIN THE BANSHEES" : "BANSHEES RISE",
          "AMIE1985 · TIKTOK",
          0xffd13f,
          7.2,
          1.45
        );
        label.position.set(0, -7.8, 0.5);
        group.add(label);
        group.position.set(site.x, site.y, site.z);
        group.lookAt(BANSHEES_SITE.x, site.y, BANSHEES_SITE.z);
        this.scene.add(group);
        this.obstacles.push({ x: site.x, z: site.z, radius: 4.2 });
        return {
          ...site,
          label: source.label,
          position: new THREE.Vector3(site.x, site.y, site.z),
          group,
          sourceIndex: index
        };
      });
    }

    createPortals() {
      DISTRICTS.forEach((district, index) => {
        const portal = new THREE.Group();
        const torus = new THREE.Mesh(
          new THREE.TorusGeometry(index === 0 ? 4.6 : 3.5, 0.26, 14, 48),
          new THREE.MeshStandardMaterial({
            color: district.color,
            emissive: district.color,
            emissiveIntensity: 2.2,
            metalness: 0.7,
            roughness: 0.2
          })
        );
        torus.castShadow = true;
        portal.add(torus);
        const core = new THREE.Mesh(
          new THREE.CircleGeometry(index === 0 ? 4.15 : 3.15, 40),
          new THREE.MeshBasicMaterial({
            color: district.color,
            transparent: true,
            opacity: 0.11,
            side: THREE.DoubleSide
          })
        );
        portal.add(core);
        portal.position.set(district.x, index === 0 ? 5.1 : 4.2, district.z);
        this.scene.add(portal);
        this.portals.push({ group: portal, torus, core, phase: index * 1.3 });
        if (index < 4) {
          const light = new THREE.PointLight(district.color, 18, 35, 2);
          light.position.set(district.x, index === 0 ? 5.2 : 4.4, district.z);
          this.scene.add(light);
        }
      });
    }

    createSignalStations() {
      const pylonMat = new THREE.MeshStandardMaterial({ color: 0x16161e, metalness: 0.88, roughness: 0.18 });
      SIGNAL_STATIONS.forEach((data) => {
        const group = new THREE.Group();
        group.position.set(data.x, 0, data.z);

        // Glow pad on ground
        const padMat = new THREE.MeshBasicMaterial({
          color: data.color, transparent: true, opacity: 0.16, depthWrite: false
        });
        const pad = new THREE.Mesh(new THREE.CircleGeometry(4.8, 36), padMat);
        pad.rotation.x = -Math.PI / 2;
        pad.position.y = 0.06;
        group.add(pad);

        // Pylon
        const pylon = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 15, 12), pylonMat);
        pylon.position.y = 7.5;
        pylon.castShadow = true;
        group.add(pylon);

        // Beacon top
        const beaconMat = new THREE.MeshStandardMaterial({
          color: data.color, emissive: new THREE.Color(data.color),
          emissiveIntensity: 5, roughness: 0.14
        });
        const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.42, 14, 10), beaconMat);
        beacon.position.y = 15.3;
        group.add(beacon);

        // Poster backing
        const backing = new THREE.Mesh(
          new THREE.BoxGeometry(8.8, 12.4, 0.52),
          new THREE.MeshStandardMaterial({ color: 0x050508, metalness: 0.68, roughness: 0.26 })
        );
        backing.position.y = 8.0;
        backing.castShadow = true;
        group.add(backing);

        // Poster image
        const texture = this.textureLoader.load(data.poster);
        texture.colorSpace = THREE.SRGBColorSpace;
        const poster = new THREE.Mesh(
          new THREE.PlaneGeometry(8.2, 11.6),
          new THREE.MeshBasicMaterial({ map: texture, toneMapped: false })
        );
        poster.position.set(0, 8.0, 0.28);
        group.add(poster);

        // Glowing frame
        const frameMat = new THREE.MeshBasicMaterial({
          color: data.color, transparent: true, opacity: 0.26, depthWrite: false
        });
        const frame = new THREE.Mesh(new THREE.PlaneGeometry(9.4, 13.2), frameMat);
        frame.position.set(0, 8.0, -0.27);
        group.add(frame);

        // Station label
        const label = this.makeLabel(data.label, "SIGNAL STATION", data.color, 7.0, 1.3);
        label.position.set(0, 15.0, 0.4);
        group.add(label);

        this.scene.add(group);
        this.obstacles.push({ x: data.x, z: data.z, radius: 4.8 });

        this.signalStations.push({
          id: data.id,
          label: data.label,
          position: new THREE.Vector3(data.x, 0, data.z),
          group,
          pad,
          padMat,
          beaconMat,
          color: data.color,
          active: false,
          wasActive: false
        });
      });
    }

    createAtmosphere() {
      const count = this.reducedMotion ? 220 : 760;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const red = new THREE.Color(0xe21c3d);
      const violet = new THREE.Color(0x8d6cff);
      for (let index = 0; index < count; index += 1) {
        positions[index * 3] = rand(-125, 125);
        positions[index * 3 + 1] = rand(2, 58);
        positions[index * 3 + 2] = rand(-125, 125);
        const color = index % 3 ? red : violet;
        colors[index * 3] = color.r;
        colors[index * 3 + 1] = color.g;
        colors[index * 3 + 2] = color.b;
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      const material = new THREE.PointsMaterial({
        size: 0.34,
        vertexColors: true,
        transparent: true,
        opacity: 0.65,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      this.embers = new THREE.Points(geometry, material);
      this.scene.add(this.embers);
    }

    createHorse() {
      const horse = new THREE.Group();
      horse.name = "BOYO wooden toy horse";
      const woodTexture = this.createWoodTexture();
      const wood = new THREE.MeshStandardMaterial({
        color: 0xb26b38,
        map: woodTexture,
        bumpMap: woodTexture,
        bumpScale: 0.18,
        roughness: 0.72,
        metalness: 0.03
      });
      const darkWood = new THREE.MeshStandardMaterial({
        color: 0x4a2418,
        map: woodTexture,
        bumpMap: woodTexture,
        bumpScale: 0.1,
        roughness: 0.82
      });
      const leather = new THREE.MeshStandardMaterial({ color: 0x321b1b, roughness: 0.68, metalness: 0.08 });
      const brass = new THREE.MeshStandardMaterial({ color: 0xd7a93e, roughness: 0.24, metalness: 0.82 });
      this.horseParts = [];
      const horseShadowParts = new Set([
        "carved barrel", "chest", "neck", "carved head", "saddle", "upper leg", "lower leg"
      ]);
      const addPart = (name, mesh, parent = horse) => {
        mesh.name = name;
        mesh.castShadow = !this.reducedMotion && horseShadowParts.has(name);
        mesh.receiveShadow = true;
        parent.add(mesh);
        this.horseParts.push(mesh);
        return mesh;
      };

      const body = addPart("carved barrel", new THREE.Mesh(new THREE.CapsuleGeometry(0.78, 2.15, 8, 16), wood));
      body.rotation.x = Math.PI / 2;
      body.scale.set(1.05, 1, 0.95);
      body.position.set(0, 1.72, 0);
      const chest = addPart("chest", new THREE.Mesh(new THREE.SphereGeometry(0.86, 18, 14), wood));
      chest.scale.set(0.82, 1.08, 0.9);
      chest.position.set(0, 1.88, 1.12);
      const neckPivot = new THREE.Group();
      neckPivot.name = "neck pivot";
      neckPivot.position.set(0, 2.12, 1.24);
      horse.add(neckPivot);
      this.horseParts.push(neckPivot);
      const neck = addPart("neck", new THREE.Mesh(new THREE.CapsuleGeometry(0.44, 1.42, 7, 12), wood), neckPivot);
      neck.rotation.x = -0.34;
      neck.position.set(0, 0.55, 0.3);
      const headPivot = new THREE.Group();
      headPivot.name = "head pivot";
      headPivot.position.set(0, 1.25, 0.52);
      neckPivot.add(headPivot);
      this.horseParts.push(headPivot);
      const head = addPart("carved head", new THREE.Mesh(new THREE.SphereGeometry(0.62, 18, 14), wood), headPivot);
      head.scale.set(0.8, 0.92, 1.32);
      head.position.z = 0.32;
      const muzzle = addPart("muzzle", new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 12), darkWood), headPivot);
      muzzle.scale.set(0.9, 0.62, 1.2);
      muzzle.position.set(0, -0.18, 0.92);
      [-0.31, 0.31].forEach((x) => {
        const ear = addPart("ear", new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.55, 10), wood), headPivot);
        ear.position.set(x, 0.62, 0.18);
        const eye = addPart("glass eye", new THREE.Mesh(
          new THREE.SphereGeometry(0.075, 10, 8),
          new THREE.MeshPhysicalMaterial({ color: 0x090808, roughness: 0.08, clearcoat: 1 })
        ), headPivot);
        eye.position.set(x * 1.45, 0.12, 0.58);
      });
      const mane = addPart("mane", new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.62, 0.52), darkWood), neckPivot);
      mane.position.set(0, 0.66, -0.3);
      mane.rotation.x = -0.28;
      const saddle = addPart("saddle", new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.24, 1.25), leather));
      saddle.position.set(0, 2.5, -0.25);
      const saddleTrim = addPart("saddle brass", new THREE.Mesh(new THREE.TorusGeometry(0.66, 0.06, 8, 20), brass));
      saddleTrim.rotation.x = Math.PI / 2;
      saddleTrim.position.set(0, 2.48, -0.15);
      const bridle = addPart("bridle", new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.045, 6, 18), leather), headPivot);
      bridle.position.set(0, -0.04, 0.63);
      this.reinBridleAnchors = [-0.28, 0.28].map((x) => {
        const anchor = new THREE.Object3D();
        anchor.position.set(x, -0.04, 0.63);
        headPivot.add(anchor);
        return anchor;
      });
      const saddleCloth = addPart("Welsh red saddle cloth", new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.12, 1.55),
        new THREE.MeshStandardMaterial({ color: 0xb91532, roughness: 0.78 })));
      saddleCloth.position.set(0, 2.37, -0.22);
      [
        [-0.72, "left stirrup strap", "left metal stirrup"],
        [0.72, "right stirrup strap", "right metal stirrup"]
      ].forEach(([x, strapName, stirrupName]) => {
        const strap = addPart(strapName,
          new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.58, 4, 7), leather));
        strap.position.set(x, 2.18, 0.25);
        const stirrup = addPart(stirrupName,
          new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.055, 7, 16), brass));
        stirrup.position.set(x, 1.86, 0.25);
        stirrup.scale.y = 1.28;
      });

      this.horseLegs = [];
      [[-0.55, 0.78], [0.55, 0.78], [-0.55, -0.78], [0.55, -0.78]].forEach(([x, z], index) => {
        const upperPivot = new THREE.Group();
        upperPivot.name = `horse leg ${index + 1}`;
        upperPivot.position.set(x, 1.52, z);
        horse.add(upperPivot);
        this.horseParts.push(upperPivot);
        const upper = addPart("upper leg", new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 0.72, 5, 8), wood), upperPivot);
        upper.position.y = -0.46;
        const knee = new THREE.Group();
        knee.name = "knee";
        knee.position.y = -0.92;
        upperPivot.add(knee);
        this.horseParts.push(knee);
        const lower = addPart("lower leg", new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.62, 5, 8), darkWood), knee);
        lower.position.y = -0.4;
        const hoof = addPart("hoof", new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.22, 0.52), darkWood), knee);
        hoof.position.set(0, -0.83, 0.08);
        const footfallPhases = [0, Math.PI, Math.PI * 1.5, Math.PI * 0.5];
        this.horseLegs.push({ upperPivot, knee, phase: footfallPhases[index], front: z > 0 });
      });
      this.horseTail = new THREE.Group();
      this.horseTail.position.set(0, 1.98, -1.48);
      horse.add(this.horseTail);
      this.horseParts.push(this.horseTail);
      const tail = addPart("tail", new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 1.15, 6, 10), darkWood), this.horseTail);
      tail.position.set(0, -0.55, -0.12);
      tail.rotation.x = -0.24;
      this.horseHead = headPivot;
      this.horseNeck = neckPivot;
      this.horse = horse;
      this.player.add(horse);
    }

    createPlayer() {
      this.player = new THREE.Group();
      this.player.name = "mounted movement root";
      this.player.position.set(0, 0, 18);
      this.player.rotation.order = "YXZ";

      const black = new THREE.MeshStandardMaterial({ color: 0x111115, roughness: 0.62, metalness: 0.2 });
      const white = new THREE.MeshStandardMaterial({ color: 0xf2f1ee, roughness: 0.94, metalness: 0 });
      const red = new THREE.MeshStandardMaterial({
        color: 0xd41435,
        emissive: 0x3b020d,
        emissiveIntensity: 0.65,
        roughness: 0.48
      });
      const chrome = new THREE.MeshStandardMaterial({ color: 0xc3c6ce, roughness: 0.18, metalness: 0.92 });

      this.playerShadow = new THREE.Mesh(
        new THREE.CircleGeometry(2.15, 32),
        new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.42, depthWrite: false })
      );
      this.playerShadow.rotation.x = -Math.PI / 2;
      this.playerShadow.position.y = 0.03;
      this.player.add(this.playerShadow);

      this.createHorse();
      this.rider = new THREE.Group();
      this.rider.name = "mounted BOYO rider";
      this.rider.position.y = 1.28;
      this.player.add(this.rider);

      const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.83, 1.55, 8, 16), black);
      torso.position.y = 2.48;
      torso.castShadow = true;
      this.rider.add(torso);
      this.riderTorso = torso;

      const belt = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.23, 0.92), red);
      belt.position.set(0, 1.68, 0);
      belt.castShadow = true;
      this.rider.add(belt);

      const zipper = new THREE.Mesh(new THREE.BoxGeometry(0.09, 1.35, 0.08), chrome);
      zipper.position.set(0, 2.68, 0.78);
      this.rider.add(zipper);
      [-0.62, 0.62].forEach((x) => {
        const jacketPanel = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.18, 0.12), red);
        jacketPanel.position.set(x, 3.18, 0.7);
        jacketPanel.rotation.z = x < 0 ? -0.18 : 0.18;
        this.rider.add(jacketPanel);
      });

      this.playerLimbs = {};
      this.playerLimbs.leftLeg = this.makeLimb(black, -0.46, 1.36, 0, 0.28, 1.42);
      this.playerLimbs.rightLeg = this.makeLimb(black, 0.46, 1.36, 0, 0.28, 1.42);
      this.playerLimbs.leftArm = this.makeLimb(black, -0.98, 3.35, 0.08, 0.23, 1.26);
      this.playerLimbs.rightArm = this.makeLimb(black, 0.98, 3.35, 0.08, 0.23, 1.26);
      Object.values(this.playerLimbs).forEach((limb) => this.rider.add(limb));
      [this.playerLimbs.leftLeg, this.playerLimbs.rightLeg].forEach((limb) => {
        const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.3, 1.0), black);
        shoe.position.set(0, -1.38, 0.24);
        shoe.castShadow = true;
        limb.add(shoe);
      });

      const skin = new THREE.MeshStandardMaterial({ color: 0xb98062, roughness: 0.82, metalness: 0 });
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.87, 32, 24), skin);
      head.scale.set(0.91, 1.13, 0.93);
      head.position.y = 4.58;
      head.castShadow = true;
      this.rider.add(head);

      const knitTexture = this.createKnitTexture();
      const maskMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xf3f3ef,
        map: knitTexture,
        bumpMap: knitTexture,
        bumpScale: 0.13,
        roughness: 0.92,
        metalness: 0,
        clearcoat: 0.08
      });
      const mask = new THREE.Mesh(new THREE.SphereGeometry(0.94, 40, 30), maskMaterial);
      mask.scale.set(0.95, 1.18, 0.98);
      mask.position.y = 4.59;
      mask.castShadow = true;
      this.rider.add(mask);

      const openingMaterial = new THREE.MeshBasicMaterial({ color: 0x160c0c });
      const eyeMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xd3d7c8,
        roughness: 0.18,
        clearcoat: 1,
        clearcoatRoughness: 0.04
      });
      [-0.34, 0.34].forEach((x, eyeIndex) => {
        const opening = new THREE.Mesh(new THREE.SphereGeometry(0.27, 24, 16), openingMaterial);
        opening.scale.set(1.35, 0.62, 0.2);
        opening.position.set(x, 4.73, 0.92);
        opening.rotation.z = eyeIndex ? 0.15 : -0.15;
        this.rider.add(opening);
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.13, 20, 14), eyeMaterial);
        eye.scale.set(1.3, 0.65, 0.45);
        eye.position.set(x, 4.73, 0.99);
        this.rider.add(eye);
        const pupil = new THREE.Mesh(
          new THREE.SphereGeometry(0.065, 16, 12),
          new THREE.MeshBasicMaterial({ color: 0x12110f })
        );
        pupil.position.set(x, 4.73, 1.06);
        this.rider.add(pupil);
      });
      const mouthOpening = new THREE.Mesh(new THREE.SphereGeometry(0.29, 24, 16), openingMaterial);
      mouthOpening.scale.set(0.78, 1.08, 0.18);
      mouthOpening.position.set(0, 4.17, 0.94);
      this.rider.add(mouthOpening);
      const mouth = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 20, 14),
        new THREE.MeshStandardMaterial({ color: 0x761d24, roughness: 0.76 })
      );
      mouth.scale.set(0.76, 1.05, 0.3);
      mouth.position.set(0, 4.16, 1.01);
      this.rider.add(mouth);

      this.riderHands = [];
      [this.playerLimbs.leftArm, this.playerLimbs.rightArm].forEach((limb) => {
        const hand = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 9), skin);
        hand.scale.set(0.9, 0.72, 0.82);
        hand.position.set(0, -1.24, 0);
        limb.add(hand);
        this.riderHands.push(hand);
      });

      const boyoDecal = this.makeMaskDecal("BOYO", false);
      boyoDecal.position.set(-0.34, 4.4, 0.99);
      boyoDecal.scale.set(0.62, 0.2, 1);
      this.rider.add(boyoDecal);
      const dragonDecal = this.makeMaskDecal("", true);
      dragonDecal.position.set(0, 5.02, 0.83);
      dragonDecal.scale.set(0.58, 0.38, 1);
      this.rider.add(dragonDecal);

      const scarf = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.16, 10, 30), white);
      scarf.rotation.x = Math.PI / 2;
      scarf.position.y = 3.76;
      scarf.castShadow = true;
      this.rider.add(scarf);

      this.gun = new THREE.Group();
      const gunBody = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, 1.62), chrome);
      gunBody.position.z = 0.6;
      gunBody.castShadow = true;
      this.gun.add(gunBody);
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.42, 12), red);
      barrel.rotation.x = Math.PI / 2;
      barrel.position.z = 1.65;
      barrel.castShadow = true;
      this.gun.add(barrel);
      const stock = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.65, 0.5), black);
      stock.position.set(0, -0.36, 0);
      this.gun.add(stock);
      this.gun.position.set(0.84, 2.85, 0.48);
      this.rider.add(this.gun);

      const muzzleLight = new THREE.PointLight(0xff3355, 0, 8, 2);
      muzzleLight.position.set(0, 0, 2.45);
      this.gun.add(muzzleLight);
      this.muzzleLight = muzzleLight;

      this.playerLimbs.leftLeg.position.set(-0.67, 2.05, 0);
      this.playerLimbs.rightLeg.position.set(0.67, 2.05, 0);
      this.playerLimbs.leftLeg.rotation.set(-0.1, 0, -0.18);
      this.playerLimbs.rightLeg.rotation.set(-0.1, 0, 0.18);
      this.playerLimbs.leftArm.rotation.set(-0.72, 0, 0.2);
      this.playerLimbs.rightArm.rotation.set(-0.62, 0, -0.14);
      const reinGeometry = new THREE.CylinderGeometry(0.035, 0.035, 1, 6);
      const reinMaterial = new THREE.MeshStandardMaterial({ color: 0x321b1b, roughness: 0.7 });
      this.reins = ["left leather rein", "right leather rein"].map((name, index) => {
        const rein = new THREE.Group();
        rein.name = name;
        const segments = [0, 1].map(() => {
          const segment = new THREE.Mesh(reinGeometry, reinMaterial);
          segment.castShadow = !this.reducedMotion;
          rein.add(segment);
          return segment;
        });
        this.player.add(rein);
        this.horseParts.push(rein);
        return { rein, segments, bridleAnchor: this.reinBridleAnchors[index], hand: this.riderHands[index] };
      });
      this.reinScratch = {
        from: new THREE.Vector3(),
        to: new THREE.Vector3(),
        midpoint: new THREE.Vector3(),
        delta: new THREE.Vector3()
      };
      this.createKillSpeechBubble();

      this.scene.add(this.player);
      this.player.updateMatrixWorld(true);
      this.updateReins();
    }

    updateReins() {
      if (!this.reins) return;
      this.player.updateMatrixWorld(true);
      const { from, to, midpoint, delta } = this.reinScratch;
      this.reins.forEach((reinData) => {
        reinData.bridleAnchor.getWorldPosition(from);
        reinData.hand.getWorldPosition(to);
        this.player.worldToLocal(from);
        this.player.worldToLocal(to);
        midpoint.copy(from).lerp(to, 0.52);
        midpoint.y -= 0.15;
        [from, midpoint, to].forEach((point, index, points) => {
          if (index === points.length - 1) return;
          const segment = reinData.segments[index];
          delta.copy(points[index + 1]).sub(point);
          segment.position.copy(point).add(points[index + 1]).multiplyScalar(0.5);
          segment.scale.set(1, delta.length(), 1);
          segment.quaternion.setFromUnitVectors(UP, delta.normalize());
        });
      });
    }

    createKillSpeechBubble() {
      this.killSpeech = new THREE.Sprite(new THREE.SpriteMaterial({
        transparent: true,
        depthTest: false,
        depthWrite: false
      }));
      // Centered above rider head (mask top ~5.5 in rider space)
      this.killSpeech.position.set(0, 6.2, 0);
      this.killSpeech.scale.set(4.8, 1.55, 1);
      this.killSpeech.renderOrder = 40;
      this.killSpeech.visible = false;
      this.rider.add(this.killSpeech);
      this.speechAnchor = "rider.head";
    }

    createKillSpeechTexture(phrase) {
      const canvas = document.createElement("canvas");
      canvas.width = 768;
      canvas.height = 256;
      const context = canvas.getContext("2d");
      context.fillStyle = "#fffdf5";
      context.strokeStyle = "#09090d";
      context.lineWidth = 14;
      context.beginPath();
      context.roundRect(26, 20, 690, 174, 34);
      context.fill();
      context.stroke();
      context.beginPath();
      context.moveTo(330, 190);
      context.lineTo(370, 238);
      context.lineTo(410, 190);
      context.fill();
      context.stroke();
      context.fillStyle = "#0b0b0e";
      const speechWeight = phrase.length > 14 ? 700 : 900;
      const { size } = fitCanvasText(context, phrase, 620, 78, speechWeight, 38);
      context.font = `${speechWeight} ${size}px ${LABEL_FONT_FAMILY}`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(phrase, 370, 108);
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    }

    showKillSpeech() {
      const phrase = KILL_PHRASES[this.killSpeechIndex % KILL_PHRASES.length];
      this.killSpeechIndex += 1;
      const previous = this.killSpeech.material.map;
      this.killSpeech.material.map = this.createKillSpeechTexture(phrase);
      this.killSpeech.material.needsUpdate = true;
      previous?.dispose();
      this.killSpeechPhrase = phrase;
      this.killSpeechVisible = true;
      this.killSpeechStartedAt = this.elapsed;
      this.killSpeechUntil = this.elapsed + rand(1.5, 2);
      this.killSpeech.visible = true;
      this.killSpeech.material.opacity = 1;
      this.killSpeech.scale.set(4.8, 1.55, 1);
      return phrase;
    }

    makeMaskDecal(text, dragon = false) {
      if (dragon) {
        const texture = this.textureLoader.load("assets/mask-dragon.png");
        texture.colorSpace = THREE.SRGBColorSpace;
        return new THREE.Sprite(new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          depthTest: true
        }));
      }
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 256;
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#080808";
      const { size } = fitCanvasText(context, text, 460, 132, 1000, 52);
      context.font = `1000 ${size}px ${LABEL_FONT_FAMILY}`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(text, 256, 132);
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: true });
      return new THREE.Sprite(material);
    }

    createVideoBillboards() {
      // Nine shared official video elements + textures (reused by all 18 displays)
      this.videoSources = VIDEO_SOURCES.map((source) => {
        const video = document.createElement("video");
        video.src = source.src;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.preload = "metadata";
        video.crossOrigin = "anonymous";
        video.volume = 0;
        const texture = new THREE.VideoTexture(video);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        return { ...source, video, texture, currentVolume: 0, playBlocked: false };
      });

      const PANEL_W = 19.2;
      const PANEL_H = 12.0;
      const FRAME_COLORS = [0xff2255, 0x7a50ff, 0xffd23f, 0x40f5c0, 0xff7730, 0x50dfff];
      const pylonMat = new THREE.MeshStandardMaterial({ color: 0x1e2030, metalness: 0.86, roughness: 0.22 });

      this.videoBillboards = VIDEO_BILLBOARDS.map((data) => {
        const source = this.videoSources[data.s];
        const aspect = source.aspect;
        // Letterbox: fit video aspect inside panel, preserving aspect ratio
        let screenW, screenH;
        if (aspect >= PANEL_W / PANEL_H) {
          screenW = PANEL_W - 0.5;
          screenH = (PANEL_W - 0.5) / aspect;
        } else {
          screenH = PANEL_H - 0.5;
          screenW = (PANEL_H - 0.5) * aspect;
        }

        const fc = FRAME_COLORS[data.s % FRAME_COLORS.length];
        const group = new THREE.Group();

        // Support pylon
        const pylonHeight = data.y * 0.82;
        const pylon = new THREE.Mesh(
          new THREE.CylinderGeometry(0.2, 0.32, pylonHeight, 10), pylonMat
        );
        pylon.position.y = -pylonHeight / 2 - 0.1;
        pylon.castShadow = true;
        group.add(pylon);

        // Backing panel
        const backing = new THREE.Mesh(
          new THREE.BoxGeometry(PANEL_W, PANEL_H, 0.64),
          new THREE.MeshStandardMaterial({ color: 0x04040a, metalness: 0.76, roughness: 0.2 })
        );
        backing.castShadow = true;
        group.add(backing);

        // Video screen — aspect-correct letterbox
        const screen = new THREE.Mesh(
          new THREE.PlaneGeometry(screenW, screenH),
          new THREE.MeshBasicMaterial({ map: source.texture, toneMapped: false })
        );
        screen.position.z = 0.34;
        group.add(screen);

        // Glow frame border
        const frameMat = new THREE.MeshBasicMaterial({ color: fc, transparent: true, opacity: 0.24 });
        const frame = new THREE.Mesh(new THREE.PlaneGeometry(PANEL_W + 1.4, PANEL_H + 1.4), frameMat);
        frame.position.z = -0.34;
        group.add(frame);

        // BOYO TV label below display
        const labelTex = roundedCanvasTexture(`BOYO TV · ${source.label}`, {
          width: 640, height: 112,
          accent: `#${fc.toString(16).padStart(6, "0")}`,
          subtext: "PROXIMITY AUDIO",
          fontSize: source.label.length > 20 ? 32 : 42
        });
        const labelMat = new THREE.SpriteMaterial({ map: labelTex, transparent: true, depthTest: false });
        const labelSprite = new THREE.Sprite(labelMat);
        labelSprite.scale.set(10, 1.4, 1);
        labelSprite.renderOrder = 20;
        labelSprite.position.set(0, -PANEL_H / 2 - 1.0, 0.5);
        group.add(labelSprite);

        // Beacon lights at top corners
        const beaconMat = new THREE.MeshStandardMaterial({
          color: fc, emissive: new THREE.Color(fc), emissiveIntensity: 4, roughness: 0.18
        });
        [-PANEL_W / 2 + 0.38, PANEL_W / 2 - 0.38].forEach((bx) => {
          const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 8), beaconMat);
          beacon.position.set(bx, PANEL_H / 2 + 0.32, 0.38);
          group.add(beacon);
        });

        group.position.set(data.x, data.y, data.z);
        // Initial face-toward origin; swivel updated per-frame
        group.lookAt(0, data.y, 0);
        this.scene.add(group);
        this.obstacles.push({ x: data.x, z: data.z, radius: PANEL_W * 0.48 });

        return {
          ...data,
          label: `BOYO TV · ${source.label}`,
          position: new THREE.Vector3(data.x, data.y, data.z),
          group,
          video: source.video,
          texture: source.texture,
          sourceIndex: data.s,
          fittedWidth: screenW,
          fittedHeight: screenH,
          lastVolume: 0
        };
      });
    }

    createTikTokAlley() {
      // 15 portrait screens at x=TIKTOK_ALLEY_X, facing east toward world centre
      const PORTRAIT_W = 6.75;
      const PORTRAIT_H = 12.0;
      const ALLEY_FRAME_COLOR = 0xff2255;
      const sharedPylonGeo = new THREE.CylinderGeometry(0.18, 0.26, 9, 10);
      const sharedBackingGeo = new THREE.BoxGeometry(PORTRAIT_W + 0.8, PORTRAIT_H + 0.8, 0.52);
      const sharedScreenGeo = new THREE.PlaneGeometry(PORTRAIT_W, PORTRAIT_H);
      const pylonMat = new THREE.MeshStandardMaterial({ color: 0x18192a, metalness: 0.86, roughness: 0.22 });
      const backingMat = new THREE.MeshStandardMaterial({ color: 0x04040a, metalness: 0.74, roughness: 0.22 });
      const plaqueMaterial = new THREE.MeshStandardMaterial({
        color: 0x11131a, metalness: 0.38, roughness: 0.58
      });
      const walkway = new THREE.Mesh(
        new THREE.PlaneGeometry(
          TIKTOK_ALLEY_CLEARANCE.maxX - TIKTOK_ALLEY_X - 2,
          TIKTOK_ALLEY_CLEARANCE.maxZ - TIKTOK_ALLEY_CLEARANCE.minZ
        ),
        new THREE.MeshPhysicalMaterial({
          color: 0x292235,
          roughness: 0.46,
          metalness: 0.2,
          clearcoat: 0.5,
          clearcoatRoughness: 0.26
        })
      );
      walkway.name = "TikTok Alley pedestrian corridor";
      walkway.rotation.x = -Math.PI / 2;
      walkway.position.set(
        (TIKTOK_ALLEY_X + TIKTOK_ALLEY_CLEARANCE.maxX) / 2 - 1,
        0.09,
        (TIKTOK_ALLEY_CLEARANCE.minZ + TIKTOK_ALLEY_CLEARANCE.maxZ) / 2
      );
      this.scene.add(walkway);
      const walkwayStripe = new THREE.Mesh(
        new THREE.PlaneGeometry(0.3, TIKTOK_ALLEY_CLEARANCE.maxZ - TIKTOK_ALLEY_CLEARANCE.minZ),
        new THREE.MeshBasicMaterial({ color: 0xff2255 })
      );
      walkwayStripe.rotation.x = -Math.PI / 2;
      walkwayStripe.position.set(walkway.position.x, 0.105, walkway.position.z);
      this.scene.add(walkwayStripe);
      const createPlaqueTexture = (label, subtext = "PLAY ON TIKTOK") => {
        const canvas = document.createElement("canvas");
        canvas.width = 768;
        canvas.height = 128;
        const context = canvas.getContext("2d");
        context.fillStyle = "#11131a";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = "#ff2255";
        context.lineWidth = 8;
        context.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);
        const titleSize = fitCanvasText(context, label, canvas.width - 56, 50, 800, 18).size;
        context.fillStyle = "#ffffff";
        context.font = `800 ${titleSize}px ${LABEL_FONT_FAMILY}`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(label, canvas.width / 2, 48);
        const subSize = fitCanvasText(context, subtext, canvas.width - 56, 20, 700, 12).size;
        context.fillStyle = "#ff6a83";
        context.font = `700 ${subSize}px ${LABEL_FONT_FAMILY}`;
        context.fillText(subtext, canvas.width / 2, 96);
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        return texture;
      };

      this.galleryVideoSources = TIKTOK_GALLERY_SOURCES.map((source) => {
        const video = document.createElement("video");
        video.src = source.src;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.preload = "metadata";
        video.crossOrigin = "anonymous";
        video.volume = 0;
        const texture = new THREE.VideoTexture(video);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        return { ...source, video, texture, currentVolume: 0, playBlocked: false, aspect: 9 / 16 };
      });

      this.tiktokGallery = this.galleryVideoSources.map((source, index) => {
        const z = TIKTOK_ALLEY_Z_START + index * TIKTOK_ALLEY_Z_STEP;
        const group = new THREE.Group();

        const pylon = new THREE.Mesh(sharedPylonGeo, pylonMat);
        pylon.position.set(0, 4.5, 0);
        pylon.castShadow = true;
        group.add(pylon);

        const backing = new THREE.Mesh(sharedBackingGeo, backingMat);
        backing.position.y = PORTRAIT_H / 2 + 0.5;
        backing.castShadow = true;
        group.add(backing);

        const screen = new THREE.Mesh(
          sharedScreenGeo,
          new THREE.MeshBasicMaterial({ map: source.texture, toneMapped: false })
        );
        screen.position.set(0, PORTRAIT_H / 2 + 0.5, 0.28);
        screen.userData.externalUrl = source.sourceUrl;
        screen.userData.mediaLabel = source.label;
        this.clickableMediaScreens.push(screen);
        group.add(screen);

        const frameMat = new THREE.MeshBasicMaterial({
          color: ALLEY_FRAME_COLOR, transparent: true, opacity: 0.22, depthWrite: false
        });
        const frame = new THREE.Mesh(
          new THREE.PlaneGeometry(PORTRAIT_W + 1.6, PORTRAIT_H + 1.6),
          frameMat
        );
        frame.position.set(0, PORTRAIT_H / 2 + 0.5, -0.28);
        group.add(frame);

        const plaque = new THREE.Mesh(
          new THREE.BoxGeometry(PORTRAIT_W, 1.15, 0.25),
          plaqueMaterial.clone()
        );
        plaque.position.set(0, 0.72, 0.08);
        group.add(plaque);
        const labelTex = createPlaqueTexture(source.label);
        this.labelFitCount += 1;
        const label = new THREE.Mesh(
          new THREE.PlaneGeometry(PORTRAIT_W - 0.22, 0.92),
          new THREE.MeshBasicMaterial({ map: labelTex, toneMapped: false })
        );
        label.position.set(0, 0.72, 0.215);
        group.add(label);

        group.position.set(TIKTOK_ALLEY_X, 0, z);
        group.rotation.y = Math.PI / 2;

        this.scene.add(group);
        this.obstacles.push({ x: TIKTOK_ALLEY_X, z, radius: PORTRAIT_W * 0.52 });

        return {
          index,
          label: source.label,
          sourceUrl: source.sourceUrl,
          position: new THREE.Vector3(TIKTOK_ALLEY_X, PORTRAIT_H / 2 + 0.5, z),
          group,
          video: source.video,
          texture: source.texture,
          sourceIndex: index,
          lastVolume: 0
        };
      });

      const entranceTex = roundedCanvasTexture("TIKTOK ALLEY", {
        width: 768,
        height: 160,
        background: "rgba(4,4,12,.92)",
        accent: "#ff2255",
        fontSize: 68,
        minFontSize: 28
      });
      this.labelFitCount += 1;
      const entranceMat = new THREE.SpriteMaterial({ map: entranceTex, transparent: true, depthTest: false });
      const entranceSign = new THREE.Sprite(entranceMat);
      entranceSign.scale.set(9, 1.9, 1);
      entranceSign.renderOrder = 22;
      entranceSign.position.set(TIKTOK_ALLEY_X + 10, 11.5, TIKTOK_ALLEY_Z_START - 7);
      this.scene.add(entranceSign);

      const galleryLight = new THREE.PointLight(0xff2255, 12, 55, 2);
      galleryLight.position.set(
        TIKTOK_ALLEY_X + 4,
        8,
        TIKTOK_ALLEY_Z_START +
          ((TIKTOK_GALLERY_SOURCES.length - 1) * TIKTOK_ALLEY_Z_STEP) / 2
      );
      galleryLight.distance = 95;
      this.scene.add(galleryLight);

    }

    createWayfinding() {
      // Colored district road bands + intersection signposts
      const intersections = [];
      [-72, 0, 72].forEach((x) => {
        [-72, 0, 72].forEach((z) => {
          intersections.push({ x, z });
        });
      });

      DISTRICTS.forEach((district) => {
        const bandMat = new THREE.MeshBasicMaterial({
          color: district.color, transparent: true, opacity: 0.18, depthWrite: false
        });
        const band = new THREE.Mesh(new THREE.PlaneGeometry(18, 8), bandMat);
        band.rotation.x = -Math.PI / 2;
        band.position.set(district.x, 0.06, district.z);
        this.scene.add(band);
      });

      const postMat = new THREE.MeshStandardMaterial({ color: 0xd4d8e0, metalness: 0.68, roughness: 0.32 });
      intersections.forEach(({ x, z }) => {
        const post = new THREE.Group();

        const pole = new THREE.Mesh(
          new THREE.CylinderGeometry(0.1, 0.1, 4.2, 8),
          postMat
        );
        pole.position.y = 2.1;
        post.add(pole);

        DISTRICTS.forEach((district, di) => {
          const dx = district.x - x;
          const dz = district.z - z;
          const dist = Math.hypot(dx, dz);
          if (dist < 5 || dist > 120) return;
          const angle = Math.atan2(dx, dz);
          const boardW = 2.8;
          const boardH = 0.7;
          const boardMat = new THREE.MeshStandardMaterial({
            color: district.color, roughness: 0.62, emissive: new THREE.Color(district.color), emissiveIntensity: 0.18
          });
          const board = new THREE.Mesh(new THREE.BoxGeometry(boardW, boardH, 0.08), boardMat);
          const yOff = 3.6 - di * 0.82;
          board.position.set(
            Math.sin(angle) * (boardW / 2 + 0.18),
            yOff,
            Math.cos(angle) * (boardH / 2 + 0.18)
          );
          board.rotation.y = angle;
          post.add(board);
          const boardLabel = this.makeLabel(district.name, "DISTRICT →", district.color, 2.6, 0.68);
          boardLabel.position.copy(board.position);
          boardLabel.position.y += 0.02;
          boardLabel.renderOrder = 24;
          post.add(boardLabel);

          const arrowGeo = new THREE.ConeGeometry(0.22, 0.44, 8);
          const arrow = new THREE.Mesh(arrowGeo, boardMat);
          arrow.rotation.z = -Math.PI / 2;
          arrow.position.set(
            Math.sin(angle) * (boardW + 0.5),
            yOff,
            Math.cos(angle) * 0.08
          );
          arrow.rotation.y = angle;
          post.add(arrow);
        });

        if (x <= 0) {
          const ang = Math.atan2(TIKTOK_ALLEY_X - x, 0 - z);
          const sm = new THREE.MeshStandardMaterial({
            color: 0xff2255, roughness: 0.62, emissive: 0xff2255, emissiveIntensity: 0.22
          });
          const sb = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.72, 0.08), sm);
          sb.position.set(Math.sin(ang) * 1.9, 2.88, Math.cos(ang) * 0.12);
          sb.rotation.y = ang;
          post.add(sb);
          const alleyLabel = this.makeLabel("TIKTOK ALLEY", "← 15 SCREENS", 0xff2255, 3.0, 0.7);
          alleyLabel.position.copy(sb.position);
          alleyLabel.position.y += 0.02;
          alleyLabel.renderOrder = 24;
          post.add(alleyLabel);
        }

        post.position.set(x, 0, z);
        this.scene.add(post);
        this.wayfindingCount += 1;
      });
    }

    makeLimb(material, x, y, z, radius, length) {
      const pivot = new THREE.Group();
      pivot.position.set(x, y, z);
      const mesh = new THREE.Mesh(new THREE.CapsuleGeometry(radius, length, 6, 10), material);
      mesh.position.y = -length * 0.47;
      mesh.castShadow = true;
      pivot.add(mesh);
      return pivot;
    }

    createEnemyFabricTexture(index) {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 128;
      const context = canvas.getContext("2d");
      context.fillStyle = ["#777981", "#675f66", "#66716b", "#625d74"][index % 4];
      context.fillRect(0, 0, 128, 128);
      context.strokeStyle = "rgba(255,255,255,.13)";
      context.lineWidth = 1;
      for (let offset = 0; offset < 128; offset += 5) {
        context.beginPath();
        context.moveTo(offset, 0);
        context.lineTo(offset + 8, 128);
        context.stroke();
        context.beginPath();
        context.moveTo(0, offset);
        context.lineTo(128, offset + 8);
        context.stroke();
      }
      for (let fleck = 0; fleck < 80; fleck += 1) {
        context.fillStyle = `rgba(8,8,12,${rand(0.06, 0.18)})`;
        context.fillRect(rand(0, 128), rand(0, 128), rand(1, 4), rand(1, 4));
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(2, 3);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    }

    createEnemies() {
      this.enemyFabricTextures = [0, 1, 2, 3].map((index) => this.createEnemyFabricTexture(index));
      for (let index = 0; index < ENEMY_COUNT; index += 1) {
        const type = ENEMY_TYPES[index % ENEMY_TYPES.length];
        const enemy = this.makeEnemy(type, index);
        let attempts = 0;
        do {
          const angle = (index / ENEMY_COUNT) * Math.PI * 2 + rand(-0.35, 0.35);
          const radius = 52 + (index % 7) * 9 + rand(-6, 8);
          enemy.group.position.set(
            clamp(Math.cos(angle) * radius + rand(-10, 10), -105, 105),
            0,
            clamp(Math.sin(angle) * radius + rand(-10, 10), -105, 105)
          );
          attempts += 1;
        } while (
          attempts < 80 &&
          this.collidesEnemyWorld(enemy.group.position.x, enemy.group.position.z, 2.5)
        );
        this.scene.add(enemy.group);
        this.enemies.push(enemy);
      }
    }

    makeEnemy(type, index) {
      const group = new THREE.Group();
      const accent = [0xff3f65, 0x9f79ff, 0xffd23f, 0x46f5c0, 0x4cb7ff][index % 5];

      // Less emissive, more physical body material
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: accent,
        map: this.enemyFabricTextures[index % this.enemyFabricTextures.length],
        bumpMap: this.enemyFabricTextures[index % this.enemyFabricTextures.length],
        bumpScale: 0.07,
        emissive: new THREE.Color(accent).multiplyScalar(0.04),
        emissiveIntensity: 0.28,
        roughness: 0.66,
        metalness: 0.12
      });
      const chrome = new THREE.MeshStandardMaterial({ color: 0xbfc4cc, roughness: 0.2, metalness: 0.9 });

      // Varied skin palette
      const skinColors = [0xc89578, 0x8c5f47, 0xd9af91, 0xb07050, 0xe8c4a0, 0x7a5040, 0xf2d0a8, 0xa06848];
      const skinMat = new THREE.MeshStandardMaterial({
        color: skinColors[index % skinColors.length], roughness: 0.78, metalness: 0
      });

      // Layered streetwear — darker, muted clothing
      const clothHues = [0x1c2033, 0x2d1c1c, 0x1a2a1a, 0x2a1a2a, 0x1c1c2a, 0x1a1f2a, 0x2a2218, 0x1c2224];
      const clothColor = clothHues[index % clothHues.length];
      const fabric = this.enemyFabricTextures[index % this.enemyFabricTextures.length];
      const upperBodyMat = new THREE.MeshStandardMaterial({
        color: clothColor, map: fabric, bumpMap: fabric, bumpScale: 0.09, roughness: 0.78, metalness: 0.04
      });
      const pantsClr = new THREE.Color(clothColor).multiplyScalar(0.72);
      const pantsMat = new THREE.MeshStandardMaterial({
        color: pantsClr, map: fabric, bumpMap: fabric, bumpScale: 0.06, roughness: 0.82, metalness: 0.03
      });
      const beltMat = new THREE.MeshStandardMaterial({ color: 0x111116, roughness: 0.5, metalness: 0.44 });
      const shoeMat = new THREE.MeshStandardMaterial({ color: 0x181820, roughness: 0.62, metalness: 0.14 });

      // White eyes / dark pupils (non-emissive)
      const scleraMat = new THREE.MeshStandardMaterial({ color: 0xeeeef8, roughness: 0.18, metalness: 0 });
      const pupilMat = new THREE.MeshBasicMaterial({ color: 0x050508 });

      const parts = { limbs: [] };

      // ─── Two-part LEGS ───────────────────────────────────────────────
      [-0.36, 0.36].forEach((lx, li) => {
        const thighPivot = new THREE.Group();
        thighPivot.position.set(lx, 2.62, 0);
        const thigh = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 1.0, 5, 8), pantsMat);
        thigh.position.y = -0.58;
        thigh.castShadow = true;
        thighPivot.add(thigh);

        const kneePivot = new THREE.Group();
        kneePivot.position.y = -1.14;
        const shin = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 1.0, 5, 8), pantsMat);
        shin.position.y = -0.55;
        shin.castShadow = true;
        kneePivot.add(shin);
        const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.24, 0.86), shoeMat);
        shoe.position.set(0.04, -1.12, 0.15);
        kneePivot.add(shoe);

        thighPivot.add(kneePivot);
        group.add(thighPivot);
        parts.limbs.push({ pivot: thighPivot, lower: kneePivot, direction: li ? -1 : 1, isLeg: true });
      });

      // ─── TORSO (core body) ─────────────────────────────────────────
      const coreTorso = new THREE.Mesh(new THREE.CapsuleGeometry(0.58, 1.45, 7, 12), upperBodyMat);
      coreTorso.position.y = 2.85;
      coreTorso.castShadow = true;
      group.add(coreTorso);

      // Belt
      const belt = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.18, 0.74), beltMat);
      belt.position.set(0, 2.56, 0);
      group.add(belt);

      // Collar
      const collar = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.09, 8, 22), upperBodyMat);
      collar.rotation.x = Math.PI / 2;
      collar.position.set(0, 4.28, 0);
      group.add(collar);
      const jacketZip = new THREE.Mesh(new THREE.BoxGeometry(0.07, 1.3, 0.06), bodyMaterial);
      jacketZip.position.set(0, 3.05, 0.59);
      group.add(jacketZip);
      [-0.34, 0.34].forEach((x) => {
        const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.08, 0.05), bodyMaterial);
        pocket.position.set(x, 2.76, 0.59);
        pocket.rotation.z = x < 0 ? 0.22 : -0.22;
        group.add(pocket);
      });

      // ─── Two-part ARMS ────────────────────────────────────────────
      [-0.88, 0.88].forEach((ax, ai) => {
        // Shoulder sphere
        const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 8), upperBodyMat);
        shoulder.position.set(ax, 3.96, 0);
        group.add(shoulder);

        const upperArmPivot = new THREE.Group();
        upperArmPivot.position.set(ax, 3.84, 0);
        const upperArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 0.76, 5, 8), skinMat);
        upperArm.position.y = -0.46;
        upperArm.rotation.z = ax < 0 ? 0.06 : -0.06;
        upperArm.castShadow = true;
        upperArmPivot.add(upperArm);

        const elbowPivot = new THREE.Group();
        elbowPivot.position.y = -0.94;
        const forearm = new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 0.68, 5, 8), skinMat);
        forearm.position.y = -0.38;
        forearm.castShadow = true;
        elbowPivot.add(forearm);
        const hand = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), skinMat);
        hand.scale.set(1.0, 0.72, 0.82);
        hand.position.y = -0.78;
        elbowPivot.add(hand);

        upperArmPivot.add(elbowPivot);
        group.add(upperArmPivot);
        parts.limbs.push({ pivot: upperArmPivot, lower: elbowPivot, direction: -(ai * 2 - 1), isArm: true });
      });

      // ─── HEAD GROUP (for head-bob) ────────────────────────────────
      const headBaseY = 4.72;
      const headGroup = new THREE.Group();
      headGroup.position.y = headBaseY;
      group.add(headGroup);

      // Neck
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.21, 0.44, 10), skinMat);
      neck.position.set(0, -0.22, 0);
      headGroup.add(neck);

      // Type-specific body props go BEFORE human head on shared enemies
      if (type === "BUM MAN") {
        const coat = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.9, 1.25), upperBodyMat);
        coat.position.y = 2.25 - headBaseY;
        headGroup.add(coat);
        [-0.62, 0.62].forEach((x) => {
          const cheek = new THREE.Mesh(new THREE.SphereGeometry(0.8, 18, 14), bodyMaterial);
          cheek.position.set(x, 1.55 - headBaseY, -0.62);
          cheek.castShadow = true;
          headGroup.add(cheek);
        });
      } else if (type === "WEAKIE WALLY") {
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.58, 4.4, 12), bodyMaterial);
        body.position.set(0, 3.1 - headBaseY, 0);
        headGroup.add(body);
        const wallHead = new THREE.Mesh(new THREE.BoxGeometry(1.35, 1.15, 0.8), chrome);
        wallHead.position.set(0, 5.65 - headBaseY, 0);
        headGroup.add(wallHead);
      } else if (type === "WET EGG") {
        const egg = new THREE.Mesh(new THREE.SphereGeometry(1.25, 24, 18), bodyMaterial);
        egg.scale.y = 1.5;
        egg.position.set(0, 2.7 - headBaseY, 0);
        headGroup.add(egg);
      } else if (type === "LAMP LAD") {
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.5, 3.5, 12), chrome);
        stem.position.set(0, 2.4 - headBaseY, 0);
        headGroup.add(stem);
        const shade = new THREE.Mesh(new THREE.ConeGeometry(1.35, 1.8, 20, 1, true), bodyMaterial);
        shade.position.set(0, 4.8 - headBaseY, 0);
        headGroup.add(shade);
        const bulb = new THREE.PointLight(accent, 5, 9, 2);
        bulb.position.set(0, 4.4 - headBaseY, 0);
        headGroup.add(bulb);
      } else if (type === "BIN GOBLIN") {
        const bin = new THREE.Mesh(new THREE.BoxGeometry(2.3, 3.4, 2), upperBodyMat);
        bin.position.set(0, 2.4 - headBaseY, 0);
        headGroup.add(bin);
        const lid = new THREE.Mesh(new THREE.BoxGeometry(2.65, 0.3, 2.25), bodyMaterial);
        lid.position.set(0, 4.15 - headBaseY, -0.2);
        lid.rotation.x = -0.22;
        headGroup.add(lid);
      } else if (type === "SOFA STEVE") {
        const seat = new THREE.Mesh(new THREE.BoxGeometry(3.3, 1.35, 1.8), bodyMaterial);
        seat.position.set(0, 1.65 - headBaseY, 0);
        headGroup.add(seat);
        const back = new THREE.Mesh(new THREE.BoxGeometry(3.3, 1.9, 0.7), upperBodyMat);
        back.position.set(0, 2.75 - headBaseY, -0.72);
        headGroup.add(back);
        [-1.15, 1.15].forEach((x) => {
          const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.15, 8, 16), chrome);
          wheel.position.set(x, 0.65 - headBaseY, 0);
          wheel.rotation.y = Math.PI / 2;
          headGroup.add(wheel);
        });
      } else if (type === "TRAFFIC TONY") {
        const cone = new THREE.Mesh(new THREE.ConeGeometry(1.35, 4.3, 20), bodyMaterial);
        cone.position.set(0, 2.5 - headBaseY, 0);
        headGroup.add(cone);
        const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.98, 0.42, 20), chrome);
        stripe.position.set(0, 2.3 - headBaseY, 0);
        headGroup.add(stripe);
      } else if (type === "PLUG HEAD PETE") {
        const body = new THREE.Mesh(new THREE.BoxGeometry(2.1, 2.8, 1.45), bodyMaterial);
        body.position.set(0, 2.2 - headBaseY, 0);
        headGroup.add(body);
        [-0.45, 0.45].forEach((x) => {
          const prong = new THREE.Mesh(new THREE.BoxGeometry(0.28, 1.4, 0.38), chrome);
          prong.position.set(x, 4.35 - headBaseY, 0);
          headGroup.add(prong);
        });
      } else if (type === "CABBAGE FACE") {
        const cabbage = new THREE.Mesh(new THREE.DodecahedronGeometry(1.7, 1), bodyMaterial);
        cabbage.position.set(0, 3 - headBaseY, 0);
        headGroup.add(cabbage);
      } else {
        // MICROWAVE MIKE
        const microwave = new THREE.Mesh(new THREE.BoxGeometry(2.7, 2.3, 1.65), upperBodyMat);
        microwave.position.set(0, 2.4 - headBaseY, 0);
        headGroup.add(microwave);
        const mwScreen = new THREE.Mesh(
          new THREE.PlaneGeometry(1.75, 1.15),
          new THREE.MeshBasicMaterial({ color: accent })
        );
        mwScreen.position.set(-0.25, 2.48 - headBaseY, 0.84);
        headGroup.add(mwScreen);
      }

      // Human head (all except WEAKIE WALLY)
      if (type !== "WEAKIE WALLY") {
        const humanHead = new THREE.Mesh(new THREE.SphereGeometry(0.68, 22, 16), skinMat);
        humanHead.scale.y = 1.08;
        humanHead.castShadow = true;
        headGroup.add(humanHead);
        [-0.69, 0.69].forEach((x) => {
          const ear = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8), skinMat);
          ear.scale.set(0.55, 1, 0.58);
          ear.position.set(x, -0.02, 0);
          headGroup.add(ear);
        });
        const headwear = new THREE.Mesh(
          new THREE.SphereGeometry(0.71, 18, 10, 0, Math.PI * 2, 0, Math.PI * 0.52),
          index % 2 ? upperBodyMat : bodyMaterial
        );
        headwear.scale.y = 0.72;
        headwear.position.y = 0.48;
        headGroup.add(headwear);

        const eyeY = type === "BUM MAN" ? 0.08 : 0.06;
        const eyeCount = type === "BUM MAN" ? 1 : 2;
        for (let e = 0; e < eyeCount; e += 1) {
          const ex = (e - (eyeCount - 1) / 2) * 0.46;
          const white = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 8), scleraMat);
          white.position.set(ex, eyeY, 0.58);
          headGroup.add(white);
          const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.072, 10, 7), pupilMat);
          pupil.position.set(ex, eyeY, 0.67);
          headGroup.add(pupil);
          // Brow
          const brow = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.09, 0.05), pupilMat);
          brow.position.set(ex, eyeY + 0.24, 0.62);
          brow.rotation.z = ex < 0 ? 0.18 : -0.18;
          headGroup.add(brow);
        }

        // Nose
        const nose = new THREE.Mesh(new THREE.SphereGeometry(0.072, 8, 6), skinMat);
        nose.scale.set(0.85, 0.82, 0.6);
        nose.position.set(0, eyeY - 0.34, 0.66);
        headGroup.add(nose);

        // Mouth
        const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.09, 0.06), pupilMat);
        mouth.position.set(0, eyeY - 0.58, 0.63);
        headGroup.add(mouth);
      }

      const renderMeshes = [];
      const detailMeshes = [];
      group.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = false;
          child.receiveShadow = true;
          child.geometry.computeBoundingSphere();
          renderMeshes.push(child);
          if ((child.geometry.boundingSphere?.radius || 1) < 0.34) detailMeshes.push(child);
        }
      });
      const distanceProxy = new THREE.Mesh(
        new THREE.CapsuleGeometry(type === "WEAKIE WALLY" ? 0.48 : 0.72, type === "WEAKIE WALLY" ? 3.8 : 2.9, 4, 7),
        bodyMaterial
      );
      distanceProxy.position.y = type === "WEAKIE WALLY" ? 3.25 : 2.7;
      distanceProxy.visible = false;
      group.add(distanceProxy);

      const boss = type === "BUM MAN" || type === "WEAKIE WALLY";
      const health = boss ? 5 : index % 7 === 0 ? 3 : 2;
      const enemy = {
        group,
        type,
        name: SILLY_NAMES[index],
        accent,
        index,
        limbs: parts.limbs,
        headGroup,
        headBaseY,
        health,
        maxHealth: health,
        speed: boss ? 2.4 : rand(2.6, 4.2),
        radius: type === "SOFA STEVE" ? 2.3 : 1.65,
        phase: rand(0, Math.PI * 2),
        wanderAngle: rand(0, Math.PI * 2),
        wanderTimer: rand(1, 4),
        hitFlash: 0,
        recoil: 0,
        gaitScale: 0.88 + (index % 5) * 0.06,
        renderMeshes,
        detailMeshes,
        distanceProxy,
        usingProxy: false,
        detailsVisible: true,
        healthVisibleUntil: 0,
        dead: false,
        boss
      };
      enemy.label = this.makeEnemyHealthLabel(enemy);
      enemy.label.position.y = type === "WEAKIE WALLY" ? 7.1 : 5.8;
      enemy.label.visible = false;
      group.add(enemy.label);
      return enemy;
    }

    createEnemyHealthTexture(enemy) {
      const canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 160;
      const context = canvas.getContext("2d");
      context.fillStyle = "rgba(5,5,7,.92)";
      context.beginPath();
      context.roundRect(4, 4, 632, 152, 18);
      context.fill();
      const accent = `#${enemy.accent.toString(16).padStart(6, "0")}`;
      context.strokeStyle = accent;
      context.lineWidth = 7;
      context.stroke();
      context.fillStyle = "#fff";
      const { size: nameSize } = fitCanvasText(context, enemy.name, 592, 48, 900, 24);
      context.font = `900 ${nameSize}px ${LABEL_FONT_FAMILY}`;
      context.textAlign = "left";
      context.fillText(enemy.name, 24, 58);
      context.fillStyle = "#9ba0aa";
      const { size: typeSize } = fitCanvasText(context, enemy.type, 590, 22, 800, 14);
      context.font = `800 ${typeSize}px ${LABEL_FONT_FAMILY}`;
      context.fillText(enemy.type, 26, 91);
      context.fillStyle = "#25252b";
      context.fillRect(24, 111, 592, 25);
      context.fillStyle = enemy.health / enemy.maxHealth > 0.4 ? accent : "#e21c3d";
      context.fillRect(24, 111, 592 * (enemy.health / enemy.maxHealth), 25);
      context.strokeStyle = "rgba(255,255,255,.45)";
      context.lineWidth = 2;
      context.strokeRect(24, 111, 592, 25);
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    }

    makeEnemyHealthLabel(enemy) {
      const material = new THREE.SpriteMaterial({
        map: this.createEnemyHealthTexture(enemy),
        transparent: true,
        depthTest: true,
        depthWrite: false
      });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(enemy.boss ? 5.5 : 4.6, enemy.boss ? 1.38 : 1.15, 1);
      sprite.renderOrder = 20;
      return sprite;
    }

    refreshEnemyHealthLabel(enemy) {
      const previous = enemy.label.material.map;
      enemy.label.material.map = this.createEnemyHealthTexture(enemy);
      enemy.label.material.needsUpdate = true;
      previous?.dispose();
    }

    makeLabel(text, subtext, color, width, height) {
      this.labelFitCount += 1;
      const texture = roundedCanvasTexture(text, {
        accent: `#${color.toString(16).padStart(6, "0")}`,
        subtext
      });
      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
        depthWrite: false
      });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(width, height, 1);
      sprite.renderOrder = 20;
      return sprite;
    }

    bindInput() {
      this.onPointerDown = (event) => {
        this.activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
        this.pointer.dragging = true;
        this.pointer.x = event.clientX;
        this.pointer.y = event.clientY;
        this.pointer.startX = event.clientX;
        this.pointer.startY = event.clientY;
        this.pointer.moved = false;
        if (this.activePointers.size === 2) {
          this.pointer.moved = true;
          const [first, second] = [...this.activePointers.values()];
          this.pointer.pinchDistance = Math.hypot(first.x - second.x, first.y - second.y);
          this.pointer.pinchX = (first.x + second.x) / 2;
          this.pointer.pinchY = (first.y + second.y) / 2;
        }
        this.renderer.domElement.setPointerCapture?.(event.pointerId);
      };
      this.onPointerMove = (event) => {
        if (!this.pointer.dragging || this.paused || !this.activePointers.has(event.pointerId)) return;
        this.activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
        if (this.activePointers.size >= 2) {
          this.pointer.moved = true;
          const [first, second] = [...this.activePointers.values()];
          const distance = Math.hypot(first.x - second.x, first.y - second.y);
          const midpointX = (first.x + second.x) / 2;
          const midpointY = (first.y + second.y) / 2;
          if (this.pointer.pinchDistance) {
            this.cameraDistance = clamp(
              this.cameraDistance - (distance - this.pointer.pinchDistance) * 0.025,
              7,
              24
            );
            this.yaw += (midpointX - this.pointer.pinchX) * 0.004;
            this.pitch = clamp(this.pitch - (midpointY - this.pointer.pinchY) * 0.003, -0.58, 0.24);
          }
          this.pointer.pinchDistance = distance;
          this.pointer.pinchX = midpointX;
          this.pointer.pinchY = midpointY;
          return;
        }
        const deltaX = event.clientX - this.pointer.x;
        const deltaY = event.clientY - this.pointer.y;
        if (
          Math.hypot(
            event.clientX - this.pointer.startX,
            event.clientY - this.pointer.startY
          ) > 8
        ) {
          this.pointer.moved = true;
        }
        this.pointer.x = event.clientX;
        this.pointer.y = event.clientY;
        this.yaw += deltaX * 0.006;
        this.pitch = clamp(this.pitch - deltaY * 0.004, -0.58, 0.24);
      };
      this.onPointerCancel = (event) => {
        this.pointer.moved = true;
        this.activePointers.delete(event.pointerId);
        this.pointer.dragging = this.activePointers.size > 0;
        this.pointer.pinchDistance = 0;
        this.renderer.domElement.releasePointerCapture?.(event.pointerId);
      };
      this.onPointerUp = (event) => {
        const shouldOpenMedia = this.activePointers.size === 1 && !this.pointer.moved;
        this.activePointers.delete(event.pointerId);
        this.pointer.dragging = this.activePointers.size > 0;
        this.pointer.pinchDistance = 0;
        if (this.activePointers.size === 1) {
          const [remaining] = this.activePointers.values();
          this.pointer.x = remaining.x;
          this.pointer.y = remaining.y;
        }
        this.renderer.domElement.releasePointerCapture?.(event.pointerId);
        if (shouldOpenMedia) this.openClickableMedia(event);
      };
      this.onWheel = (event) => {
        event.preventDefault();
        this.cameraDistance = clamp(this.cameraDistance + Math.sign(event.deltaY), 7, 24);
      };
      this.renderer.domElement.addEventListener("pointerdown", this.onPointerDown);
      this.renderer.domElement.addEventListener("pointermove", this.onPointerMove);
      this.renderer.domElement.addEventListener("pointerup", this.onPointerUp);
      this.renderer.domElement.addEventListener("pointercancel", this.onPointerCancel);
      this.renderer.domElement.addEventListener("wheel", this.onWheel, { passive: false });
    }

    openClickableMedia(event) {
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.pointerNdc.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );
      this.raycaster.setFromCamera(this.pointerNdc, this.camera);
      const intersections = this.raycaster.intersectObjects(this.clickableMediaScreens, false);
      const target = intersections[0]?.object;
      const url = target?.userData?.externalUrl;
      return this.openExternalMediaUrl(url, target?.userData?.mediaLabel);
    }

    openExternalMediaUrl(url, label = "TIKTOK") {
      if (!url) return false;
      window.open(url, "_blank", "noopener,noreferrer");
      this.options.onMediaSignal?.(
        `${label || "TIKTOK"} · OPENED`,
        0,
        1
      );
      return true;
    }

    animate() {
      if (this.destroyed) return;
      this.frameId = requestAnimationFrame(this.animate);
      const delta = Math.min(this.clock.getDelta(), 0.033);
      this.elapsed += delta;
      if (!this.paused) {
        this.updateDecor(delta);
        if (performance.now() >= this.readyAt && !this.celebrating) this.updateGame(delta);
        if (this.celebrating) this.updateCelebration(delta);
      }
      this.updateCamera(delta);
      this.updateMinimap();
      this.renderer.render(this.scene, this.camera);
    }

    updateGame(delta) {
      this.fireCooldown = Math.max(0, this.fireCooldown - delta);
      this.hitCooldown = Math.max(0, this.hitCooldown - delta);
      this.dashCooldown = Math.max(0, this.dashCooldown - delta);
      this.updatePlayer(delta);
      this.updateEnemies(delta);
      if (this.paused) return;
      this.updateBullets(delta);
      this.updateCoins(delta);
      this.updateTarget();
      this.updateDistrict();
      this.updateProximityAudio(delta);
      this.updateBillboardSwivel();
    }

    updatePlayer(delta) {
      const move = this.temp.a.set(0, 0, 0);
      const forward = this.temp.b.set(Math.sin(this.yaw), 0, Math.cos(this.yaw));
      const right = this.temp.c.set(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
      if (this.controls.down.has("left")) this.yaw += delta * 1.9;
      if (this.controls.down.has("right")) this.yaw -= delta * 1.9;
      forward.set(Math.sin(this.yaw), 0, Math.cos(this.yaw));
      right.set(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
      if (this.controls.down.has("up")) move.add(forward);
      if (this.controls.down.has("down")) move.sub(forward);
      if (this.controls.down.has("q")) move.sub(right);
      if (this.controls.down.has("e")) move.add(right);

      let speed = 12.5;
      let dashing = false;
      if (this.controls.down.has("secondary") && this.dashCooldown <= 0) {
        speed = 28;
        this.dashPoseUntil = this.elapsed + 0.34;
        this.dashCooldown = 0.75;
        this.spawnBurst(this.player.position, 0x8d6cff, 24);
      }
      dashing = this.elapsed < this.dashPoseUntil;

      const moving = move.lengthSq() > 0;
      if (moving) {
        move.normalize();
        const nextX = clamp(this.player.position.x + move.x * speed * delta, -HALF_WORLD, HALF_WORLD);
        const nextZ = clamp(this.player.position.z + move.z * speed * delta, -HALF_WORLD, HALF_WORLD);
        if (!this.collidesWorld(nextX, this.player.position.z, 2.1)) this.player.position.x = nextX;
        if (!this.collidesWorld(this.player.position.x, nextZ, 2.1)) this.player.position.z = nextZ;
      }
      this.player.rotation.y = this.yaw;
      this.resolvePlayerPenetration();

      const turning = this.controls.down.has("left") ? 1 : this.controls.down.has("right") ? -1 : 0;
      const gaitRate = moving ? (speed > 20 ? 14 : 10.5) : 2.1;
      const cycle = Math.sin(this.elapsed * gaitRate);
      const motionScale = this.reducedMotion ? 0.28 : 1;
      const stride = moving ? cycle * (speed > 20 ? 0.7 : 0.5) * motionScale : cycle * 0.025 * motionScale;
      this.horseLegs.forEach((leg) => {
        const legCycle = Math.sin(this.elapsed * gaitRate + leg.phase);
        leg.upperPivot.rotation.x = moving ? legCycle * 0.58 * motionScale : 0;
        leg.knee.rotation.x = moving ? Math.max(0, -legCycle) * 0.62 * motionScale : 0;
      });
      this.horseHead.rotation.x = moving ? -Math.abs(cycle) * 0.08 * motionScale : Math.sin(this.elapsed * 1.3) * 0.025 * motionScale;
      this.horseNeck.rotation.z = turning * 0.08 * motionScale;
      this.horseTail.rotation.x = -0.24 + (moving ? cycle * 0.16 : Math.sin(this.elapsed * 1.7) * 0.06) * motionScale;
      this.rider.position.y = 1.28 + (moving ? Math.abs(cycle) * 0.08 : Math.sin(this.elapsed * 1.8) * 0.018) * motionScale;
      this.rider.rotation.z = -turning * 0.1 * motionScale;
      this.riderTorso.rotation.x = moving ? -0.04 - (dashing ? 0.13 : 0) * motionScale : 0;
      this.playerLimbs.leftLeg.rotation.x = -0.1 + stride * 0.1;
      this.playerLimbs.rightLeg.rotation.x = -0.1 - stride * 0.1;
      this.playerLimbs.leftArm.rotation.x = -0.72 - stride * 0.12;
      this.playerLimbs.rightArm.rotation.x = -0.62 + stride * 0.08 - (this.controls.down.has("action") ? 0.22 : 0);
      this.updateReins();
      this.player.position.y = moving ? Math.abs(cycle) * 0.035 * motionScale : 0;

      if (this.controls.down.has("action") && this.fireCooldown <= 0) this.fire();
    }

    resolvePlayerPenetration() {
      const playerRadius = 2.1;
      this.obstacles.forEach((obstacle) => {
        const dx = this.player.position.x - obstacle.x;
        const dz = this.player.position.z - obstacle.z;
        const distance = Math.hypot(dx, dz);
        const minimum = playerRadius + obstacle.radius;
        if (distance >= minimum) return;
        const safeDistance = distance || 0.001;
        this.player.position.x = obstacle.x + (dx / safeDistance) * minimum;
        this.player.position.z = obstacle.z + (dz / safeDistance) * minimum;
      });
      this.player.position.x = clamp(this.player.position.x, -HALF_WORLD, HALF_WORLD);
      this.player.position.z = clamp(this.player.position.z, -HALF_WORLD, HALF_WORLD);
    }

    updateCoins(delta) {
      this.coins.forEach((coin) => {
        if (coin.collected) return;
        coin.group.rotation.y += delta * 2.7;
        coin.group.position.y = coin.baseY + Math.sin(this.elapsed * 3 + coin.phase) * 0.24;
        if (coin.group.position.distanceToSquared(this.player.position) < 5.3) {
          coin.collected = true;
          coin.group.visible = false;
          this.coinCount += 1;
          this.health = Math.min(100, this.health + 5);
          this.options.sound?.collect?.();
          this.options.onHealth?.(this.health);
          this.options.onCoin?.(this.coinCount, this.coins.length, this.health);
          this.spawnBurst(coin.group.position, 0xffd24a, 24);
        }
      });
    }

    fire() {
      this.fireCooldown = 0.14;
      this.options.sound?.fire?.();
      const muzzle = new THREE.Vector3(0.84, 2.85, 2.75);
      this.rider.localToWorld(muzzle);

      const direction = new THREE.Vector3(0, 0, 1).applyQuaternion(this.player.quaternion).normalize();
      const target = this.currentTarget;
      if (target && !target.dead) {
        const targetPoint = target.group.position.clone().add(new THREE.Vector3(0, 2.6, 0));
        direction.copy(targetPoint.sub(muzzle).normalize());
      }

      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 10, 8),
        new THREE.MeshBasicMaterial({ color: 0xff3355 })
      );
      glow.position.copy(muzzle);
      this.scene.add(glow);
      this.bullets.push({
        mesh: glow,
        velocity: direction.multiplyScalar(58),
        life: 2.2,
        trailTimer: 0
      });
      this.muzzleLight.intensity = 28;
      this.gun.position.z = 0.2;
      window.setTimeout(() => {
        if (!this.destroyed) {
          this.muzzleLight.intensity = 0;
          this.gun.position.z = 0.48;
        }
      }, 55);
    }

    updateBullets(delta) {
      this.bullets.forEach((bullet) => {
        bullet.life -= delta;
        bullet.mesh.position.addScaledVector(bullet.velocity, delta);
        bullet.trailTimer -= delta;
        if (bullet.trailTimer <= 0 && !this.reducedMotion) {
          bullet.trailTimer = 0.035;
          const spark = new THREE.Mesh(
            new THREE.SphereGeometry(0.07, 6, 4),
            new THREE.MeshBasicMaterial({ color: 0xff7390, transparent: true, opacity: 0.65 })
          );
          spark.position.copy(bullet.mesh.position);
          this.scene.add(spark);
          this.particles.push({ mesh: spark, velocity: new THREE.Vector3(0, 0.4, 0), life: 0.22, maxLife: 0.22 });
        }
        for (const enemy of this.enemies) {
          if (enemy.dead) continue;
          const target = enemy.group.position.clone().add(new THREE.Vector3(0, 2.4, 0));
          if (bullet.mesh.position.distanceToSquared(target) < enemy.radius * enemy.radius) {
            bullet.life = 0;
            this.hitEnemy(enemy, bullet.mesh.position);
            break;
          }
        }
      });
      this.bullets = this.bullets.filter((bullet) => {
        if (bullet.life <= 0) {
          this.scene.remove(bullet.mesh);
          bullet.mesh.geometry.dispose();
          bullet.mesh.material.dispose();
          return false;
        }
        return true;
      });
      this.updateParticles(delta);
    }

    finishCelebration() {
      this.celebrationPhase = "complete";
      this.celebrationProgress = 1;
      this.player.position.copy(this.celebrationPlayerPos);
      this.player.rotation.y = this.celebrationPlayerRotation;
      if (this.horseNeck) this.horseNeck.rotation.x = 0;
      if (this.horseHead) this.horseHead.rotation.x = 0;
      if (this.horseTail) this.horseTail.rotation.x = -0.24;
      if (this.rider) this.rider.rotation.x = 0;
      this.horseLegs?.forEach((leg) => {
        if (leg.front) leg.upperPivot.rotation.x = 0;
      });
    }

    hitEnemy(enemy, point) {
      enemy.health -= 1;
      enemy.hitFlash = 0.15;
      enemy.recoil = 1;
      enemy.healthVisibleUntil = this.elapsed + 3.2;
      this.refreshEnemyHealthLabel(enemy);
      enemy.label.visible = true;
      this.options.sound?.hit?.();
      this.spawnBurst(point, enemy.boss ? 0xffd23f : 0xff315d, enemy.boss ? 34 : 18);
      enemy.group.scale.setScalar(1.18);
      if (enemy.health <= 0) this.defeatEnemy(enemy);
    }

    defeatEnemy(enemy) {
      enemy.dead = true;
      this.kills += 1;
      const phrase = this.showKillSpeech();
      this.options.sound?.collect?.();
      this.options.onProgress?.(this.kills, WIN_TARGET, enemy.name, phrase);
      this.spawnBurst(enemy.group.position.clone().add(new THREE.Vector3(0, 2, 0)), 0xffffff, enemy.boss ? 70 : 42);
      enemy.group.visible = false;
      if (this.kills >= WIN_TARGET && !this.worldComplete) {
        this.worldComplete = true;
        this.celebrate();
        this.completionTimer = window.setTimeout(() => {
          this.completionTimer = null;
          if (!this.destroyed) {
            this.finishCelebration();
            this.options.onComplete?.();
          }
        }, this.reducedMotion ? 800 : 3600);
      }
    }

    refreshEnemyLod() {
      const ranked = this.enemies
        .filter((enemy) => !enemy.dead)
        .map((enemy) => ({
          enemy,
          distance: enemy.group.position.distanceToSquared(this.player.position)
        }))
        .sort((left, right) => left.distance - right.distance);
      const mobile = Math.min(innerWidth, innerHeight) < 700;
      const fullLimit = mobile ? 8 : 14;
      const faceLimit = mobile ? 3 : 7;
      this.fullDetailEnemies = new Set(ranked.slice(0, fullLimit).map((item) => item.enemy));
      this.faceDetailEnemies = new Set(ranked.slice(0, faceLimit).map((item) => item.enemy));
    }

    updateEnemies(delta) {
      this.enemyLodTimer -= delta;
      if (this.enemyLodTimer <= 0) {
        this.enemyLodTimer = 0.3;
        this.refreshEnemyLod();
      }
      for (const enemy of this.enemies) {
        if (enemy.dead) continue;
        enemy.phase += delta * 3.2;
        enemy.hitFlash = Math.max(0, enemy.hitFlash - delta);
        enemy.recoil = Math.max(0, enemy.recoil - delta * 5.5);
        const distance = enemy.group.position.distanceTo(this.player.position);
        const useProxy = !this.fullDetailEnemies.has(enemy);
        const showDetails = !useProxy && this.faceDetailEnemies.has(enemy);
        if (useProxy !== enemy.usingProxy) {
          enemy.renderMeshes.forEach((mesh) => { mesh.visible = !useProxy; });
          enemy.distanceProxy.visible = useProxy;
          enemy.usingProxy = useProxy;
        }
        if (!useProxy && showDetails !== enemy.detailsVisible) {
          enemy.detailMeshes.forEach((mesh) => { mesh.visible = showDetails; });
          enemy.detailsVisible = showDetails;
        }
        const direction = this.temp.a.copy(this.player.position).sub(enemy.group.position);
        direction.y = 0;

        if (distance < 52) {
          direction.normalize();
          const nextX = enemy.group.position.x + direction.x * enemy.speed * delta;
          const nextZ = enemy.group.position.z + direction.z * enemy.speed * delta;
          if (!this.collidesEnemyWorld(nextX, enemy.group.position.z, enemy.radius)) enemy.group.position.x = nextX;
          if (!this.collidesEnemyWorld(enemy.group.position.x, nextZ, enemy.radius)) enemy.group.position.z = nextZ;
          enemy.group.rotation.y = Math.atan2(direction.x, direction.z);
        } else {
          enemy.wanderTimer -= delta;
          if (enemy.wanderTimer <= 0) {
            enemy.wanderTimer = rand(1.5, 4);
            enemy.wanderAngle += rand(-1.4, 1.4);
          }
          const wanderX = Math.sin(enemy.wanderAngle);
          const wanderZ = Math.cos(enemy.wanderAngle);
          const nextX = clamp(
            enemy.group.position.x + wanderX * enemy.speed * 0.28 * delta,
            -HALF_WORLD,
            HALF_WORLD
          );
          const nextZ = clamp(
            enemy.group.position.z + wanderZ * enemy.speed * 0.28 * delta,
            -HALF_WORLD,
            HALF_WORLD
          );
          if (!this.collidesEnemyWorld(nextX, enemy.group.position.z, enemy.radius)) {
            enemy.group.position.x = nextX;
          }
          if (!this.collidesEnemyWorld(enemy.group.position.x, nextZ, enemy.radius)) {
            enemy.group.position.z = nextZ;
          }
          enemy.group.rotation.y = enemy.wanderAngle;
        }

        if (!useProxy) {
          const swing = Math.sin(enemy.phase) * 0.58 * enemy.gaitScale;
          enemy.limbs.forEach(({ pivot, lower, direction, isLeg, isArm }) => {
            pivot.rotation.x = swing * direction * (isLeg ? 1.0 : 0.62);
            if (lower) {
              if (isLeg) lower.rotation.x = Math.max(0, -pivot.rotation.x) * 0.65;
              else if (isArm) lower.rotation.x = Math.abs(pivot.rotation.x) * 0.32;
            }
          });
          if (enemy.headGroup) {
            const bobAmt = distance < 52 ? 0.04 : 0.016;
            enemy.headGroup.position.y = enemy.headBaseY + Math.abs(Math.sin(enemy.phase * 0.5)) * bobAmt;
            enemy.headGroup.rotation.x = -enemy.recoil * 0.22;
          }
        }
        enemy.group.position.y = Math.abs(Math.sin(enemy.phase * 0.5)) * 0.08;
        enemy.group.rotation.z = Math.sin(enemy.phase * 0.5) * 0.018 - enemy.recoil * 0.09;
        enemy.group.scale.lerp(
          this.temp.b.setScalar(enemy.hitFlash > 0 ? 1.14 : 1),
          1 - Math.pow(0.0001, delta)
        );

        if (distance < enemy.radius + 1.4 && this.hitCooldown <= 0) {
          this.hitCooldown = 0.85;
          this.damagePlayer(enemy.boss ? 18 : 10);
          const push = this.player.position.clone().sub(enemy.group.position).setY(0).normalize();
          this.player.position.addScaledVector(push, 3.4);
        }
      }
    }

    damagePlayer(amount) {
      if (this.health <= 0 || performance.now() < this.damageGraceUntil) return;
      this.health = Math.max(0, this.health - amount);
      this.options.onHealth?.(this.health);
      this.options.sound?.hit?.();
      this.renderer.domElement.animate?.(
        [{ filter: "brightness(1) saturate(1)" }, { filter: "brightness(1.7) saturate(2)" }, { filter: "brightness(1) saturate(1)" }],
        { duration: 220 }
      );
      if (this.health <= 0) {
        this.paused = true;
        this.options.onFail?.("The surreal mob folded BOYO.");
      }
    }

    updateTarget() {
      let nearest = null;
      let bestScore = Infinity;
      const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(this.player.quaternion);
      for (const enemy of this.enemies) {
        if (enemy.dead) continue;
        const toEnemy = enemy.group.position.clone().sub(this.player.position);
        const distance = toEnemy.length();
        if (distance > 68) continue;
        toEnemy.normalize();
        const alignment = forward.dot(toEnemy);
        const score = distance - alignment * 26;
        if (alignment > -0.18 && score < bestScore) {
          bestScore = score;
          nearest = enemy;
        }
      }
      this.currentTarget = nearest;
      this.enemies.forEach((enemy) => {
        if (enemy.dead) return;
        const distance = enemy.group.position.distanceTo(this.player.position);
        enemy.label.visible =
          enemy === nearest ||
          this.elapsed < enemy.healthVisibleUntil ||
          (enemy.boss && distance < 24);
      });
      this.options.onTarget?.(
        nearest ? `${nearest.name} · HP ${nearest.health}/${nearest.maxHealth}` : "NO TARGET — TURN OR MOVE"
      );
    }

    updateDistrict() {
      let nearest = DISTRICTS[0];
      let best = Infinity;
      DISTRICTS.forEach((district) => {
        const dx = this.player.position.x - district.x;
        const dz = this.player.position.z - district.z;
        const distance = dx * dx + dz * dz;
        if (distance < best) {
          best = distance;
          nearest = district;
        }
      });
      if (nearest.name !== this.currentDistrict) {
        this.currentDistrict = nearest.name;
        this.options.onDistrict?.(nearest.name);
      }
    }

    updateCamera(delta) {
      if (!this.player) return;
      // Celebration owns the camera for every phase.
      if (this.celebrating) {
        const elapsed = (performance.now() - this.celebrationStartedAt) / 1000;
        const focus = this.temp.a.copy(this.celebrationPlayerPos).add(new THREE.Vector3(0, 4.5, 0));
        if (this.reducedMotion) {
          this.camera.position.set(
            this.celebrationPlayerPos.x + 12,
            this.celebrationPlayerPos.y + 8,
            this.celebrationPlayerPos.z + 15
          );
          this.camera.lookAt(focus);
          return;
        }
        if (elapsed < 0.8) {
          const t = clamp(elapsed / 0.8, 0, 1);
          this.camera.position.set(
            this.celebrationPlayerPos.x + 15 - t * 2,
            this.celebrationPlayerPos.y + 8 + t * 2,
            this.celebrationPlayerPos.z + 16 - t * 2
          );
          this.camera.lookAt(focus);
          return;
        }
        if (elapsed < 3.2) {
          const orbitRadius = 20;
          const orbitAngle = ((elapsed - 0.8) / 2.4) * Math.PI * 2 + Math.PI;
          const orbitX = this.celebrationPlayerPos.x + Math.sin(orbitAngle) * orbitRadius;
          const orbitZ = this.celebrationPlayerPos.z + Math.cos(orbitAngle) * orbitRadius;
          const orbitY = this.celebrationPlayerPos.y + 9 + Math.sin(elapsed * 1.5) * 2;
          this.camera.position.set(orbitX, orbitY, orbitZ);
          this.camera.lookAt(
            this.celebrationPlayerPos.x,
            this.celebrationPlayerPos.y + 4,
            this.celebrationPlayerPos.z
          );
          return;
        }
        if (elapsed < 3.6) {
          const t = clamp((elapsed - 3.2) / 0.4, 0, 1);
          const radius = 20 - t * 14;
          this.camera.position.set(
            this.celebrationPlayerPos.x,
            this.celebrationPlayerPos.y + 9 - t * 2,
            this.celebrationPlayerPos.z - radius
          );
          this.camera.lookAt(focus.x, focus.y + t * 1.5, focus.z);
          return;
        }
      }
      const target = this.player.position.clone().add(new THREE.Vector3(0, 4.25, 0));
      const horizontal = Math.cos(this.pitch) * this.cameraDistance;
      const followPos = new THREE.Vector3(
        target.x - Math.sin(this.yaw) * horizontal,
        target.y + 3.2 + Math.sin(-this.pitch) * this.cameraDistance,
        target.z - Math.cos(this.yaw) * horizontal
      );

      if (!this.introComplete) {
        const rawT = this.introDuration > 0
          ? clamp((performance.now() - this.introStartedAt) / (this.introDuration * 1000), 0, 1)
          : 1;
        this.introProgress = rawT;
        this.introElapsed = rawT * this.introDuration;
        // Cubic ease-in-out
        const t = rawT < 0.5 ? 4 * rawT * rawT * rawT : 1 - Math.pow(-2 * rawT + 2, 3) / 2;
        if (rawT >= 1) { this.introComplete = true; }
        // Intro: elevated wide view sweeping down to follow position
        const introX = followPos.x * t;
        const introY = 14 + (followPos.y - 14) * t;
        const introZ = -42 + (followPos.z + 42) * t;
        this.camera.position.set(introX, introY, introZ);
        this.camera.lookAt(
          target.x * t,
          4.8 + (target.y + 0.5 - 4.8) * t,
          target.z * t
        );
        return;
      }

      const smoothing = 1 - Math.pow(0.001, delta);
      this.camera.position.lerp(followPos, smoothing);
      this.camera.lookAt(target.x, target.y + 0.5, target.z);
    }

    updateDecor(delta) {
      this.portals.forEach((portal, index) => {
        if (!this.reducedMotion) {
          portal.group.rotation.y += delta * (index % 2 ? -0.35 : 0.35);
          portal.torus.rotation.z += delta * (0.4 + index * 0.08);
          portal.core.material.opacity = 0.08 + Math.sin(this.elapsed * 2 + portal.phase) * 0.035;
        }
      });
      if (this.embers && !this.reducedMotion) {
        this.embers.rotation.y += delta * 0.012;
        this.embers.position.y = Math.sin(this.elapsed * 0.2) * 1.5;
      }
      if (this.killSpeechVisible) {
        if (this.elapsed >= this.killSpeechUntil) {
          this.killSpeechVisible = false;
          this.killSpeech.visible = false;
        } else {
          const remaining = this.killSpeechUntil - this.elapsed;
          if (this.reducedMotion) {
            this.killSpeech.material.opacity = 1;
          } else {
            const age = this.elapsed - this.killSpeechStartedAt;
            const pop = clamp(age / 0.16, 0, 1);
            this.killSpeech.scale.set(4.8 * pop, 1.55 * pop, 1);
            this.killSpeech.position.y = 6.2 + Math.sin(age * 5) * 0.08;
            this.killSpeech.material.opacity = clamp(remaining / 0.22, 0, 1);
          }
        }
      }
      this.updateSignalStations(delta);
    }

    updateProximityAudio(delta) {
      if (!this.videoBillboards) return;
      const candidates = [
        ...this.videoBillboards.map((bb, i) => ({
          type: "billboard", index: i,
          dist: bb.position.distanceTo(this.player.position)
        })),
        ...(this.tiktokGallery || []).map((screen, i) => ({
          type: "gallery", index: i,
          dist: screen.position.distanceTo(this.player.position)
        })),
        ...(this.bansheesVideoSourcesArr || []).map((_, i) => ({
          type: "bansheesVideo", index: i,
          dist: this.bansheesVideoScreens[i]
            ? this.player.position.distanceTo(this.bansheesVideoScreens[i].position)
            : Infinity
        })),
        ...(this.bansheesPosition ? [{
          type: "banshees", index: -1,
          dist: this.player.position.distanceTo(this.bansheesPosition)
        }] : [])
      ];
      candidates.sort((a, b) => a.dist - b.dist);
      const bansheesVideoCandidates = candidates.filter((c) => c.type === "bansheesVideo");
      const filteredCandidates = candidates.filter((c) => {
        if (c.type === "banshees" && bansheesVideoCandidates.some((bv) => bv.dist < 50)) return false;
        return true;
      });

      const nearest = filteredCandidates[0];
      const nearestDist = nearest ? nearest.dist : Infinity;

      if (this.audioActiveSource) {
        switch (this.audioActiveSource.type) {
          case "billboard":
            this.audioActiveDist = this.videoBillboards[this.audioActiveSource.index]?.position
              .distanceTo(this.player.position) ?? Infinity;
            break;
          case "gallery":
            this.audioActiveDist = this.tiktokGallery[this.audioActiveSource.index]?.position
              .distanceTo(this.player.position) ?? Infinity;
            break;
          case "bansheesVideo":
            this.audioActiveDist = this.bansheesVideoScreens[this.audioActiveSource.index]?.position
              .distanceTo(this.player.position) ?? Infinity;
            break;
          case "banshees":
            this.audioActiveDist = this.bansheesPosition
              ? this.player.position.distanceTo(this.bansheesPosition) : Infinity;
            break;
        }
      }
      const activeIsOutOfRange = this.audioActiveDist >= 50;
      if (
        !this.audioActiveSource ||
        (activeIsOutOfRange && nearestDist < 50) ||
        nearestDist < this.audioActiveDist - 4
      ) {
        this.audioActiveSource = nearest;
        this.audioActiveDist = nearestDist;
      }

      const enabled = this.options.soundEnabled?.() !== false;
      const volForDist = (d) => {
        if (!enabled) return 0;
        const t = clamp((d - 8) / 52, 0, 1);
        return 1 - t * t * (3 - 2 * t);
      };
      const smooth = 1 - Math.pow(0.01, delta);

      let activeVideoSource = null;
      if (enabled && this.audioActiveSource && this.audioActiveDist < 60) {
        switch (this.audioActiveSource.type) {
          case "billboard":
            activeVideoSource = this.videoSources[
              this.videoBillboards[this.audioActiveSource.index]?.sourceIndex
            ] || null;
            break;
          case "gallery":
            activeVideoSource = this.galleryVideoSources[this.audioActiveSource.index] || null;
            break;
          case "bansheesVideo":
            activeVideoSource = this.bansheesVideoSourcesArr[this.audioActiveSource.index] || null;
            break;
        }
      }
      this.updateMediaPlayback(activeVideoSource);

      const allVideoSources = [
        ...(this.videoSources || []),
        ...(this.galleryVideoSources || []),
        ...(this.bansheesVideoSourcesArr || [])
      ];
      allVideoSources.forEach((source) => {
        if (source !== activeVideoSource) {
          source.currentVolume = 0;
          source.video.muted = true;
          source.video.volume = 0;
        }
      });
      this.videoBillboards?.forEach((bb) => { bb.lastVolume = 0; });
      this.tiktokGallery?.forEach((screen) => { screen.lastVolume = 0; });

      const bansheesActive = enabled &&
        this.audioActiveSource?.type === "banshees" &&
        this.audioActiveDist < 60;
      if (this.bansheesAudio) {
        if (!bansheesActive) {
          this.bansheesVolume = 0;
          this.bansheesAudio.volume = 0;
        }
      }

      let activeName = "";
      let activeDist = Infinity;
      let activeVol = 0;

      if (this.audioActiveSource && this.audioActiveDist < 60) {
        const vol = volForDist(this.audioActiveDist);
        if (activeVideoSource) {
          activeVideoSource.currentVolume += (vol - activeVideoSource.currentVolume) * smooth;
          activeVideoSource.video.muted = activeVideoSource.currentVolume < 0.02;
          activeVideoSource.video.volume = clamp(activeVideoSource.currentVolume, 0, 1);
          if (vol > 0.02 && activeVideoSource.video.paused) {
            activeVideoSource.video.play()
              .then(() => { activeVideoSource.playBlocked = false; })
              .catch((error) => {
                if (error?.name !== "AbortError") activeVideoSource.playBlocked = true;
              });
          }
          if (this.audioActiveSource.type === "billboard") {
            const bb = this.videoBillboards[this.audioActiveSource.index];
            if (bb) { bb.lastVolume = Math.round(activeVideoSource.currentVolume * 100); activeName = bb.label; }
          } else if (this.audioActiveSource.type === "gallery") {
            const sc = this.tiktokGallery[this.audioActiveSource.index];
            if (sc) { sc.lastVolume = Math.round(activeVideoSource.currentVolume * 100); activeName = sc.label; }
          } else if (this.audioActiveSource.type === "bansheesVideo") {
            activeName = activeVideoSource.label;
          }
          activeVol = activeVideoSource.currentVolume;
          activeDist = this.audioActiveDist;
        } else if (this.audioActiveSource.type === "banshees" && this.bansheesAudio) {
          const target = volForDist(this.audioActiveDist);
          this.bansheesVolume += (target - this.bansheesVolume) * smooth;
          this.bansheesAudio.volume = clamp(this.bansheesVolume, 0, 1);
          if (target > 0.02 && this.bansheesAudio.paused) this.bansheesAudio.play().catch(() => {});
          activeName = "BANSHEES RISE";
          activeVol = this.bansheesVolume;
          activeDist = this.audioActiveDist;
        }
      }

      this.activeVolume = activeVol;
      this.activeAudibleName = activeName;
      this.activeAudibleDist = activeDist < Infinity ? Math.round(activeDist) : -1;
      const liveStation = this.signalStations.find((station) => station.active);
      if (liveStation) {
        this.options.onMediaSignal?.(
          `SIGNAL STATION · ${liveStation.label}`,
          liveStation.position.distanceTo(this.player.position),
          this.activeVolume
        );
      } else {
        this.options.onMediaSignal?.(activeName, activeDist < Infinity ? activeDist : -1, activeVol);
      }
    }

    updateMediaPlayback(activeVideoSource) {
      const forward = this.camera.getWorldDirection(this.temp.c);

      const visibleSources = new Set();
      if (activeVideoSource) visibleSources.add(activeVideoSource);

      const scored = [];
      this.videoBillboards?.forEach((billboard) => {
        const offset = this.temp.b.copy(billboard.position).sub(this.camera.position);
        const distance = offset.length();
        if (distance > 88) return;
        if (forward.dot(offset.normalize()) > -0.05) {
          scored.push({ source: this.videoSources[billboard.sourceIndex], dist: distance });
        }
      });
      this.tiktokGallery?.forEach((screen) => {
        const offset = this.temp.b.copy(screen.position).sub(this.camera.position);
        const distance = offset.length();
        if (distance > 88) return;
        if (forward.dot(offset.normalize()) > -0.05) {
          scored.push({ source: this.galleryVideoSources[screen.sourceIndex], dist: distance });
        }
      });
      this.bansheesVideoScreens?.forEach((screen) => {
        const offset = this.temp.b.copy(screen.position).sub(this.camera.position);
        const distance = offset.length();
        if (distance <= 88 && forward.dot(offset.normalize()) > -0.05) {
          scored.push({ source: this.bansheesVideoSourcesArr[screen.sourceIndex], dist: distance });
        }
      });
      scored.sort((a, b) => a.dist - b.dist);
      scored.slice(0, 2).forEach((item) => visibleSources.add(item.source));

      const allSources = [
        ...(this.videoSources || []),
        ...(this.galleryVideoSources || []),
        ...(this.bansheesVideoSourcesArr || [])
      ];
      allSources.forEach((source) => {
        const shouldPlay = visibleSources.has(source);
        if (shouldPlay && source.video.paused) {
          source.video.muted = true;
          source.video.play()
            .then(() => { source.playBlocked = false; })
            .catch((error) => {
              if (error?.name !== "AbortError") source.playBlocked = true;
            });
        } else if (!shouldPlay && !source.video.paused) {
          source.video.pause();
        }
      });
    }

    updateBillboardSwivel() {
      if (!this.videoBillboards) return;
      this.videoBillboards.forEach((bb) => {
        const dx = this.player.position.x - bb.position.x;
        const dz = this.player.position.z - bb.position.z;
        bb.group.rotation.y = Math.atan2(dx, dz);
      });
    }

    updateSignalStations(delta) {
      if (!this.signalStations) return;
      this.signalStations.forEach((station) => {
        const dist = station.position.distanceTo(this.player.position);
        const proximity = clamp(1 - (dist - 4) / 18, 0, 1);
        station.active = dist <= 9;
        const dx = this.player.position.x - station.position.x;
        const dz = this.player.position.z - station.position.z;
        station.group.rotation.y = Math.atan2(dx, dz);
        station.padMat.opacity = 0.08 + proximity * 0.32;
        station.beaconMat.emissiveIntensity = 2.5 + proximity * 5 + Math.sin(this.elapsed * 3) * 0.5;
        if (station.active && !station.wasActive) {
          this.spawnBurst(station.position.clone().setY(1.2), station.color, 30);
        }
        station.wasActive = station.active;
        if (proximity > 0.6 && !this.reducedMotion) {
          station.pad.rotation.z += delta * 0.45;
        }
      });
    }

    updateParticles(delta) {
      this.particles.forEach((particle) => {
        particle.life -= delta;
        particle.mesh.position.addScaledVector(particle.velocity, delta);
        particle.velocity.y -= delta * 2.4;
        particle.mesh.material.opacity = clamp(particle.life / particle.maxLife, 0, 1);
        particle.mesh.scale.multiplyScalar(0.97);
      });
      this.particles = this.particles.filter((particle) => {
        if (particle.life <= 0) {
          this.scene.remove(particle.mesh);
          particle.mesh.geometry.dispose();
          particle.mesh.material.dispose();
          return false;
        }
        return true;
      });
    }

    spawnBurst(position, color, count) {
      if (this.reducedMotion) return;
      for (let index = 0; index < count; index += 1) {
        const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(rand(0.04, 0.13), 6, 4),
          new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1 })
        );
        mesh.position.copy(position);
        this.scene.add(mesh);
        const velocity = new THREE.Vector3(rand(-1, 1), rand(0.2, 1.4), rand(-1, 1))
          .normalize()
          .multiplyScalar(rand(3, 11));
        this.particles.push({ mesh, velocity, life: rand(0.35, 0.8), maxLife: 0.8 });
      }
    }

    updateMinimap() {
      const canvas = this.options.minimap;
      if (!canvas) return;
      const context = canvas.getContext("2d");
      const width = canvas.width;
      const height = canvas.height;
      context.clearRect(0, 0, width, height);
      context.fillStyle = "rgba(5,5,7,.92)";
      context.fillRect(0, 0, width, height);
      context.strokeStyle = "rgba(255,255,255,.16)";
      context.lineWidth = 1;
      for (let x = 0; x <= width; x += width / 6) {
        context.beginPath(); context.moveTo(x, 0); context.lineTo(x, height); context.stroke();
      }
      for (let y = 0; y <= height; y += height / 4) {
        context.beginPath(); context.moveTo(0, y); context.lineTo(width, y); context.stroke();
      }
      DISTRICTS.forEach((district) => {
        context.strokeStyle = `#${district.color.toString(16).padStart(6, "0")}`;
        context.beginPath();
        context.arc(
          ((district.x + HALF_WORLD) / (HALF_WORLD * 2)) * width,
          ((district.z + HALF_WORLD) / (HALF_WORLD * 2)) * height,
          7,
          0,
          Math.PI * 2
        );
        context.stroke();
      });
      context.fillStyle = "#ef3655";
      for (const enemy of this.enemies) {
        if (enemy.dead) continue;
        context.fillRect(
          ((enemy.group.position.x + HALF_WORLD) / (HALF_WORLD * 2)) * width - 1,
          ((enemy.group.position.z + HALF_WORLD) / (HALF_WORLD * 2)) * height - 1,
          enemy.boss ? 4 : 2,
          enemy.boss ? 4 : 2
        );
      }
      context.fillStyle = "#ffd24a";
      this.coins.forEach((coin) => {
        if (coin.collected) return;
        context.beginPath();
        context.arc(
          ((coin.group.position.x + HALF_WORLD) / (HALF_WORLD * 2)) * width,
          ((coin.group.position.z + HALF_WORLD) / (HALF_WORLD * 2)) * height,
          1.7,
          0,
          Math.PI * 2
        );
        context.fill();
      });
      if (this.bansheesPosition) {
        context.strokeStyle = "#ffd13f";
        context.lineWidth = 2;
        context.strokeRect(
          ((this.bansheesPosition.x + HALF_WORLD) / (HALF_WORLD * 2)) * width - 4,
          ((this.bansheesPosition.z + HALF_WORLD) / (HALF_WORLD * 2)) * height - 4,
          8, 8
        );
      }
      // Billboard markers (cyan dots)
      context.fillStyle = "#50dfff";
      this.videoBillboards?.forEach((bb) => {
        const mx = ((bb.position.x + HALF_WORLD) / (HALF_WORLD * 2)) * width;
        const my = ((bb.position.z + HALF_WORLD) / (HALF_WORLD * 2)) * height;
        context.fillRect(mx - 1.5, my - 1.5, 3, 3);
      });
      // Signal station markers (colored circles)
      this.signalStations?.forEach((station) => {
        context.strokeStyle = `#${station.color.toString(16).padStart(6, "0")}`;
        context.lineWidth = 1.5;
        context.beginPath();
        context.arc(
          ((station.position.x + HALF_WORLD) / (HALF_WORLD * 2)) * width,
          ((station.position.z + HALF_WORLD) / (HALF_WORLD * 2)) * height,
          4.5, 0, Math.PI * 2
        );
        context.stroke();
      });
      // TikTok Alley gallery markers (pink squares)
      context.fillStyle = "#ff2255";
      this.tiktokGallery?.forEach((screen) => {
        const mx = ((screen.position.x + HALF_WORLD) / (HALF_WORLD * 2)) * width;
        const my = ((screen.position.z + HALF_WORLD) / (HALF_WORLD * 2)) * height;
        context.fillRect(mx - 1, my - 1.5, 2, 3);
      });
      this.bansheesVideoScreens?.forEach((screen) => {
        context.fillStyle = "#ffd13f";
        const mx = ((screen.position.x + HALF_WORLD) / (HALF_WORLD * 2)) * width;
        const my = ((screen.position.z + HALF_WORLD) / (HALF_WORLD * 2)) * height;
        context.fillRect(mx - 2, my - 2, 4, 4);
      });
      const playerX = ((this.player.position.x + HALF_WORLD) / (HALF_WORLD * 2)) * width;
      const playerY = ((this.player.position.z + HALF_WORLD) / (HALF_WORLD * 2)) * height;
      context.save();
      context.translate(playerX, playerY);
      context.rotate(-this.player.rotation.y);
      context.fillStyle = "#5df5c8";
      context.beginPath();
      context.moveTo(0, -6);
      context.lineTo(5, 5);
      context.lineTo(-5, 5);
      context.closePath();
      context.fill();
      context.restore();
      context.strokeStyle = "rgba(255,255,255,.45)";
      context.strokeRect(0.5, 0.5, width - 1, height - 1);
      const MINIMAP_LEGEND = [
        ["#8d6cff", "D"],
        ["#50dfff", "TV"],
        ["#ff2255", "TT"],
        ["#ffd13f", "B"],
        ["#5df5c8", "S"]
      ];
      context.fillStyle = "rgba(5,5,7,.88)";
      context.fillRect(2, height - 14, width - 4, 12);
      context.font = `700 8px ${LABEL_FONT_FAMILY}`;
      context.textBaseline = "middle";
      MINIMAP_LEGEND.forEach(([color, label], index) => {
        const x = 7 + index * 34;
        context.fillStyle = color;
        context.fillRect(x, height - 10, 4, 4);
        context.fillStyle = "#fff";
        context.fillText(label, x + 7, height - 8);
      });
    }

    collidesWorld(x, z, radius) {
      return this.obstacles.some((obstacle) => {
        const dx = x - obstacle.x;
        const dz = z - obstacle.z;
        const minDistance = radius + obstacle.radius;
        return dx * dx + dz * dz < minDistance * minDistance;
      });
    }

    collidesEnemyWorld(x, z, radius) {
      return this.isInTikTokAlleyClearance(x, z, radius + 1.5) ||
        this.collidesWorld(x, z, radius);
    }

    celebrate() {
      if (this.celebrating) return;
      this.celebrating = true;
      this.celebrationPhase = "rearing";
      this.celebrationProgress = 0;
      this.celebrationStartedAt = performance.now();
      this.celebrationPlayerPos = this.player.position.clone();
      this.celebrationPlayerRotation = this.player.rotation.y;
      this.celebrationCameraOrbit = 0;
      this.spawnBurst(this.player.position.clone().add(new THREE.Vector3(0, 3, 0)), 0xffffff, 120);
      this.options.onTarget?.("25 SURREALS DEFEATED · WORLD CLEARED");
    }

    primeMedia() {
      if (this.mediaPrimePromise) {
        const activeVideoSource = this.audioActiveSource?.type === "billboard"
          ? this.videoSources[this.videoBillboards[this.audioActiveSource.index]?.sourceIndex]
          : this.audioActiveSource?.type === "gallery"
            ? this.galleryVideoSources[this.audioActiveSource.index]
            : this.audioActiveSource?.type === "bansheesVideo"
              ? this.bansheesVideoSourcesArr[this.audioActiveSource.index]
              : null;
        this.updateMediaPlayback(activeVideoSource);
        if (this.audioActiveSource?.type === "banshees" && this.bansheesAudio?.paused) {
          this.bansheesAudio.play().catch(() => {});
        }
        return this.mediaPrimePromise;
      }
      this.mediaPrimed = true;
      const candidates = (this.videoSources || []).slice(0, 3);
      const attempts = candidates.map((source) => {
        source.video.volume = 0;
        source.video.muted = true;
        return source.video.play()
          .then(() => { source.playBlocked = false; source.video.pause(); })
          .catch((error) => {
            if (error?.name !== "AbortError") source.playBlocked = true;
          });
      });
      const allSources = [
        ...(this.videoSources || []).slice(3),
        ...(this.galleryVideoSources || []),
        ...(this.bansheesVideoSourcesArr || [])
      ];
      const primeRemaining = async () => {
        for (const source of allSources) {
          source.video.volume = 0;
          source.video.muted = true;
          await source.video.play()
            .then(() => { source.playBlocked = false; source.video.pause(); })
            .catch((error) => {
              if (error?.name !== "AbortError") source.playBlocked = true;
            });
        }
      };
      if (this.bansheesAudio) {
        this.bansheesAudio.volume = 0;
        attempts.push(this.bansheesAudio.play().catch(() => {}));
      }
      this.mediaPrimePromise = Promise.allSettled(attempts).then(() => {
        primeRemaining().catch(() => {});
        if (!this.destroyed) this.updateMediaPlayback(null);
      });
      return this.mediaPrimePromise;
    }

    stopWorldAudio() {
      this.videoBillboards?.forEach((billboard) => {
        billboard.lastVolume = 0;
        billboard.video.volume = 0;
        billboard.video.muted = true;
        billboard.video.pause();
      });
      const allExtra = [
        ...(this.galleryVideoSources || []),
        ...(this.bansheesVideoSourcesArr || [])
      ];
      allExtra.forEach((source) => {
        source.video.volume = 0;
        source.video.muted = true;
        source.video.pause();
      });
      if (this.bansheesAudio) {
        this.bansheesAudio.volume = 0;
        this.bansheesAudio.pause();
      }
    }

    updateCelebration(delta) {
      const celebDur = this.reducedMotion ? 0.8 : 3.6;
      const elapsed = (performance.now() - this.celebrationStartedAt) / 1000;
      this.celebrationProgress = clamp(elapsed / celebDur, 0, 1);

      if (this.reducedMotion) {
        this.celebrationPhase = "static";
        this.updateParticles(delta);
        return;
      }

      if (elapsed < 0.8) {
        this.celebrationPhase = "rearing";
        const t = elapsed / 0.8;
        const ease = t * t;
        if (this.horseNeck) this.horseNeck.rotation.x = ease * -0.7;
        if (this.horseHead) this.horseHead.rotation.x = ease * -0.35;
        if (this.horseTail) this.horseTail.rotation.x = -0.24 + ease * 0.6;
        if (this.rider) this.rider.rotation.x = ease * 0.38;
        this.player.position.y = ease * 1.2;
        if (this.horseLegs) {
          this.horseLegs.forEach((leg) => {
            if (leg.front) leg.upperPivot.rotation.x = -ease * 0.9;
          });
        }
        this.spawnBurst(this.player.position.clone().add(new THREE.Vector3(0, 4, 0)), 0xffd23f, 8);
      } else if (elapsed < 3.2) {
        this.celebrationPhase = "orbit";
        const t = (elapsed - 0.8) / 2.4;
        this.celebrationCameraOrbit = t * Math.PI * 2;
        if (this.horseNeck) this.horseNeck.rotation.x = -0.38 + Math.sin(elapsed * 2) * 0.08;
        if (this.rider) this.rider.rotation.x = 0.2;
        this.player.position.y = 1.2 + Math.sin(elapsed * 3) * 0.18;
        this.player.rotation.y += delta * 0.72;
        if (elapsed % 0.5 < delta) {
          this.spawnBurst(this.player.position.clone().add(new THREE.Vector3(rand(-2, 2), rand(1, 5), rand(-2, 2))), 0xe21c3d, 12);
        }
      } else if (elapsed < 3.6) {
        this.celebrationPhase = "leap";
        const t = (elapsed - 3.2) / 0.4;
        if (this.horseNeck) this.horseNeck.rotation.x = -0.7 * (1 - t);
        if (this.rider) this.rider.rotation.x = 0.2 * (1 - t);
        this.player.position.y = 1.2 + t * 3.5;
      } else {
        this.celebrationPhase = "complete";
        if (this.horseNeck) this.horseNeck.rotation.x = 0;
        if (this.horseHead) this.horseHead.rotation.x = 0;
        if (this.horseTail) this.horseTail.rotation.x = -0.24;
        if (this.rider) this.rider.rotation.x = 0;
        if (this.horseLegs) this.horseLegs.forEach((leg) => { if (leg.front) leg.upperPivot.rotation.x = 0; });
      }

      this.updateParticles(delta);
    }

    setPaused(paused) {
      this.paused = paused;
      if (!paused) {
        this.clock.getDelta();
        this.primeMedia();
      }
    }

    getState() {
      return {
        kills: this.kills,
        enemies: this.enemies.length,
        alive: this.enemies.filter((enemy) => !enemy.dead).length,
        health: this.health,
        paused: this.paused,
        district: this.currentDistrict,
        renderer: "WebGL",
        winTarget: WIN_TARGET,
        coins: this.coinCount,
        // Billboard/media state
        videos: this.videoBillboards?.length || 0,
        displayCount: this.videoBillboards?.length || 0,
        uniqueMediaCount: this.videoSources?.length || 0,
        aspectFitStatus: this.videoBillboards?.map((bb) => ({
          label: bb.label,
          sourceAspect: this.videoSources[bb.sourceIndex].aspect,
          fittedWidth: Number(bb.fittedWidth.toFixed(2)),
          fittedHeight: Number(bb.fittedHeight.toFixed(2)),
          letterboxed: true
        })) || [],
        activeAudibleSource: this.activeAudibleName || null,
        activeAudibleDist: this.activeAudibleDist,
        mediaPrimed: this.mediaPrimed,
        playingMediaCount: [
          ...(this.videoSources || []),
          ...(this.galleryVideoSources || []),
          ...(this.bansheesVideoSourcesArr || [])
        ].filter((source) => !source.video.paused).length,
        blockedMediaCount: [
          ...(this.videoSources || []),
          ...(this.galleryVideoSources || []),
          ...(this.bansheesVideoSourcesArr || [])
        ].filter((source) => source.playBlocked).length,
        audibleMediaCount: [
          ...(this.videoSources || []),
          ...(this.galleryVideoSources || []),
          ...(this.bansheesVideoSourcesArr || [])
        ].filter((source) => !source.video.muted && source.video.volume > 0.01).length +
          (this.bansheesAudio && this.bansheesAudio.volume > 0.01 ? 1 : 0),
        // Camera / intro
        cameraIntro: !this.introComplete,
        cameraIntroProgress: this.introComplete ? 1 : this.introProgress,
        cameraPosition: {
          x: Number(this.camera.position.x.toFixed(2)),
          y: Number(this.camera.position.y.toFixed(2)),
          z: Number(this.camera.position.z.toFixed(2))
        },
        // Signal stations
        stationCount: this.signalStations?.length || 0,
        signalStations: this.signalStations?.map((station) => ({
          id: station.id,
          label: station.label,
          x: station.position.x,
          z: station.position.z,
          active: station.active
        })) || [],
        mounted: Boolean(this.horse && this.rider),
        horseParts: this.horseParts?.map((part) => part.name).filter(Boolean) || [],
        horsePartCount: this.horseParts?.length || 0,
        speechPhrase: this.killSpeechPhrase,
        speechVisible: this.killSpeechVisible,
        buildingVariantCount: this.buildingVariantCount,
        moonVisible: Boolean(this.moon?.visible),
        starCount: this.starCount,
        streetArtifactCount: this.streetArtifactCount,
        fullEnemyLodCount: this.fullDetailEnemies.size,
        faceEnemyLodCount: this.faceDetailEnemies.size,
        streetArtifactCategories: { ...this.streetArtifactCategories },
        galleryCount: this.tiktokGallery?.length || 0,
        gallerySourceLabels: this.galleryVideoSources?.map((source) => source.label) || [],
        galleryLinkCount: this.tiktokGallery?.filter((screen) => screen.sourceUrl).length || 0,
        alleyIntrusionCount: this.obstacles.filter((obstacle) =>
          obstacle.x > TIKTOK_ALLEY_X + 4 &&
          obstacle.x < TIKTOK_ALLEY_CLEARANCE.maxX &&
          obstacle.z >= TIKTOK_ALLEY_CLEARANCE.minZ &&
          obstacle.z <= TIKTOK_ALLEY_CLEARANCE.maxZ
        ).length,
        bansheesSourceCount: this.bansheesVideoSourcesArr?.length || 0,
        bansheesSourceLabels: this.bansheesVideoSourcesArr?.map((source) => source.label) || [],
        activeVolume: Number(this.activeVolume.toFixed(3)),
        celebrationPhase: this.celebrationPhase,
        celebrationProgress: Number(this.celebrationProgress.toFixed(3)),
        wayfindingCount: this.wayfindingCount,
        labelFitCount: this.labelFitCount,
        labelFitStatus: this.labelFitCount > 0,
        speechAnchor: this.speechAnchor,
        yaw: Number(this.yaw.toFixed(3)),
        cameraDistance: Number(this.cameraDistance.toFixed(2)),
        worldComplete: this.worldComplete,
        bansheesAudioPaused: this.bansheesAudio?.paused ?? true,
        bansheesVolume: Number((this.bansheesAudio?.volume || 0).toFixed(3)),
        billboardVolumes: this.videoBillboards?.map((bb) => bb.lastVolume) || [],
        billboardPaused: this.videoBillboards?.map((bb) => bb.video.paused) || [],
        player: {
          x: Number(this.player.position.x.toFixed(2)),
          z: Number(this.player.position.z.toFixed(2))
        }
      };
    }

    warpPlayerToStation(stationId) {
      const station = this.signalStations?.find((s) => s.id === stationId);
      const destination = station?.position ||
        (stationId === "banshees" ? this.bansheesPosition : null);
      if (!destination) return false;
      this.player.position.set(destination.x, 0, destination.z + (station ? 7 : 16));
      this.yaw = Math.atan2(
        destination.x - this.player.position.x,
        destination.z - this.player.position.z
      );
      this.introComplete = true;
      this.updateCamera(1);
      return true;
    }

    debugDefeatAll() {
      this.enemies
        .filter((enemy) => !enemy.dead)
        .slice(0, WIN_TARGET)
        .forEach((enemy) => this.defeatEnemy(enemy));
    }

    debugDefeatOne() {
      const enemy = this.enemies.find((item) => !item.dead);
      if (enemy) this.defeatEnemy(enemy);
    }

    debugCollectCoin() {
      const coin = this.coins.find((item) => !item.collected);
      if (!coin) return;
      this.player.position.copy(coin.group.position).setY(0);
    }

    debugCrowdEnemies(count = 30) {
      const living = this.enemies.filter((enemy) => !enemy.dead).slice(0, count);
      living.forEach((enemy, index) => {
        const angle = (index / living.length) * Math.PI * 2;
        const radius = 8 + (index % 4) * 2.4;
        enemy.group.position.set(
          this.player.position.x + Math.sin(angle) * radius,
          0,
          this.player.position.z + Math.cos(angle) * radius
        );
      });
      this.damageGraceUntil = performance.now() + 10000;
      this.enemyLodTimer = 0;
      return living.length;
    }

    destroy() {
      if (this.destroyed) return;
      this.destroyed = true;
      if (this.completionTimer) {
        clearTimeout(this.completionTimer);
        this.completionTimer = null;
      }
      cancelAnimationFrame(this.frameId);
      this.renderer.domElement.removeEventListener("pointerdown", this.onPointerDown);
      this.renderer.domElement.removeEventListener("pointermove", this.onPointerMove);
      this.renderer.domElement.removeEventListener("pointerup", this.onPointerUp);
      this.renderer.domElement.removeEventListener("pointercancel", this.onPointerCancel);
      this.renderer.domElement.removeEventListener("wheel", this.onWheel);
      this.stopWorldAudio();
      this.videoSources?.forEach((source) => {
        source.video.pause();
        source.video.removeAttribute("src");
        source.video.load();
        source.texture.dispose();
      });
      this.videoBillboards?.forEach((bb) => {
        bb.video.pause();
      });
      this.galleryVideoSources?.forEach((source) => {
        source.video.pause();
        source.video.removeAttribute("src");
        source.video.load();
        source.texture.dispose();
      });
      this.bansheesVideoSourcesArr?.forEach((source) => {
        source.video.pause();
        source.video.removeAttribute("src");
        source.video.load();
        source.texture.dispose();
      });
      if (this.bansheesAudio) {
        this.bansheesAudio.pause();
        this.bansheesAudio.src = "";
      }
      disposeObject(this.scene);
      this.renderer.dispose();
      this.renderer.forceContextLoss?.();
      this.renderer.domElement.remove();
      if (window.__BOYO_THREE_TEST__) delete window.__BOYO_THREE_TEST__;
    }
  }

  window.BoyoThreeWorld = BoyoThreeWorld;
})();
