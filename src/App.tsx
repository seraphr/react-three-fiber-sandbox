import React, { useRef } from 'react';
import logo from './logo.svg';
import { Canvas, useFrame } from 'react-three-fiber'
import './App.css';
import { Mesh } from 'three';

function Thing() {
  const ref = useRef<Mesh>(null)
  useFrame(() => {
    if (ref !== null && ref.current !== null){
      ref.current.rotation.x = ref.current.rotation.y += 0.01
    }
  })
  return (
    <mesh
      ref={ref}
      onClick={e => console.log('click')}
      onPointerOver={e => console.log('hover')}
      onPointerOut={e => console.log('unhover')}>
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshNormalMaterial attach="material" />
    </mesh>
  )
}

const App: React.FC = () => {
  return (
    <div className="App">
      <Canvas>
        <Thing />
      </Canvas>
    </div>
  );
}

export default App;
