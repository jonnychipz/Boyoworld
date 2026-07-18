# BOYOWORLD Design System

## Intent

A professional game campaign assembled like a hand-built punk venue: black-painted walls, hard white light, hazard red, chrome, photocopied posters, torn video stills, tape, speaker cones, and a precise LCD game cabinet.

## Palette

The public interface uses the mandatory Clawpilot token vocabulary plus BOYOWORLD-specific `--cp-game-*` tokens.

- Background: near-black neutral
- Main ink: cold white
- Signal: BOYO red
- Secondary signal: electric violet, used sparingly
- Chrome: cool neutral highlights
- Success and danger: inherited semantic tokens

All body text must retain at least 4.5:1 contrast. Game-critical text targets 7:1.

## Typography

Use Segoe UI/Aptos for interface clarity. Heavy, compressed-feeling display treatments are created with weight, transform, outline, and spacing rather than a remote font dependency. Monospace is reserved for scores, timers, and machine readouts.

## Image Treatment

- Official BOYOWORLD, YouTube, TikTok, and supplied imagery is stored locally.
- Video stills are treated as torn posters, scene backdrops, and reward covers.
- Never place a busy image directly behind game-critical text without a solid contrast plate.
- The supplied white balaclava reference defines the playable character's silhouette and mask details.

## Layout

The promotional page surrounds one dominant old-LCD game cabinet. Navigation and social destinations remain direct and familiar. On small screens the cabinet becomes edge-to-edge and touch controls move below the display.

## Components

- **Boyo wordmark:** oversized white block lettering with a red registration shadow
- **Signal button:** hard rectangular action with a one-pixel border and physical pressed state
- **LCD cabinet:** deep shell, hardware top rail, screen bezel, scanline surface, status display
- **Torn poster:** clipped image with tape and offset label
- **Transmission strip:** scrolling but motion-safe promotional links
- **Reward takeover:** official YouTube embed with replay, skip, and next-level actions
- **Game guide:** persistent high-contrast goal, progress bar, count, and control reminder
- **Level briefing:** short protected reading period before hazards or notes begin

## Motion

Movement should feel mechanical and responsive. Use 150-250ms interface transitions. Gameplay runs at the browser frame rate. When reduced motion is requested, disable decorative jitter, scrolling strips, parallax, and screen shake while retaining essential gameplay movement.

## Game Rendering

Phaser 3 is vendored locally and renders five distinct worlds in WebGL with Canvas fallback. The visual stack combines:

- Three music-video frames per level
- Independent depth/tint layers
- An articulated BOYO rig using the supplied real mask reference
- Particle bursts, fog, stage beams, rhythm perspective, camera flash and shake
- Genre-specific environments rather than one reskinned playfield
- A DOM-based accessible cabinet shell around the accelerated game canvas

Gameplay art stays below targets in the hierarchy. Targets use glow and explicit labels; hazards use solid silhouettes; background footage is darkened and confined to a subdued centre plate and edge strips. The page can remain punk-chaotic, but the playfield must remain calm enough to parse instantly.

## Audio

Use the Web Audio API to synthesize short original interface and game cues. Audio starts only after user interaction. Every sound has a visible counterpart.

Music rewards use `youtube-nocookie.com` and request audible autoplay. Since browsers may block automatic playback with sound, the native embedded controls remain visible for immediate one-click playback.
