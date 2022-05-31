import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {} from "@react-three/cannon";
import {
  Stats,
  PerspectiveCamera,
  PointerLockControls,
  FirstPersonControls,
  FlyControls,
  DeviceOrientationControls,
  useGLTF,
  useCamera
} from "@react-three/drei";
import { Spring, animated, useSpring } from "@react-spring/three";
import { EffectComposer, DepthOfField } from "@react-three/postprocessing";
import * as three from "three";
import "./styles.css";
import { Group, MeshToonMaterial, Vector2, Vector3 } from "three";
import shotSound from "./gun.mp3";

const Cube = () => {
  const { camera } = useThree();
  const posRef = useRef<Group>();
  const timeRef = useRef(0);
  const cube = useRef<three.Mesh>();
  const weapon = useGLTF("weapon.glb", true, false);
  const [active, setActive] = useState(false);
  const [sight, setSight] = useState(false);
  const { zoom } = useSpring({
    zoom: 1
  });

  const { x, p } = useSpring({
    x: active ? [0.05, 0, 0] : [0, 0, 0],
    p: active ? [0.01, 0, -4.5] : [-0.1, 0, -5],
    config: {
      tension: 380,
      friction: 20
    }
  });

  const { y } = useSpring({
    y: sight ? [0.1, -0.1, 1] : [1, 0, 1],
    config: {
      tension: 380,
      friction: 20
    }
  });
  useFrame(() => {
    // const offset = new Vector3(0, 0, 0);
    // const pos = offset.sub(camera.rotation);
    // posRef.current!.position.set(0, 0, 0);
    // posRef.current!.position.set(-pos.x, -pos.y, -pos.z);
    posRef.current!.position.set(0, 0, 5);
    posRef.current!.rotation.set(
      camera.rotation.x,
      camera.rotation.y,
      camera.rotation.z
    );
  });
  useEffect(() => {
    document.addEventListener("keydown", (event: Event) => {
      if (event.key === "q") {
        setSight(true);
        camera.zoom = 0.5;
      }
    });

    document.addEventListener("keyup", () => {
      setSight(false);
      // camera.zoom = 1;
    });

    document.addEventListener("pointerdown", (event: Event) => {
      event.preventDefault();
      clearInterval(timeRef.current);
      setActive(false);
      timeRef.current = setInterval(() => {
        // const shot = new Audio(shotSound);
        // shot.pause();
        // shot.currentTime = 0;
        // shot.volume = 1;
        // shot.loop = false;
        // shot.play();
        setActive((active) => !active);
      }, 50);
    });
    document.addEventListener("pointerup", () => {
      setActive(false);
      clearInterval(timeRef.current);
    });
  }, []);
  const { s } = useSpring({
    s: active ? 1 : 0,
    config: {
      tension: 0,
      friction: 0
    }
  });

  useFrame(() => {
    // setTimeout(() => {
    //   x.start([0.1, 0, 0]);
    // }, 1000);
    // setTimeout(() => {
    //   x.start([0.0, 0, 0]);
    // }, 2000);
    // cube.current!.rotation.x += 0.01;
    // cube.current!.rotation.y += 0.01;
  });

  return (
    <>
      <animated.group position={[0, -1, -5]} ref={posRef}>
        <animated.group position={y}>
          <animated.group position={p} rotation={x} ref={cube}>
            <animated.mesh scale={s} position={[0, 0.3, -6]}>
              <sphereGeometry args={[1.4, 16, 16]} />
              <animated.pointLight
                color={0xffff00}
                intensity={s}
                position={[0, 0.4, -0]}
              />
              <meshToonMaterial color="#ffff00" />
            </animated.mesh>
            <mesh>
              <primitive object={weapon.scene.children[0]} />
              <meshToonMaterial color="#00ff00" />
            </mesh>
          </animated.group>
        </animated.group>
      </animated.group>
    </>
  );
};

const Scene = () => {
  const { camera } = useThree();

  return (
    <>
      <PointerLockControls camera={camera} />
      {/* <gridHelper /> */}
      {/* <axesHelper /> */}
      <pointLight color={0xff8899} intensity={0.3} position={[-5, -3, 5]} />
      <pointLight color={0x00ffff} intensity={0.5} position={[5, 3, -5]} />
      <Cube />
    </>
  );
};

const App = () => {
  const camera = {
    near: 0.1,
    far: 1000,
    zoom: 1,
    position: [0, 1, 5]
  };
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw"
      }}
    >
      <Canvas
        mode="concurrent"
        camera={camera}
        onCreated={({ gl }) => {
          gl.setClearColor("#252934");
        }}
      >
        {/* <DeviceOrientationControls /> */}
        {/* <FlyControls /> */}
        {/* <FirstPersonControls  /> */}
        <PerspectiveCamera makeDefault {...camera}></PerspectiveCamera>
        {/* <EffectComposer>
          <DepthOfField focusDistance={0.02} focalLength={2} bokehScale={50} height={400} />
        </EffectComposer> */}
        <Stats />
        {/* <OrbitControls /> */}
        <mesh position={[-15, -40, 0]}>
          <boxBufferGeometry args={[200, 2, 200, 4]} />
          <meshStandardMaterial color="#448805" />
        </mesh>
        <mesh position={[15, 10, -50]}></mesh>
        <mesh position={[0, 20, -50]}></mesh>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default App;
