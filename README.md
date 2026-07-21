<p align="center">
  <a href="https://jonnychipz.github.io/Boyoworld/">
    <img src="assets/brand-hero.png" alt="BOYOWORLD" width="900">
  </a>
</p>

<h1 align="center">BOYOWORLD</h1>

<p align="center">
  <strong>One masked world. Twenty-five kills to win. Thirty BOYO coins.</strong>
</p>

<p align="center">
  <a href="https://jonnychipz.github.io/Boyoworld/"><strong>ENTER BOYOWORLD</strong></a>
  · <a href="https://www.youtube.com/@BOYOWORLD">YouTube</a>
  · <a href="https://www.tiktok.com/@boyo_world">TikTok</a>
  · <a href="https://linktr.ee/BOYOWORLD">All links</a>
</p>

---

## The game

BOYOWORLD is one large third-person night-city game running directly in the browser.

- Explore five grimy surreal districts
- Fifty individually named surreal humanoid enemies (anatomical two-part limbs, layered streetwear, varied skin, believable stride); defeat **25** to win
- Collect **30 spinning BOYO coins** for score and health
- **18 BOYO TV video billboard displays** arranged symmetrically across the city and backed by **9 shared local video sources** — six verified BOYOWORLD YouTube videos plus the three latest playable @boyo_world TikToks, all aspect-fitted with Y-swivel, beacons, labels and protected clearance zones
- **TikTok Alley** adds 15 newest-first, locally optimized portrait clips beside a protected obstruction-free pedestrian corridor; each screen uses a physical under-screen plaque and opens its original TikTok post
- Two current @amie1985 **Banshees feature screens** flank the landmark and join the shared media system
- Adaptive media playback keeps only nearby/in-view sources decoding; Enter World primes media during the user gesture so proximity autoplay and audio remain reliable
- **5 proximity signal stations** (RED BRICK, SPITFIRE, FUMING, RAW PAP, PAY ME) with poster, glow pad, pylon and beacon; deep-link warp buttons on the page teleport BOYO to each station
- At most one audible source active at a time (unified proximity arbitration across all billboards and Banshees); HUD signal readout shows current source and distance
- The shared curve is near-full within 8 units, continuously fades to silence at 60, and reports source, distance and volume
- 4.2-second cinematic opening camera that settles from a slightly elevated street-wide view into the follow camera; immediate for reduced motion
- Discover the BOYOWORLD Banshees landmark and proximity soundtrack
- Ride a hand-built procedural wooden toy horse with carved grain, articulated gait, reins, stirrups and a visibly mounted BOYO
- See BOYO call every defeat through an in-world comic speech bubble with an accessible announcement
- Clear the world to unlock an official BOYO music video and scratch-to-reveal placeholder 15% merch code
- A 3.6-second mounted victory sequence rears, makes one full camera orbit and finishes with a screenward leap before the reward

## Controls

| Control | Action |
|---|---|
| `↑` / `↓` | Run forward / backward |
| `←` / `→` | Inverted turn/pan: Left turns right, Right turns left |
| `Q` / `E` | Strafe |
| `Space` | Fire |
| `B` | Dash |
| Pointer drag | Look around |
| Mouse wheel | Zoom |
| Touch drag | Look around |
| Touch pinch | Zoom |
| `P` / `Escape` | Pause |
| `R` | Restart |

On mobile, **Enter the world** requests cabinet fullscreen and landscape orientation when supported. Fullscreen uses a four-arrow D-pad, a large **FIRE** button and a top-right **×** exit; browsers that block fullscreen/orientation lock fall back to a full-window portrait-safe mode.

## The world

The city uses procedural wet-asphalt, grime and four façade families (brick, concrete, render and glass-metal), explicit doors and shopfronts, awnings, roof tanks/vents and occasional fire escapes. Grounded, mostly instanced street dressing includes sidewalks, crosswalks, benches, hydrants, signs, traffic lights, parked cars/vans, utilities, drains, litter/posters, steam vents and road markings while preserving protected media clearances and collision routes.

