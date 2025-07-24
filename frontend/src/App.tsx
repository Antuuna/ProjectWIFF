import './App.css'
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
  // Create the inner rectangular prism centered within the outer one
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[INNER_LENGTH_TOTAL_FEET, INNER_HEIGHT_TOTAL_FEET, INNER_WIDTH_TOTAL_FEET]} />
      <meshStandardMaterial color="gray" transparent opacity={0.3} />
      <Edges color="black" />
    </mesh>
  )
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

// Simple 10' x 8'6" x 13'6" prism
// const PRISM_LENGTH_FEET = 10
// const PRISM_WIDTH_FEET = 8
// const PRISM_WIDTH_INCHES = 6
// const PRISM_HEIGHT_FEET = 13
// const PRISM_HEIGHT_INCHES = 6
// const PRISM_WIDTH_TOTAL_FEET = PRISM_WIDTH_FEET + inchesToFeet(PRISM_WIDTH_INCHES)
// const PRISM_HEIGHT_TOTAL_FEET = PRISM_HEIGHT_FEET + inchesToFeet(PRISM_HEIGHT_INCHES)
// function SimplePrism() {
//   // Center at half its height so bottom is at y=0
//   return (
//     <mesh position={[0, PRISM_HEIGHT_TOTAL_FEET / 2, 0]}>
//       <boxGeometry args={[PRISM_LENGTH_FEET, PRISM_HEIGHT_TOTAL_FEET, PRISM_WIDTH_TOTAL_FEET]} />
//       <meshStandardMaterial color="gray" transparent opacity={0.1} />
//       <Edges color="black" />
//     </mesh>
//   );
// }

// // Trailer dimensions
// const TRAILER_LENGTH_FEET = 28;
// const TRAILER_WIDTH_FEET = 8;
// const TRAILER_WIDTH_INCHES = 6;
// const TRAILER_HEIGHT_FEET = 2;
// const TRAILER_HEIGHT_INCHES = 0;

// const TRAILER_WIDTH_TOTAL_FEET = TRAILER_WIDTH_FEET + inchesToFeet(TRAILER_WIDTH_INCHES);
// const TRAILER_HEIGHT_TOTAL_FEET = TRAILER_HEIGHT_FEET + inchesToFeet(TRAILER_HEIGHT_INCHES);

// function TrailerPrism() {
//   // Center at half its height so bottom is at y=0
//   return (
//     <mesh position={[19, TRAILER_HEIGHT_TOTAL_FEET / 2, 0]}>
//       <boxGeometry args={[TRAILER_LENGTH_FEET, TRAILER_HEIGHT_TOTAL_FEET, TRAILER_WIDTH_TOTAL_FEET]} />
//       <meshStandardMaterial color="gray" transparent opacity={0.2} />
//       <Edges color="red" />
//     </mesh>
//   );
// }

/*
function KeiTruck({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      <SimplePrism />
      <TrailerPrism />
    </group>
  );
}
*/

const App = () => {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <GridOfCubes />
      <InnerBox />
      <InnerInchGrid />
      {/* <SimplePrism /> Uncomment to show the 10' x 8'6" x 13'6" prism */}
      {/* <KeiTruck position={[0, 0, 0]} /> */}
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
  );
}

export default App
