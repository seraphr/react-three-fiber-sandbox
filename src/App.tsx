import React, { useRef, useEffect } from 'react';
import logo from './logo.svg';
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import './App.css';
import { Mesh, PerspectiveCamera, ArrayCamera } from 'three';
import * as THREE from 'three'

type CameraProps = {
  left: number;
  bottom: number;
  width: number;
  height: number;
  background: THREE.Color;
  eye: [number, number, number];
  up: [number, number, number];
  fov: number;
  // updateCamera: (camera: THREE.Camera, scene: THREE.Scene, x: number, y: number) => void;
}

type ArrayCameraProps = {
  // width: number;
  // height: number;
  cameras: Array<CameraProps>
}

const ArrayCameraDom: React.FC<ArrayCameraProps> = (props: ArrayCameraProps) => {
  const { size, scene, setDefaultCamera, gl } = useThree()
  const { width, height } = size
  console.log(`width=${width} height=${height}`)

  const subcameras = props.cameras.map((prop) => {
    const subWidth = Math.ceil(width * prop.width)
    const subHeight = Math.ceil(height * prop.height)
    const camera = new PerspectiveCamera(prop.fov, subWidth / subHeight)
    camera.position.fromArray(prop.eye)
    // 上方向を決めるらしいがよくわからん。 ドキュメントによると、lookAtに影響するらしい（どういうふうに影響するのかは書いていなかった・・・）
    camera.up.fromArray(prop.up)
    camera.lookAt(scene.position)

    const anyCamera = camera as any
    // anyCamera.toJSON = undefined
    anyCamera.viewport = new THREE.Vector4( prop.left * width, prop.bottom * height, subWidth, subHeight );
    camera.updateMatrixWorld()

    return camera
  })

  const ref = useRef<ArrayCamera>(null)
  useEffect(() => {
    if(ref.current !== null) {
      // ref.current.position.z = 5
      console.log(`setDefaultCamera ${JSON.stringify(ref.current)}  cameras=${JSON.stringify(ref.current.cameras)}`)
      setDefaultCamera(ref.current)
    }
  }, [setDefaultCamera])

  useFrame(() => {if(ref.current !== null) {ref.current.updateMatrixWorld()}})

  const camera = new THREE.ArrayCamera(subcameras)
  camera.position.z = 5

  return (
    <arrayCamera ref={ref} cameras={subcameras} />
    // <primitive ref={ref} object={camera}/>
    // <perspectiveCamera ref={ref} position={subcameras[0].position}/>
  )
}

function Thing() {
  const ref = useRef<Mesh>(null)
  useFrame(() => {
    if (ref !== null && ref.current !== null){
      // ref.current.rotation.x = ref.current.rotation.y += 0.01
    }
  })

  var materials = [
    new THREE.MeshLambertMaterial({color: 0x00ff00}),
    new THREE.MeshLambertMaterial({color: 0x008888}),
    new THREE.MeshLambertMaterial({color: 0x0000ff}),
    new THREE.MeshLambertMaterial({color: 0x880088}),
    new THREE.MeshLambertMaterial({color: 0xff0000}),
    new THREE.MeshLambertMaterial({color: 0x888800})
];
//MeshFaceMaterialで材質を宣言

  return (
    <mesh
      ref={ref}
      position={new THREE.Vector3(0, 0, 0)}
      onClick={e => console.log('click')}
      onPointerOver={e => console.log('hover')}
      onPointerOut={e => console.log('unhover')}
      material={materials}>
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
    </mesh>
  )
}

const App: React.FC = () => {
  const cameraProps = {
    cameras: [
      {
        left: 0.0,
        bottom: 0.0,
        width: 0.5,
        height: 1.0,
        background: new THREE.Color("red"),
        eye: [ 3, 3, 3 ] as [number, number, number],
        up: [0, 1, 0] as [number, number, number],
        fov: 45
      },
      {
        left: 0.5,
        bottom: 0.0,
        width: 0.5,
        height: 1.0,
        background: new THREE.Color("green"),
        eye: [ -3, 3, -3 ] as [number, number, number],
        up: [1, 0, 0] as [number, number, number],
        fov: 45
      },
    ]
  }

  return (
    <div className="App">
      <Canvas>
        <ambientLight intensity={1.0}/>
        <Thing />
        <ArrayCameraDom {...cameraProps}/>
      </Canvas>
    </div>
  );
}

export default App;
