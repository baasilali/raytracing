"use client"

import { useRef, useState, useMemo, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import {
  OrbitControls,
  PivotControls,
  useHelper,
  Stats,
  Environment,
  AccumulativeShadows,
  RandomizedLight,
  BakeShadows,
} from "@react-three/drei"
import * as THREE from "three"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RaytracingEnvironment() {
  const [rayCount, setRayCount] = useState(20)
  const [rayLength, setRayLength] = useState(10)
  const [showReflections, setShowReflections] = useState(true)
  const [showRefractions, setShowRefractions] = useState(false)
  const [paused, setPaused] = useState(false)
  const [objectControlsEnabled, setObjectControlsEnabled] = useState(true)
  const [lightControlsEnabled, setLightControlsEnabled] = useState(true)
  const [realisticMode, setRealisticMode] = useState(false)

  return (
    <div className="w-full h-screen relative">
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
        <color attach="background" args={[realisticMode ? "#000510" : "#111"]} />
        {realisticMode ? <fog attach="fog" args={["#000510", 10, 50]} /> : <fog attach="fog" args={["#111", 10, 30]} />}

        {/* Base ambient light */}
        <ambientLight intensity={realisticMode ? 0.1 : 0.3} />

        {/* Environment lighting for realistic mode */}
        {realisticMode && (
          <>
            <Environment preset="night" />
            <BakeShadows />
          </>
        )}

        {/* Directional light for general scene illumination */}
        <directionalLight
          position={[5, 5, 5]}
          intensity={realisticMode ? 0.2 : 0.7}
          castShadow={realisticMode}
          shadow-mapSize={[1024, 1024]}
        />

        <Scene
          rayCount={rayCount}
          rayLength={rayLength}
          showReflections={showReflections}
          showRefractions={showRefractions}
          paused={paused}
          objectControlsEnabled={objectControlsEnabled}
          lightControlsEnabled={lightControlsEnabled}
          realisticMode={realisticMode}
        />

        <OrbitControls makeDefault />
        <Stats position="top-right" />
      </Canvas>

      <Card className="absolute top-4 left-4 p-4 bg-black/70 text-white w-72 space-y-4">
        <h2 className="text-lg font-bold">Raytracing Controls</h2>

        <Tabs defaultValue="rays">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="rays">Ray Settings</TabsTrigger>
            <TabsTrigger value="controls">Controls</TabsTrigger>
            <TabsTrigger value="display">Display</TabsTrigger>
          </TabsList>

          <TabsContent value="rays" className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="ray-count">Ray Count: {rayCount}</Label>
              </div>
              <Slider
                id="ray-count"
                min={5}
                max={50}
                step={1}
                value={[rayCount]}
                onValueChange={(value) => setRayCount(value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="ray-length">Ray Length: {rayLength}</Label>
              </div>
              <Slider
                id="ray-length"
                min={5}
                max={20}
                step={1}
                value={[rayLength]}
                onValueChange={(value) => setRayLength(value[0])}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="reflections" checked={showReflections} onCheckedChange={setShowReflections} />
              <Label htmlFor="reflections">Show Reflections</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="refractions" checked={showRefractions} onCheckedChange={setShowRefractions} />
              <Label htmlFor="refractions">Show Refractions</Label>
            </div>

            <Button variant={paused ? "default" : "secondary"} onClick={() => setPaused(!paused)}>
              {paused ? "Resume" : "Pause"} Simulation
            </Button>
          </TabsContent>

          <TabsContent value="controls" className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="object-controls-enabled"
                checked={objectControlsEnabled}
                onCheckedChange={setObjectControlsEnabled}
              />
              <Label htmlFor="object-controls-enabled">Enable Object Controls</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="light-controls-enabled"
                checked={lightControlsEnabled}
                onCheckedChange={setLightControlsEnabled}
              />
              <Label htmlFor="light-controls-enabled">Enable Light Source Controls</Label>
            </div>
          </TabsContent>

          <TabsContent value="display" className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="realistic-mode" checked={realisticMode} onCheckedChange={setRealisticMode} />
              <Label htmlFor="realistic-mode">Realistic Mode</Label>
            </div>
            <p className="text-xs text-gray-400">
              {realisticMode
                ? "Showing realistic lighting and shadows. Move objects to see how light interacts with them."
                : "Showing ray visualization. Toggle to see realistic lighting effects."}
            </p>
          </TabsContent>
        </Tabs>
      </Card>

      <div className="absolute bottom-4 left-4 p-4 bg-black/70 text-white rounded-md">
        <p>🔄 Grab the colored handles to move objects and light</p>
        <p>💡 Move the light source to see different {realisticMode ? "lighting effects" : "ray patterns"}</p>
        <p>🖱️ Use mouse wheel to zoom in/out</p>
        <p>👆 Right-click and drag to rotate view</p>
      </div>
    </div>
  )
}

// Lightbulb model for realistic mode
function Lightbulb({ position }) {
  return (
    <group position={position}>
      {/* Bulb glass */}
      <mesh castShadow>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshPhysicalMaterial
          color="#fffaea"
          emissive="#fffaea"
          emissiveIntensity={1}
          transparent
          opacity={0.9}
          roughness={0}
          transmission={0.9}
        />
      </mesh>

      {/* Bulb base */}
      <mesh position={[0, -0.4, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.15, 0.2, 16]} />
        <meshStandardMaterial color="#aaa" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Bulb socket */}
      <mesh position={[0, -0.6, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.2, 16]} />
        <meshStandardMaterial color="#333" metalness={0.5} roughness={0.7} />
      </mesh>
    </group>
  )
}

function Scene({
  rayCount,
  rayLength,
  showReflections,
  showRefractions,
  paused,
  objectControlsEnabled,
  lightControlsEnabled,
  realisticMode,
}) {
  const raySource = useRef()
  const sphere = useRef()
  const cube = useRef()
  const floor = useRef()
  const glass = useRef()
  const lightGroup = useRef()
  const pointLight = useRef()

  // Create a light helper for visualization (only in non-realistic mode)
  useHelper(!realisticMode && raySource.current ? raySource : null, THREE.SpotLightHelper, "white")

  // Rays state
  const [rays, setRays] = useState([])
  const [reflectedRays, setReflectedRays] = useState([])
  const [refractedRays, setRefractedRays] = useState([])

  // Raycaster for intersection detection
  const raycaster = useMemo(() => new THREE.Raycaster(), [])

  // Cast rays and calculate intersections (only in non-realistic mode)
  useFrame(() => {
    if (paused || realisticMode) return

    const newRays = []
    const newReflectedRays = []
    const newRefractedRays = []

    // Origin of rays
    const origin = new THREE.Vector3()
    raySource.current.getWorldPosition(origin)

    // Cast rays in different directions
    for (let i = 0; i < rayCount; i++) {
      // Calculate ray direction (in a cone shape)
      const angle = (i / rayCount) * Math.PI * 2
      const spread = 0.3
      const direction = new THREE.Vector3(Math.sin(angle) * spread, -1, Math.cos(angle) * spread).normalize()

      // Set up raycaster
      raycaster.set(origin, direction)

      // Find intersections
      const intersects = raycaster.intersectObjects([sphere.current, cube.current, floor.current, glass.current])

      // Store ray data
      const rayEnd = origin.clone().add(direction.clone().multiplyScalar(rayLength))

      if (intersects.length > 0) {
        const intersection = intersects[0]
        const hitPoint = intersection.point

        // Primary ray from source to hit point
        newRays.push({
          start: origin.clone(),
          end: hitPoint.clone(),
          color: new THREE.Color(0xffffff),
        })

        // Calculate reflected ray if enabled
        if (showReflections) {
          const normal = intersection.face.normal.clone()
          // Transform normal to world space
          normal.transformDirection(intersection.object.matrixWorld)

          // Calculate reflection direction
          const reflectionDirection = direction.clone().reflect(normal).normalize()

          // Determine reflection strength based on material
          let reflectionStrength = 0
          if (intersection.object === sphere.current) {
            reflectionStrength = 0.9 // Highly reflective
          } else if (intersection.object === cube.current) {
            reflectionStrength = 0.3 // Less reflective
          } else if (intersection.object === floor.current) {
            reflectionStrength = 0.1 // Barely reflective
          }

          if (reflectionStrength > 0) {
            const reflectedEnd = hitPoint
              .clone()
              .add(reflectionDirection.clone().multiplyScalar(rayLength * reflectionStrength))

            newReflectedRays.push({
              start: hitPoint.clone(),
              end: reflectedEnd,
              color: new THREE.Color(0x00ffff),
            })
          }
        }

        // Calculate refracted ray if enabled and hitting glass
        if (showRefractions && intersection.object === glass.current) {
          const normal = intersection.face.normal.clone()
          normal.transformDirection(intersection.object.matrixWorld)

          // Simple approximation of refraction
          const refractionDirection = direction.clone().add(normal.clone().multiplyScalar(-0.5)).normalize()

          const refractedEnd = hitPoint.clone().add(refractionDirection.clone().multiplyScalar(rayLength * 0.7))

          newRefractedRays.push({
            start: hitPoint.clone(),
            end: refractedEnd,
            color: new THREE.Color(0xff00ff),
          })
        }
      } else {
        // No intersection, draw full ray
        newRays.push({
          start: origin.clone(),
          end: rayEnd,
          color: new THREE.Color(0xffffff),
        })
      }
    }

    setRays(newRays)
    setReflectedRays(newReflectedRays)
    setRefractedRays(newRefractedRays)
  })

  // Update point light position to match ray source
  useFrame(() => {
    if (realisticMode && pointLight.current && raySource.current) {
      const lightPos = new THREE.Vector3()
      raySource.current.getWorldPosition(lightPos)
      pointLight.current.position.copy(lightPos)
    }
  })

  return (
    <>
      {/* Ray source with PivotControls */}
      {lightControlsEnabled ? (
        <PivotControls
          scale={1.5}
          autoTransform={true}
          anchor={[0, 0, 0]}
          lineWidth={2}
          activeAxes={[true, true, true]}
          depthTest={false}
          axisColors={["#ff2060", "#20df80", "#2080ff"]}
        >
          <group ref={lightGroup} position={[0, 5, 0]}>
            {realisticMode ? (
              // Realistic light source
              <>
                <pointLight
                  ref={pointLight}
                  intensity={5}
                  distance={20}
                  decay={2}
                  castShadow
                  shadow-mapSize={[1024, 1024]}
                />
                <Lightbulb />
              </>
            ) : (
              // Ray visualization light source
              <>
                <spotLight ref={raySource} intensity={0.5} angle={0.3} penumbra={0.5} castShadow />
                {/* Visual indicator for the light source */}
                <mesh>
                  <sphereGeometry args={[0.2, 16, 16]} />
                  <meshBasicMaterial color="#ffff00" />
                </mesh>
              </>
            )}
          </group>
        </PivotControls>
      ) : (
        <group ref={lightGroup} position={[0, 5, 0]}>
          {realisticMode ? (
            // Realistic light source
            <>
              <pointLight
                ref={pointLight}
                intensity={5}
                distance={20}
                decay={2}
                castShadow
                shadow-mapSize={[1024, 1024]}
              />
              <Lightbulb />
            </>
          ) : (
            // Ray visualization light source
            <>
              <spotLight ref={raySource} intensity={0.5} angle={0.3} penumbra={0.5} castShadow />
              {/* Visual indicator for the light source */}
              <mesh>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshBasicMaterial color="#ffff00" />
              </mesh>
            </>
          )}
        </group>
      )}

      {/* Accumulative shadows for realistic mode */}
      {realisticMode && (
        <AccumulativeShadows
          temporal
          frames={100}
          color="#000000"
          colorBlend={0.5}
          toneMapped={true}
          alphaTest={0.65}
          opacity={1}
          scale={20}
          position={[0, -0.09, 0]}
        >
          <RandomizedLight amount={4} radius={10} ambient={0.5} intensity={1} position={[0, 5, 0]} bias={0.001} />
        </AccumulativeShadows>
      )}

      {/* Objects with PivotControls for dragging */}
      {objectControlsEnabled ? (
        <PivotControls
          scale={1}
          autoTransform={true}
          anchor={[0, 0, 0]}
          lineWidth={2}
          activeAxes={[true, true, true]}
          depthTest={false}
        >
          <mesh ref={sphere} position={[-2, 1, 0]} castShadow receiveShadow>
            <sphereGeometry args={[1, 32, 32]} />
            {realisticMode ? (
              <meshStandardMaterial color="#2196f3" metalness={0.9} roughness={0.1} envMapIntensity={1} />
            ) : (
              <meshStandardMaterial color="#2196f3" metalness={0.9} roughness={0.1} />
            )}
          </mesh>
        </PivotControls>
      ) : (
        <mesh ref={sphere} position={[-2, 1, 0]} castShadow receiveShadow>
          <sphereGeometry args={[1, 32, 32]} />
          {realisticMode ? (
            <meshStandardMaterial color="#2196f3" metalness={0.9} roughness={0.1} envMapIntensity={1} />
          ) : (
            <meshStandardMaterial color="#2196f3" metalness={0.9} roughness={0.1} />
          )}
        </mesh>
      )}

      {objectControlsEnabled ? (
        <PivotControls
          scale={1}
          autoTransform={true}
          anchor={[0, 0, 0]}
          lineWidth={2}
          activeAxes={[true, true, true]}
          depthTest={false}
        >
          <mesh ref={cube} position={[2, 1, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.5, 1.5, 1.5]} />
            {realisticMode ? (
              <meshStandardMaterial color="#e91e63" metalness={0.1} roughness={0.8} envMapIntensity={0.5} />
            ) : (
              <meshStandardMaterial color="#e91e63" metalness={0.1} roughness={0.8} />
            )}
          </mesh>
        </PivotControls>
      ) : (
        <mesh ref={cube} position={[2, 1, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          {realisticMode ? (
            <meshStandardMaterial color="#e91e63" metalness={0.1} roughness={0.8} envMapIntensity={0.5} />
          ) : (
            <meshStandardMaterial color="#e91e63" metalness={0.1} roughness={0.8} />
          )}
        </mesh>
      )}

      {objectControlsEnabled ? (
        <PivotControls
          scale={1}
          autoTransform={true}
          anchor={[0, 0, 0]}
          lineWidth={2}
          activeAxes={[true, true, true]}
          depthTest={false}
        >
          <mesh ref={glass} position={[0, 1.5, 2]} castShadow receiveShadow>
            <dodecahedronGeometry args={[1]} />
            {realisticMode ? (
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
            ) : (
              <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.1} transparent opacity={0.5} />
            )}
          </mesh>
        </PivotControls>
      ) : (
        <mesh ref={glass} position={[0, 1.5, 2]} castShadow receiveShadow>
          <dodecahedronGeometry args={[1]} />
          {realisticMode ? (
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
          ) : (
            <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.1} transparent opacity={0.5} />
          )}
        </mesh>
      )}

      <mesh ref={floor} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        {realisticMode ? (
          <meshStandardMaterial color="#333333" metalness={0.1} roughness={0.8} envMapIntensity={0.5} />
        ) : (
          <meshStandardMaterial color="#333333" metalness={0.1} roughness={0.8} />
        )}
      </mesh>

      {/* Visualize rays - only in non-realistic mode */}
      {!realisticMode &&
        rays.map((ray, i) => <Ray key={`ray-${i}`} start={ray.start} end={ray.end} color={ray.color} />)}

      {/* Visualize reflected rays - only in non-realistic mode */}
      {!realisticMode &&
        showReflections &&
        reflectedRays.map((ray, i) => <Ray key={`reflected-${i}`} start={ray.start} end={ray.end} color={ray.color} />)}

      {/* Visualize refracted rays - only in non-realistic mode */}
      {!realisticMode &&
        showRefractions &&
        refractedRays.map((ray, i) => <Ray key={`refracted-${i}`} start={ray.start} end={ray.end} color={ray.color} />)}
    </>
  )
}

// Ray visualization component
function Ray({ start, end, color }) {
  const ref = useRef()

  useEffect(() => {
    if (ref.current) {
      const points = [start, end]
      ref.current.geometry.setFromPoints(points)
      ref.current.computeLineDistances()
    }
  }, [start, end])

  return (
    <line ref={ref}>
      <bufferGeometry />
      <lineBasicMaterial color={color} linewidth={1} />
    </line>
  )
}