Districts:

1. Spin Block Central
2. Banshees Quarter
3. Weakie Wally Way
4. Wet Egg Plaza
5. Raw Pap Yard

## BOYO

The 3D character is visibly posed on a detailed procedural wooden toy horse while retaining the fully procedural knitted white balaclava:

- Knit texture and bump detail
- Eye and mouth openings with visible eyes/skin
- BOYO cheek mark and solid-black Welsh dragon forehead mark
- Canvas-textured carved wood grain used for colour, bump and roughness response, with saddle, bridle, leather reins/straps, metal stirrups, Welsh-red saddle cloth, mane, tail, glass eyes and brass trim
- Articulated horse legs, knees, neck, head and tail plus mounted head, torso, arms, hands, legs and shoes
- Coordinated idle, gait, turn, dash, fire, recoil, hit and win animation; reduced motion keeps essential movement with restrained articulation
- Comic kill speech appears above BOYO for 1.5–2 seconds and is mirrored to the game announcement region
- Lower third-person camera, soft shadow and collision-safe movement

## The surreal roster

All 50 enemies keep their unique names, health and targets while adding procedural woven clothing surfaces, richer physical materials, differentiated gait, joint follow-through and hit recoil. Humanoid anatomy remains beneath their surreal object construction, with multi-hit health, hit feedback and a temporary name/health card when shot.

Examples include Weakie Wally, Wet Egg Wendy, Lamp Lad Larry, Sofa Steve, Plug Head Pete, Damp Sock Derek, Kettle Karen, Mattress Mandy, Tin Foil Tim and Wall Plug Walter.

## Music and audio

- **18 BOYO TV billboard displays** across the city, backed by 9 local MP4 sources: six verified BOYOWORLD YouTube videos (Red Brick, Spitfire, Fuming, Raw Pap, Pay Me, Dior) and three current @boyo_world TikToks (Live Documents, Battle Panic, High on Life)
- **Unified proximity audio** covers 9 landscape sources, 15 Alley clips and 2 Banshees clips. It is near-full at ≤8 units, truly silent at ≥60, updates every frame with time-based smoothing and retains 4-unit switch hysteresis.
- Decoder work stays bounded to the audible source plus at most two nearby/in-view sources; every video uses metadata-only preload.
- Crowd LOD caps full geometry to the nearest 14 enemies (8 mobile) and facial detail to the nearest 7 (3 mobile), preventing frame spikes when the mob surrounds BOYO
- HUD signal readout shows current active source and distance
- Banshees soundtrack rises near its landmark (also part of unified arbitration)
- Pause / fail / reward / menu silences all sources; resume restores behaviour
- The win screen stays inside the cabinet and requests audible autoplay
- A scratch panel reveals the fixed placeholder `TEST-NOT-REAL-CODE`

The 15% code is a prototype and is not connected to the live storefront yet.

## Technology

- Three.js vendored locally
- Static HTML, CSS and JavaScript
- Web Audio API effects
- YouTube privacy-enhanced embeds
- GitHub Actions and GitHub Pages
- No backend or build step

## Run locally

```powershell
Set-Location "C:\Users\johnlunn\OneDrive - Microsoft\Documents\Projects\Boyoworld"
npx serve .
```

## Sources

Visual and promotional material comes from the project owner's supplied references and BOYO's official public destinations:

- [BOYOWORLD Linktree](https://linktr.ee/BOYOWORLD)
- [YouTube](https://www.youtube.com/@BOYOWORLD)
- [TikTok](https://www.tiktok.com/@boyo_world)
- [Instagram](https://www.instagram.com/boyoworld/)
- [Spotify](https://open.spotify.com/artist/7J2xeLqwL4RSJ4OqCWL00d)
- [Apple Music](https://music.apple.com/gb/artist/boyo/1562715707)
- [SoundCloud](https://soundcloud.com/boyoworld)
- [Official storefront](https://www.boyoworld.com/)

<p align="center"><strong>MASK ON. SIGNAL LIVE. NO WEAKIES.</strong></p>
