# BOYOWORLD Design System

## Intent

A polished public music-game campaign assembled like a wet, poster-covered punk city at night: hard white knit, BOYO red, black asphalt, chrome, glowing streetlights, torn video stills, Banshees graffiti and a precise game cabinet.

## Public Hierarchy

1. BOYOWORLD identity and game in the opening viewport
2. Animated BOYO image/link marquee with looping background wordmarks
3. Surreal enemy and world dossier
4. Separate Banshees feature and TikTok links
5. Official music, social and merch routes

No engine or implementation terminology appears in public-facing copy.

## Game World

- Procedural wet asphalt and grime textures with brighter midtone palette
- Reflective puddles, richer violet-dusk fog (`FogExp2`), emissive portals and luminous street-pool streetlights
- Collision-safe buildings, bins, pillars, landmark and lamp posts
- **18 BOYO TV video billboard displays** backed by **6 shared local video sources** (6 `<video>` elements / `VideoTexture`s reused across all displays); correct aspect-fit letterboxing for 16:9 and square sources; swivel to face player; circular collision and spawn-clearance zones prevent characters, props, coins, puddles and lamps crossing screens
- **5 proximity signal stations** (RED BRICK, SPITFIRE, FUMING, RAW PAP, PAY ME/TONEDEF) with poster, glow pad, pylon, beacon; visual proximity feedback; deep-link buttons warp BOYO to the station from any page section
- Thirty collectible BOYO coins
- BOYOWORLD Banshees logo, soundtrack and graffiti landmark
- Five visually distinct districts
- **Cinematic opening camera**: 4.2 s slightly elevated street-wide-to-follow ease (cubic); immediate for reduced motion

## Audio

- **Unified proximity arbitration**: at most one audible source across all 18 billboards and Banshees audio. Full volume ≤ 10 units, silent ≥ 50. 4-unit hysteresis prevents rapid switching. All other sources muted but visually active. HUD signal readout shows nearest active source and distance.
- Pause / fail / reward / menu silence and pause all sources; resume restores behaviour.

## Character

BOYO uses a procedural 3D knitted balaclava with bump detail, eye/mouth openings, visible eyes/skin, BOYO wordmark, red Welsh dragon mark and an articulated streetwear body with hands, shoes, jacket panels and chrome zip detail. The start-screen mask carries the matching red dragon and CYMRU mark.

## Enemies

Fifty uniquely named surreal humanoids with **anatomical proportions**: two-part jointed limbs (thigh/knee, upper-arm/elbow), shoulder spheres, neck cylinder, collar torus, belt box, shoes, and a `headGroup` for head-bob. Faces have white sclera / dark pupils, brows, nose and mouth. Materials are substantially less emissive/plastic. Layered streetwear with collar and belt. 8-tone varied skin palette. Varied silhouette across archetypes. Believable stride, arm swing, lean and head bob. Reduced-motion path skips decorative animation. Health labels, collision and hit response preserved.

## Motion

Movement conveys state. Respect reduced motion by removing decorative camera shake, particles, scrolling marquees, portal motion and tile choreography while preserving essential game movement. Cinematic intro skips immediately.

## Reward

The win state remains inside the cabinet, requests audible official-video autoplay, and adds a scratch-to-reveal placeholder 15% merch code.
