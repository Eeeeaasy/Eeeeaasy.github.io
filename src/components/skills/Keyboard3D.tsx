import Spline from "@splinetool/react-spline";

export default function Keyboard3D() {
  // Keep the model readable and centered across breakpoints.
  function handleLoad(splineApp: any) {
    splineApp.setZoom(0.74);
  }

  return (
    <div className="relative mx-auto h-[360px] w-full max-w-5xl overflow-visible rounded-[1.6rem] md:h-[500px]">
      <div className="pointer-events-none absolute inset-0 rounded-[1.6rem] ring-1 ring-black/8 dark:ring-white/10" />
      <Spline
        scene="/assets/skills-keyboard.splinecode"
        onLoad={handleLoad}
      />
    </div>
  );
}