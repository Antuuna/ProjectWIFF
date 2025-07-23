import './App.css'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Edges } from '@react-three/drei'
import { MOUSE } from 'three'

const CUBES_X = 8
const CUBES_Y = 2
const CUBES_Z = 2

function GridOfCubes() {
  const cubes = []
  for (let x = 0; x < CUBES_X; x++) {
    for (let y = 0; y < CUBES_Y; y++) {
      for (let z = 0; z < CUBES_Z; z++) {
        // Only render cubes on the outer surface
        if (
          x === 0 || x === CUBES_X - 1 ||
          y === 0 || y === CUBES_Y - 1 ||
          z === 0 || z === CUBES_Z - 1
        ) {
          cubes.push(
            <mesh
              key={`${x}-${y}-${z}`}
              position={[
                x - (CUBES_X - 1) / 2,
                y - (CUBES_Y - 1) / 2,
                z - (CUBES_Z - 1) / 2,
              ]}
            >
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="orange" transparent opacity={0.1} />
              <Edges color="black" />
            </mesh>
          )
        }
      }
    }
  }
  return <>{cubes}</>
}

const App = () => {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {/* <gridHelper args={[20, 20]} /> */}
      <GridOfCubes />
      <OrbitControls
        mouseButtons={{
          LEFT: MOUSE.PAN,
          MIDDLE: MOUSE.DOLLY,
          RIGHT: MOUSE.ROTATE,
        }}
        minDistance={10}
        maxDistance={15}
        enablePan={false}
      />
    </Canvas>
  )
}

export default App
