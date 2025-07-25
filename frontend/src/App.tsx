import './App.css'
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Edges } from '@react-three/drei'
import { MOUSE } from 'three'

// Helper function to convert inches to feet
const inchesToFeet = (inches: number) => inches / 12

// OUTER Dimensions in feet and inches
const OUTER_LENGTH_FEET = 53
const OUTER_LENGTH_INCHES = 0
const OUTER_WIDTH_FEET = 8
const OUTER_WIDTH_INCHES = 6
const OUTER_HEIGHT_FEET = 13
const OUTER_HEIGHT_INCHES = 6

// INNER Dimensions in feet and inches
const INNER_LENGTH_FEET = 52
const INNER_LENGTH_INCHES = 6
const INNER_WIDTH_FEET = 8
const INNER_WIDTH_INCHES = 2
const INNER_HEIGHT_FEET = 9
const INNER_HEIGHT_INCHES = 0

// Convert to total feet
const OUTER_LENGTH_TOTAL_FEET = OUTER_LENGTH_FEET + inchesToFeet(OUTER_LENGTH_INCHES)
const OUTER_WIDTH_TOTAL_FEET = OUTER_WIDTH_FEET + inchesToFeet(OUTER_WIDTH_INCHES)
const OUTER_HEIGHT_TOTAL_FEET = OUTER_HEIGHT_FEET + inchesToFeet(OUTER_HEIGHT_INCHES)

const INNER_LENGTH_TOTAL_FEET = INNER_LENGTH_FEET + inchesToFeet(INNER_LENGTH_INCHES)
const INNER_WIDTH_TOTAL_FEET = INNER_WIDTH_FEET + inchesToFeet(INNER_WIDTH_INCHES)
const INNER_HEIGHT_TOTAL_FEET = INNER_HEIGHT_FEET + inchesToFeet(INNER_HEIGHT_INCHES)

function GridOfCubes() {
  // Create a single wireframe box that represents the entire rectangular prism
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[OUTER_LENGTH_TOTAL_FEET, OUTER_HEIGHT_TOTAL_FEET, OUTER_WIDTH_TOTAL_FEET]} />
      <meshStandardMaterial color="black" transparent opacity={0.1} />
      <Edges color="black" />
    </mesh>
  )
}

function InnerBox() {
  // Centered at the origin
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[INNER_LENGTH_TOTAL_FEET, INNER_HEIGHT_TOTAL_FEET, INNER_WIDTH_TOTAL_FEET]} />
      <meshStandardMaterial color="gray" transparent opacity={0.3} />
      <Edges color="black" />
    </mesh>
  );
}

function InnerInchGrid() {
  const gridSpacing = 4 // 4 feet = 4 units
  // Calculate grid dimensions with 4-foot spacing
  const gridX = Math.floor(INNER_LENGTH_TOTAL_FEET / 4)
  const gridY = Math.floor(INNER_HEIGHT_TOTAL_FEET / 4)
  const gridZ = Math.floor(INNER_WIDTH_TOTAL_FEET / 4)
  // OPTION 2: Sparse grid with step = 1
  const gridBoxes = []
  const step = 1 // Show every grid line
  for (let x = 0; x < gridX; x += step) {
    for (let y = 0; y < gridY; y += step) {
      for (let z = 0; z < gridZ; z += step) {
        gridBoxes.push(
          <mesh
            key={`grid-${x}-${y}-${z}`}
            position={[
              (x - (gridX - 1) / 2) * gridSpacing,
              (y - (gridY - 1) / 2) * gridSpacing,
              (z - (gridZ - 1) / 2) * gridSpacing,
            ]}
          >
            <boxGeometry args={[gridSpacing, gridSpacing, gridSpacing]} />
            <meshStandardMaterial transparent opacity={0} />
            <Edges color="brown" opacity={1.0} />
          </mesh>
        )
      }
    }
  }
  return <>{gridBoxes}</>
}

function SimplePrism({ length = OUTER_LENGTH_TOTAL_FEET, width = OUTER_WIDTH_TOTAL_FEET, height = OUTER_HEIGHT_TOTAL_FEET }) {
  // Centered at the origin
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[length, height, width]} />
      <meshStandardMaterial color="gray" transparent opacity={0.1} />
      <Edges color="black" />
    </mesh>
  );
}

function TruckUI({ onUpdate }: { onUpdate: (l: number, w: number, h: number) => void }) {
  const [length, setLength] = useState(OUTER_LENGTH_TOTAL_FEET);
  const [width, setWidth] = useState(OUTER_WIDTH_TOTAL_FEET);
  const [height, setHeight] = useState(OUTER_HEIGHT_TOTAL_FEET);

  return (
    <div style={{
      position: 'absolute',
      top: 20,
      left: 20,
      background: 'rgba(255,255,255,0.95)',
      borderRadius: 8,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      padding: 16,
      zIndex: 10,
      minWidth: 180
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Truck</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <label>
          L: <input type="number" step="0.1" value={length} onChange={e => setLength(Number(e.target.value))} style={{ width: 60 }} />
        </label>
        <label>
          W: <input type="number" step="0.1" value={width} onChange={e => setWidth(Number(e.target.value))} style={{ width: 60 }} />
        </label>
        <label>
          H: <input type="number" step="0.1" value={height} onChange={e => setHeight(Number(e.target.value))} style={{ width: 60 }} />
        </label>
        <button onClick={() => onUpdate(length, width, height)} style={{ marginTop: 8, padding: '4px 12px', borderRadius: 4, border: '1px solid #888', background: '#eee', cursor: 'pointer' }}>Update</button>
      </div>
    </div>
  );
}

const App = () => {
  const [prismDims, setPrismDims] = useState({
    length: OUTER_LENGTH_TOTAL_FEET,
    width: OUTER_WIDTH_TOTAL_FEET,
    height: OUTER_HEIGHT_TOTAL_FEET
  });

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <TruckUI onUpdate={(l, w, h) => setPrismDims({ length: l, width: w, height: h })} />
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <SimplePrism length={prismDims.length} width={prismDims.width} height={prismDims.height} />
        <InnerBox />
        <InnerInchGrid />
        <OrbitControls
          mouseButtons={{
            LEFT: MOUSE.PAN,
            MIDDLE: MOUSE.DOLLY,
            RIGHT: MOUSE.ROTATE,
          }}
          minDistance={50}
          maxDistance={60}
          enablePan={false}
        />
      </Canvas>
      {/* <GridOfCubes />
      <SimplePrism /> Uncomment to show the 10' x 8'6" x 13'6" prism */}
      {/* <KeiTruck position={[0, 0, 0]} /> */}
    </div>
  );
}

export default App
