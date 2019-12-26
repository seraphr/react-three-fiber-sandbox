import { extend, ReactThreeFiber, useThree } from 'react-three-fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PerspectiveCamera, ArrayCamera } from 'three';
import React from 'react';

extend({ OrbitControls })

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IntrinsicElements {
            orbitControls: ReactThreeFiber.Node<OrbitControls, typeof OrbitControls>
        }
    }
}


export const CameraControl: React.FC = () => {
  const { camera, gl } = useThree();
  const isArrayCamera = (item: any): item is ArrayCamera => item.isArrayCamera;

  const cameras = isArrayCamera(camera) ? camera.cameras : [camera]

  return <>
    {cameras.map(c => {
      return <orbitControls
          args={[c, gl.domElement]}
          maxPolarAngle={Math.PI * 17 / 36}
          screenSpacePanning={true}
      />
    })}
  </>
}