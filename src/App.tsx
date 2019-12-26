import React, { useRef, useEffect } from 'react';
import logo from './logo.svg';
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import './App.css';
import { Mesh, PerspectiveCamera, ArrayCamera } from 'three';
import * as THREE from 'three'
import { MultiCameraRaycaster } from './MultiCameraRaycaster';
import { CameraControl } from './OrbitControl';

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
      console.log(`setDefaultCamera ${JSON.stringify(ref.current)}  cameras=${JSON.stringify(ref.current.cameras)}`)
      // この視野角によって、レンダラ上の描画領域が決定されるので、とりあえず広げておく
      ref.current.fov = 180
      setDefaultCamera(ref.current)
    }
  }, [setDefaultCamera])

  useFrame(() => {
    if(ref.current !== null) {
      ref.current.updateMatrixWorld()
      for (const c of ref.current.cameras) {
        c.updateProjectionMatrix()
        c.updateMatrixWorld()
      }
    }
    
  })

  const camera = new THREE.ArrayCamera(subcameras)

  return (
    <arrayCamera ref={ref} cameras={subcameras} />
    // <primitive ref={ref} object={subcameras[1]}/>
    // <perspectiveCamera ref={ref} position={subcameras[0].position}/>
  )
}

type PointProps = {
  x: number;
  y: number;
  z: number;
  radius?: number;
}

const Point3d: React.FC<PointProps> = (props: PointProps) => {
  const radius = props.radius || 1
  return (
    <mesh position={new THREE.Vector3(props.x, props.y, props.z)}>
      <sphereGeometry attach="geometry" args={[radius, 16, 16]} />
      <meshNormalMaterial attach="material"/>
    </mesh>
  )
}

function Thing() {
  const ref = useRef<Mesh>(null)
  useFrame(() => {
    if (ref !== null && ref.current !== null){
      ref.current.rotation.x = ref.current.rotation.y += 0.01
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
const range =
  (start: number, end: number) => Array.from({length: (end - start)}, (v, k) => k + start);
const App: React.FC = () => {
  const cameraProps = {
    cameras: [
      {
        left: 0.0,
        bottom: 0.5,
        width: 1.0,
        height: 0.5,
        background: new THREE.Color("red"),
        eye: [ 50, 50, 50 ] as [number, number, number],
        up: [0, 1, 0] as [number, number, number],
        fov: 90
      },
      {
        left: 0.0,
        bottom: 0.0,
        width: 1.0,
        height: 0.5,
        background: new THREE.Color("green"),
        eye: [ -50, 50, -50 ] as [number, number, number],
        up: [1, 0, 0] as [number, number, number],
        fov: 90
      },
    ]
  }

  const pointCount = 100
  const nextInt = (max: number) => Math.floor(Math.random() * max)
  const pointPoropss = range(0, pointCount).map((_) => {
    return {
      x: nextInt(20) - 10,
      y: nextInt(20) - 10,
      z: nextInt(20) - 10,
      radius: 1
    }
  })

  return (
      <Canvas>
        <CameraControl />
        <ambientLight intensity={1.0}/>
        <Thing />
        {pointPoropss.map((p) => <Point3d {...p} /> )}
        <ArrayCameraDom {...cameraProps}/>
      </Canvas>
  );
}

export default App;
