import CharacterModel from "./CharacterModel";

type ProjectsCornerAvatarProps = {
  modelPath?: string;
};

// Projects 页左下角小人的布局参数：只改这里就能调大小和位置。
const CORNER_AVATAR_LAYOUT = {
  bottom: 400,
  left: 780,
  containerWidthMd: 260,
  containerHeightMd: 360,
  containerWidthLg: 300,
  containerHeightLg: 340,
  modelOffsetLeft: -60,
  modelOffsetBottom: -96,
  modelWidthMd: 360,
  modelWidthLg: 450,
} as const;

// 小人头部朝向参数：固定仰头，并且只允许左右转动。
const CORNER_AVATAR_HEAD = {
  fixedHeadPitch: -0.22,
  yawRange: 0.34,
} as const;

// Projects 页小人专属打光参数：只改这里，不影响首页小人。
const CORNER_AVATAR_LIGHT = {
  ambientIntensity: 2,
  keyLightPosition: [2.4, 3.5, 4.8] as [number, number, number],
  keyLightIntensity: 1.35,
  fillLightPosition: [-2.2, 1.8, 3.2] as [number, number, number],
  fillLightIntensity: 0.42,
  spotLightPosition: [0.5, 4.8, 2.6] as [number, number, number],
  spotLightAngle: 0.42,
  spotLightPenumbra: 0.9,
  spotLightIntensity: 0.82,
} as const;

export default function ProjectsCornerAvatar({
  modelPath = "/models/withAudio.glb",
}: ProjectsCornerAvatarProps) {
  return (
    <div
      className="pointer-events-none fixed z-20 hidden overflow-visible md:block"
      style={{
        bottom: CORNER_AVATAR_LAYOUT.bottom,
        left: CORNER_AVATAR_LAYOUT.left,
        width: CORNER_AVATAR_LAYOUT.containerWidthMd,
        height: CORNER_AVATAR_LAYOUT.containerHeightMd,
      }}
    >
      <div
        className="absolute lg:hidden"
        style={{
          left: CORNER_AVATAR_LAYOUT.modelOffsetLeft,
          bottom: CORNER_AVATAR_LAYOUT.modelOffsetBottom,
          width: CORNER_AVATAR_LAYOUT.modelWidthMd,
        }}
      >
        <CharacterModel
          modelPath={modelPath}
          lockHeadPitch
          fixedHeadPitch={CORNER_AVATAR_HEAD.fixedHeadPitch}
          yawRange={CORNER_AVATAR_HEAD.yawRange}
          lightConfig={CORNER_AVATAR_LIGHT}
        />
      </div>

      <div
        className="absolute hidden lg:block"
        style={{
          left: CORNER_AVATAR_LAYOUT.modelOffsetLeft,
          bottom: CORNER_AVATAR_LAYOUT.modelOffsetBottom,
          width: CORNER_AVATAR_LAYOUT.modelWidthLg,
          height: CORNER_AVATAR_LAYOUT.containerHeightLg,
        }}
      >
        <CharacterModel
          modelPath={modelPath}
          lockHeadPitch
          fixedHeadPitch={CORNER_AVATAR_HEAD.fixedHeadPitch}
          yawRange={CORNER_AVATAR_HEAD.yawRange}
          lightConfig={CORNER_AVATAR_LIGHT}
        />
      </div>
    </div>
  );
}