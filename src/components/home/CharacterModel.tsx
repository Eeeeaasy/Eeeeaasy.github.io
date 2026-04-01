import { Canvas, useFrame } from "@react-three/fiber";
import { Float, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import type { Group, Object3D } from "three";
import * as THREE from "three"; // 引入 THREE 用于数学计算

// 1. 提取全局鼠标坐标，摆脱局部 div 的限制，实现全屏无缝跟随
const globalMouse = { x: 0, y: 0 };

const MODEL_PRESETS: Record<
  string,
  {
    desktopX: number;
    mobileX: number;
    desktopScale: number;
    mobileScale: number;
    desktopY: number;
    mobileY: number;
  }
> = {
  "/models/stand.glb": {
    desktopX: 0,
    mobileX: 0,
    desktopScale: 3,
    mobileScale: 2.2,
    desktopY: -1.4,
    mobileY: -1.12,
  },
  "/models/stand2.glb": {
    desktopX: -0.1,
    mobileX: 0,
    desktopScale: 3,
    mobileScale: 1.9,
    desktopY: -1.38,
    mobileY: -1.02,
  },
  "/models/character.glb": {
    desktopX: 0,
    mobileX: 0,
    desktopScale: 2.6,
    mobileScale: 2.15,
    desktopY: -1,
    mobileY: -1.0,
  },
  "/models/guitar.glb": {
    desktopX: -0.1,
    mobileX: 0.22,
    desktopScale: 2.5,
    mobileScale: 2.28,
    desktopY: -1,
    mobileY: -1.08,
  },
};

type CharacterModelProps = {
  modelPath?: string;
};

function Avatar({ isMobile, modelPath }: { isMobile: boolean; modelPath: string }) {
  // 使用新的模型路径，请确保你的文件路径是正确的
  const { scene } = useGLTF(modelPath);
  const preset = MODEL_PRESETS[modelPath] ?? MODEL_PRESETS["/models/stand.glb"];

  const rootRef = useRef<Group>(null);
  const headRef = useRef<Object3D | null>(null);

  useEffect(() => {
    let foundHead: Object3D | null = null;

    scene.traverse((obj) => {
      const name = obj.name.toLowerCase();

      if (
        name === "head" ||
        name.includes("head") ||
        name.includes("neck")
      ) {
        if (!foundHead) foundHead = obj;
      }
    });

    headRef.current = foundHead;

    if (!foundHead) {
      console.warn("No head-like bone/object found in GLB.");
    }
  }, [scene]);

useFrame(() => {
    const head = headRef.current;

    // 1. 解决【幅度小】的问题：调大乘数
    // 以前上下是 0.12，现在我调大到了 0.35。数字越大，他抬头和低头的动作就越夸张。
    const targetY = globalMouse.x * 0.3;  // 左右幅度
    const targetX = -globalMouse.y * 0.35; // 上下幅度（大幅增加）

    // 2. 解决【速度慢、卡顿】的问题：调大 lerp 的第三个参数（灵敏度）
    // 以前是 0.05（很粘滞），现在调到 0.15（非常跟手、清脆）。
    const lerpSpeed = 0.14; 

    if (head) {
      head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, targetY, lerpSpeed);
      head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, targetX, lerpSpeed);
    } else if (rootRef.current) {
      // 如果找不到头骨，全身跟着动的幅度也要相应调大一点点
      const rootTargetY = globalMouse.x * 0.15 + 0.08;
      const rootTargetX = -globalMouse.y * 0.15;
      
      rootRef.current.rotation.y = THREE.MathUtils.lerp(rootRef.current.rotation.y, rootTargetY, lerpSpeed);
      rootRef.current.rotation.x = THREE.MathUtils.lerp(rootRef.current.rotation.x, rootTargetX, lerpSpeed);
    }
  });

  return (
    <group
      ref={rootRef}
      scale={isMobile ? preset.mobileScale : preset.desktopScale}
      position={[isMobile ? preset.mobileX : preset.desktopX, isMobile ? preset.mobileY : preset.desktopY, 0]}
      rotation={[0, 0.08, 0]}
    >
      <primitive object={scene} />
    </group>
  );
}
export default function CharacterModel({ modelPath = "/models/stand.glb" }: CharacterModelProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const sync = () => setIsMobile(media.matches);

    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  // 在最外层监听一次鼠标，并将标准化坐标同步给全局变量
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // 将鼠标在浏览器视口中的坐标标准化为 -1 到 1 的范围
      globalMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      globalMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    // pointer-events-none 是关键：确保 Canvas 容器不会阻挡底下网页内容（如按钮、文字）的点击事件
    <div className="relative h-[460px] w-full overflow-visible pointer-events-none sm:h-[700px]">
      <Canvas 
        camera={{ position: [0, isMobile ? 0.2 : 0.15, isMobile ? 8.8 : 6.2], fov: isMobile ? 42 : 32 }} 
        dpr={[1, 2]}
        // alpha: true 强制画布背景透明，彻底消除视觉硬框
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.35} />
        <directionalLight position={[3, 4, 5]} intensity={1.8} />
        <directionalLight position={[-3, 2, 4]} intensity={0.7} />
        <spotLight
          position={[0, 6, 3]}
          angle={0.35}
          penumbra={1}
          intensity={1}
        />

        <Suspense fallback={null}>
          {/* Float 组件让模型有轻微的呼吸/悬浮感 */}
          <Float speed={1.5} rotationIntensity={0} floatIntensity={0.8}>
            <Avatar isMobile={isMobile} modelPath={modelPath} />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
}

// 预加载模型，防止初次加载时闪烁
useGLTF.preload("/models/stand.glb");
useGLTF.preload("/models/stand2.glb");
useGLTF.preload("/models/character.glb");
useGLTF.preload("/models/guitar.glb");