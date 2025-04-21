# Interactive 3D Raytracing Visualization

An interactive 3D raytracing visualization built with React Three Fiber that demonstrates light behavior through real-time ray casting, reflections, and refractions, featuring both a technical visualization mode showing individual light rays and a realistic rendering mode with physically accurate lighting and shadows.

## Demo

[Add your demo gif/video here]

```markdown
![Demo](path_to_your_demo.gif)
```

## Features

### Visualization Modes
- **Technical Mode**
  - Real-time visualization of light rays
  - Color-coded ray types:
    - White: Primary rays
    - Cyan: Reflections
    - Magenta: Refractions
  - Adjustable ray count (5-50 rays)
  - Configurable ray length (5-20 units)
  - Interactive ray source positioning

- **Realistic Mode**
  - Physical-based rendering
  - Dynamic shadows with accumulation
  - Environment lighting
  - Realistic material properties
  - Night environment preset

### Interactive Objects
- **Metallic Sphere**
  - High reflectivity (90% reflection strength)
  - Polished metal appearance
  - Dynamic position and rotation

- **Matte Cube**
  - Low reflectivity (30% reflection strength)
  - Rough surface properties
  - Transformable in 3D space

- **Glass Dodecahedron**
  - Transparent material
  - Refraction effects
  - High transmission (95%)
  - Realistic IOR (Index of Refraction)

### Controls
- **Camera**
  - Orbit controls for view rotation
  - Mouse wheel zoom
  - Right-click and drag rotation

- **Object Manipulation**
  - PivotControls for object transformation
  - Individual object control toggles
  - Light source position control

- **Ray Parameters**
  - Ray count slider (5-50)
  - Ray length adjustment (5-20)
  - Reflection toggle
  - Refraction toggle
  - Simulation pause/resume

## Technical Implementation

### Core Technologies
- React 18
- Three.js
- React Three Fiber
- React Three Drei
- TypeScript
- Tailwind CSS
- shadcn/ui components

### Light Simulation
```typescript
// Ray calculation example from implementation
const angle = (i / rayCount) * Math.PI * 2
const spread = 0.3
const direction = new THREE.Vector3(
  Math.sin(angle) * spread,
  -1,
  Math.cos(angle) * spread
).normalize()
```

### Material System
```typescript
// Example of glass material properties
<meshPhysicalMaterial
  color="#ffffff"
  metalness={0.1}
  roughness={0.05}
  transmission={0.95}
  transparent
  opacity={0.5}
  envMapIntensity={1}
  clearcoat={1}
  clearcoatRoughness={0.1}
  ior={1.5}
/>
```

## Performance Optimizations
- Conditional ray visualization
- Efficient geometry updates
- Object reference caching
- Type-safe implementation
- Accumulative shadows for realistic mode

## Getting Started

### Prerequisites
- Node.js
- npm/yarn

### Installation
```bash
# Clone the repository
git clone [your-repo-url]

# Install dependencies
npm install

# Start development server
npm run dev
```

### Usage
1. Open the application in your browser
2. Use the control panel on the left to adjust parameters:
   - Ray Count
   - Ray Length
   - Reflection/Refraction toggles
   - Mode switches
3. Interact with objects using the colored handles
4. Move the light source to see different ray patterns
5. Toggle between technical and realistic modes
