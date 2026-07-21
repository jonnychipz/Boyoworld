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
- Four procedural architecture families — brick, concrete, render and glass-metal — with doors, shopfronts/awnings, setbacks, parapets, water tanks, vents and occasional fire escapes
- Mostly instanced sidewalks, crossings, street furniture, parked vehicles, utilities, drains, posters/litter, steam vents and markings provide dense grounded detail without compromising road cores, media clearances or mobile performance
- Dense stars, layered violet haze and a visible moon/halo with cool rim light retain night navigation
- Reflective puddles, richer violet-dusk fog (`FogExp2`), emissive portals and luminous street-pool streetlights
- Collision-safe buildings, bins, pillars, landmark and lamp posts
- **18 BOYO TV video billboard displays** in a balanced symmetric layout, backed by **9 shared local video sources** (six verified BOYOWORLD YouTube videos and three newest playable @boyo_world TikToks); all are normalized to 16:9, swivel to face player, and use circular collision/spawn-clearance zones
- **TikTok Alley** is a signed line of 15 portrait screens beside a protected full-length pedestrian corridor; screens use physical under-screen plaques and click through to their source posts. Two current Banshees portrait screens sit by the landmark.
- Media is primed during the Enter World gesture; only nearby/in-view sources continue decoding, keeping autoplay authorized and reducing CPU/video contention
- **5 proximity signal stations** (RED BRICK, SPITFIRE, FUMING, RAW PAP, PAY ME/TONEDEF) with poster, glow pad, pylon, beacon; visual proximity feedback; deep-link buttons warp BOYO to the station from any page section
- Thirty collectible BOYO coins
- BOYOWORLD Banshees logo, soundtrack and graffiti landmark
- Five visually distinct districts
- **Cinematic opening camera**: 4.2 s slightly elevated street-wide-to-follow ease (cubic); immediate for reduced motion

## Audio

- **Unified proximity arbitration**: exactly one audible source across landscape video, TikTok Alley and Banshees. A frame-rate-independent curve is near-full ≤8 units and silent ≥60; 4-unit hysteresis stabilizes switching. The active decoder stays playing off-camera while visuals are capped at two additional nearby/in-view sources.
- Pause / fail / reward / menu silence and pause all sources; resume restores behaviour.
- Enemy crowd LOD hard-caps full geometry and facial detail, so close mobs cannot multiply draw calls without limit.

## Character

BOYO uses a procedural 3D knitted balaclava with bump detail, eye/mouth openings, visible eyes/skin, the exact BOYO cheek mark and existing solid-black Welsh dragon asset. BOYO is visibly mounted on a detailed wooden toy horse rooted to the stable movement/collision group. A procedural `CanvasTexture` drives the horse's grain, bump and roughness response; carved anatomy, jointed legs/knees, neck/head, mane, tail, saddle, bridle, reins, stirrup straps, metal stirrups, Welsh-red cloth, glass eyes and brass trim carry the silhouette.

Horse and rider move as one articulated rig: restrained idle breathing, four-beat gait, rider counter-motion, turn lean, dash crouch and tail/head follow-through. Reduced motion keeps essential locomotion while minimizing amplitude.

## Enemies

Fifty uniquely named surreal humanoids retain their health, targets and combat timing. Their **anatomical proportions** include two-part jointed limbs (thigh/knee, upper-arm/elbow), shoulder spheres, neck cylinder, collar torus, belt box and shoes. Faces retain sclera, pupils, brows, nose and mouth. Procedural woven maps add cloth grain and bump to layered streetwear; physical surfaces remain restrained rather than plastic. Gait now varies by body, with knee/elbow follow-through, lean, head bob and visible recoil. Reduced-motion handling, labels, collision and hit response remain intact.

## Motion

Movement conveys state. Respect reduced motion by removing decorative camera shake, particles, scrolling marquees, portal motion and tile choreography while preserving essential game movement. Cinematic intro skips immediately.

Mobile entry is one tap: cabinet fullscreen plus an optional landscape lock, with a MOVE/TURN toggle, FIRE button and persistent top-right exit. Unsupported fullscreen/orientation APIs fall back to a fixed full-window cabinet.

Victory owns the camera for 3.6 seconds: mounted rear, full 360-degree orbit, then a leap toward screen. Reduced motion receives a short static acknowledgement. Canvas labels use a shared padded display-font fit helper, and wayfinding combines district road bands, intersection arrows and a compact minimap legend.

Every enemy defeat replaces the BOYO-anchored comic bubble with a phrase for 1.5–2 seconds. It scales/fades in standard motion, changes without decorative animation in reduced mode, and mirrors the phrase into the accessible live announcement. Bulk debug defeats use the same path.

## Reward

The win state remains inside the cabinet, requests audible official-video autoplay, and adds a scratch-to-reveal placeholder 15% merch code.
