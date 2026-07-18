<p align="center">
  <a href="https://jonnychipz.github.io/Boyoworld/">
    <img src="assets/brand-hero.png" alt="BOYOWORLD" width="900">
  </a>
</p>

<h1 align="center">BOYOWORLD: THE GAME</h1>

<p align="center">
  <strong>Five game worlds. One masked menace. Official BOYO music rewards.</strong>
</p>

<p align="center">
  <a href="https://jonnychipz.github.io/Boyoworld/"><strong>PLAY BOYOWORLD</strong></a>
  ·
  <a href="https://www.youtube.com/@BOYOWORLD">YouTube</a>
  ·
  <a href="https://www.tiktok.com/@boyo_world">TikTok</a>
  ·
  <a href="https://linktr.ee/BOYOWORLD">All BOYO links</a>
</p>

---

## Enter BOYOWORLD

BOYOWORLD is a promotional music-game universe built around BOYO's distinctive white knitted mask, Welsh dragon mark, music videos, live chaos, and punk visual language.

The game runs entirely in the browser on GitHub Pages. Every level uses a different genre, but the same animated BOYO character. Win a level and the cabinet immediately unlocks and auto-plays a random official BOYO music video.

> **Chaos in the frame. Clarity in the controls.**

## The five disturbances

| World | Genre | How to win | Controls |
|---|---|---|---|
| **Red Brick Run** | Cinematic street runner | Collect **6 glowing red bricks** while jumping the labelled obstacles | `Space` / `↑` to jump |
| **Spitfire Beat** | Four-lane rhythm game | Hit **12 notes** when they touch the white strike line | `D` `F` `J` `K` |
| **Fuming Escape** | Top-down urban chase | Collect **6 glowing signals** without touching the red hunters | `WASD` / arrows |
| **Raw Pap Arena** | 360-degree survival shooter | Destroy **12 red enemies**; BOYO auto-aims at the nearest target | `WASD` + hold `Space` |
| **Pay Me Panic** | Visual memory reaction | Complete **3 patterns** by repeating each illuminated panel sequence | Arrows / `D` `F` `J` `K` / touch |

Every world begins with a short **HOW TO WIN** briefing. A persistent HUD then shows the exact goal, controls, progress bar, and current count throughout play.

## BOYO, animated

The playable BOYO is a layered Phaser rig built around the supplied mask photography:

- Articulated head, scarf, torso, arms, and legs
- Walk, run, jump, dance, recoil, hit, and celebration states
- Welsh dragon mask mark and BOYO detailing
- Dynamic shadow, facing direction, speech bubbles, and character quotes
- Keyboard, pointer, and mobile touch control

## Visual world

The title experience and levels combine authorized material from BOYO's official channels:

- 15 selected in-video scene frames across five music videos
- Artwork from the complete 18-video YouTube playlist
- 14 TikTok cover images
- Official BOYOWORLD storefront banner and artwork
- The supplied white BOYO balaclava reference

Gameplay keeps those images deliberately subdued behind high-contrast targets, hazards, lanes, walls, and guidance. Full-strength imagery is reserved for title screens, transitions, the visual archive, and promotional sections.

## Music rewards

Completing a level opens a privacy-enhanced YouTube embed inside the game cabinet.

- A random official BOYO video is selected
- The player requests autoplay with sound
- Browsers that block audible autoplay leave the embedded player ready for one click on Play
- The page remains fixed on the LCD cabinet; the reward never jumps to another site section
- Choose another random video, skip it, or continue to the next level

## Controls and accessibility

- **Move:** arrows or `WASD`
- **Action / jump / fire:** `Space`
- **Pause:** `P` or `Escape`
- **Restart:** `R`
- **Sound:** cabinet sound control
- **Fullscreen:** includes the game and mobile controls

The experience includes visible keyboard focus, touch controls, high-contrast guidance, non-audio cues, responsive layouts, pause/retry controls, and reduced-motion support. Outside active gameplay, arrow keys and Space retain their normal page-navigation behaviour.

## Technology

- [Phaser 3](https://phaser.io/) vendored locally for reliable GitHub Pages hosting
- WebGL rendering with Canvas fallback
- Web Audio API for original synthesized game effects
- Static HTML, CSS, and JavaScript
- GitHub Actions deployment to GitHub Pages
- No build step or runtime backend

## Run locally

```powershell
Set-Location "C:\Users\johnlunn\OneDrive - Microsoft\Documents\Projects\Boyoworld"
npx serve .
```

Then open the local URL shown by `serve`.

## Project structure

```text
Boyoworld/
├── index.html              # Promotional site and game cabinet
├── styles.css              # BOYOWORLD interface and responsive design
├── game.js                 # Phaser scenes, BOYO rig, five games, rewards
├── assets/
│   ├── frames/             # Selected music-video scene frames
│   ├── tiktok/             # Official TikTok cover imagery
│   ├── youtube/            # Official YouTube artwork
│   └── vendor/phaser.min.js
├── tests/static.test.js
└── .github/workflows/pages.yml
```

## Official BOYO destinations

- [BOYOWORLD Linktree](https://linktr.ee/BOYOWORLD)
- [YouTube](https://www.youtube.com/@BOYOWORLD)
- [TikTok](https://www.tiktok.com/@boyo_world)
- [Instagram](https://www.instagram.com/boyoworld/)
- [Spotify](https://open.spotify.com/artist/7J2xeLqwL4RSJ4OqCWL00d)
- [Apple Music](https://music.apple.com/gb/artist/boyo/1562715707)
- [SoundCloud](https://soundcloud.com/boyoworld)
- [Bandcamp](https://boyoworld.bandcamp.com/follow_me)
- [Official storefront](https://www.boyoworld.com/)

## Visual-source note

The project uses BOYO-authorized source imagery supplied by the project owner and collected from BOYO's official public YouTube, TikTok, Linktree, and storefront destinations. The imagery is used only within this BOYOWORLD promotional experience.

---

<p align="center">
  <strong>MASK ON. SIGNAL LIVE. NO WEAKIES.</strong>
</p>
