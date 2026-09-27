# NO IDEA

**NO IDEA** is an interactive workspace for turning unfinished thoughts into validated projects, finding the right collaborators, and building together.

The landing page presents that journey as a navigable 3D idea universe rather than a conventional marketing page. It combines React, Three.js, React Three Fiber, animated spatial objects, developer constellations, and a black-hole-inspired idea ecosystem.

## Highlights

- Interactive 3D Idea Universe landing page.
- Movable geometric star field with pointer parallax and drag interaction.
- Scroll-aware landing sections for the idea journey, ecosystem, people, and team.
- Interactive Rover assistant orb with state transitions.
- Developer constellation with touch-friendly selection and animated comet-like objects.
- Black-hole ecosystem object with:
  - Gravitational lensing glow and distortion layers.
  - Animated accretion disk and plasma particles.
  - Click-to-absorb particle streams.
- Ambient space soundscape controlled by the user:
  - Deep space nebula drone.
  - Pulsar beat.
  - Cosmic winds.
  - Sound off.
- Guided and free-flight camera modes for the universe and black-hole scenes.
- Responsive layout for desktop and mobile screens.
- Team cards with LinkedIn links and contribution details.
- Authenticated product routes for ideas, workspaces, Rover, developers, agreements, and notifications.

## Tech stack

- **Frontend:** React 19, TypeScript, Vite
- **3D:** Three.js, React Three Fiber, `@react-three/drei`
- **Routing:** Wouter
- **UI:** Radix UI, Tailwind CSS, Lucide React
- **Server:** Express, bundled with esbuild
- **Validation:** TypeScript compiler and Vite production build
- **Deployment:** Vercel-compatible configuration

## Requirements

- Node.js 20 or newer
- pnpm 10+
- A modern browser with WebGL support for the 3D scenes

## Getting started

Clone the repository and install dependencies:

```bash
git clone https://github.com/Farooqulus/no-idea.git
cd no-idea
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Vite starts the application on its default development port. The `--host` flag is already included in the project script, so the server can be accessed from another device on the same network when the environment allows it.

Open the local URL shown by Vite, usually:

```text
http://localhost:5173
```

## Available scripts

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the Vite development server. |
| `pnpm check` | Run TypeScript validation without emitting files. |
| `pnpm build` | Build the frontend and bundle the Express server. |
| `pnpm start` | Start the bundled production server. |
| `pnpm preview` | Preview the Vite production output locally. |
| `pnpm format` | Format the project with Prettier. |

Recommended validation before opening a pull request:

```bash
pnpm check
pnpm build
```

## Landing page controls

### 3D background

- Move the pointer across the page for subtle parallax.
- Drag across the page to rotate and tilt the geometric space field.
- Use the camera control to switch between guided movement and free camera mode.
- In free camera mode, drag to orbit, zoom to move through the scene, and pan when supported.

### Audio

The audio control cycles through the available ambient presets. Audio is intentionally user-activated to respect browser autoplay policies.

1. Sound off
2. Deep space nebula drone
3. Pulsar beat
4. Cosmic winds

The soundscape is generated with the Web Audio API and does not require an external audio file.

### Ecosystem black hole

- Hover or touch the event horizon to intensify the lensing response.
- Click the black hole to pull the surrounding particles into its center.
- Use the shared camera mode control to orbit, zoom, and pan around the object.

### People and team

- Select developer comets in the People section to inspect a signal.
- Touch a team member card to open their LinkedIn profile in a new tab.

## Project structure

```text
client/
  src/
    components/
      BlackHoleObject.tsx       # Lensing black-hole scene and particle absorption
      DeveloperConstellation.tsx# Interactive developer comet field
      IdeaUniverse.tsx           # Hero 3D idea universe
      PageTransition.tsx         # Route/page transition wrapper
      RoverOrb.tsx               # Floating Rover assistant orb
      SpaceField.tsx             # Global star field, geometry, audio, camera controls
    pages/
      Home.tsx                   # Interactive landing page
      Developers.tsx             # Developer discovery page
      ...                        # Product routes
    services/
      collaboration.ts           # Developer and collaboration models
    index.css                    # Global visual system and landing styles
server/
  index.ts                       # Express server entrypoint
shared/
  const.ts                       # Shared constants
vercel.json                      # Vercel build and SPA rewrite configuration
```

## Application routes

The current application includes these primary routes:

- `/` — Interactive landing page
- `/login` — Sign in
- `/dashboard` — Workspace dashboard
- `/ideas` — Ideas index
- `/ideas/new` — Idea creation flow
- `/developers` — Developer discovery
- `/developers/:id` — Developer profile
- `/workspaces` — Collaboration workspaces
- `/agreements` — Agreements
- `/notifications` — Notifications
- `/rover` — Rover workspace
- `/profile` — Profile placeholder
- `/settings` — Settings placeholder

## Deployment

The repository includes `vercel.json` with the following deployment behavior:

- Build command: `pnpm build`
- Frontend output directory: `dist/public`
- SPA rewrite: all paths are served through `index.html`

To deploy with Vercel:

1. Import `Farooqulus/no-idea` into Vercel.
2. Keep the detected build command or set it to `pnpm build`.
3. Set the output directory to `dist/public` if it is not detected automatically.
4. Deploy.

For a traditional Node deployment:

```bash
pnpm install
pnpm build
pnpm start
```

## Accessibility and performance notes

- Audio starts only after explicit user interaction.
- The 3D layer is decorative and the page content remains available as regular HTML.
- Reduced-motion preferences are respected in the CSS interaction layer.
- Three.js pixel density is capped through the React Three Fiber canvas configuration.
- The application should be tested on both WebGL-capable desktop browsers and touch devices.

## Contributing

1. Create a feature branch from `main`.
2. Make the smallest focused change possible.
3. Run `pnpm check` and `pnpm build`.
4. Test the affected route in a browser, including touch or keyboard behavior where relevant.
5. Open a pull request with a short description of the interaction or product change.

## License

This project is licensed under the MIT License.
