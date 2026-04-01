import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";

type Vec = { x: number; y: number };

const clamp = (value: number, min: number, max: number) =>
	Math.max(min, Math.min(max, value));

const getScale = (dx: number, dy: number) => {
	const distance = Math.hypot(dx, dy);
	return Math.min(distance / 760, 0.22);
};

const getAngle = (dx: number, dy: number) => (Math.atan2(dy, dx) * 180) / Math.PI;

const BASE_SIZE = 40;

export default function JellyCursor() {
	const [enabled, setEnabled] = useState(false);

	const magneticTargetRef = useRef<HTMLElement | null>(null);

	const targetRef = useRef<Vec>({ x: 0, y: 0 });
	const dotRef = useRef<HTMLDivElement | null>(null);
	const blobRef = useRef<HTMLDivElement | null>(null);

	const posRef = useRef<Vec>({ x: 0, y: 0 });
	const velRef = useRef<Vec>({ x: 0, y: 0 });
	const initializedRef = useRef(false);
	const nativeCursorHiddenRef = useRef(false);
	const hoveringRef = useRef(false);
	const hiddenRef = useRef(false);
	const pointerInsideRef = useRef(false);

	const setRef = useRef<{
		x?: Function;
		y?: Function;
		rotate?: Function;
		scaleX?: Function;
		scaleY?: Function;
		width?: Function;
		height?: Function;
		radius?: Function;
		opacity?: Function;
	}>({});

	useLayoutEffect(() => {
		if (!enabled || !blobRef.current || !dotRef.current) return;
		setRef.current.x = gsap.quickSetter(blobRef.current, "x", "px");
		setRef.current.y = gsap.quickSetter(blobRef.current, "y", "px");
		setRef.current.rotate = gsap.quickSetter(blobRef.current, "rotate", "deg");
		setRef.current.scaleX = gsap.quickSetter(blobRef.current, "scaleX");
		setRef.current.scaleY = gsap.quickSetter(blobRef.current, "scaleY");
		setRef.current.width = gsap.quickSetter(blobRef.current, "width", "px");
		setRef.current.height = gsap.quickSetter(blobRef.current, "height", "px");
		setRef.current.radius = gsap.quickSetter(blobRef.current, "borderRadius", "px");
		setRef.current.opacity = gsap.quickSetter([blobRef.current, dotRef.current], "opacity");

		// Keep invisible until we receive a real pointer movement.
		setRef.current.opacity?.(0);
	}, [enabled]);

	useEffect(() => {
		// Always reset native cursor first to avoid inheriting stale cursor-none from previous page.
		document.body.classList.remove("cursor-none");
		nativeCursorHiddenRef.current = false;

		const isFinePointer = window.matchMedia("(pointer:fine)").matches;
		const prefersReducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)"
		).matches;

		if (!isFinePointer || prefersReducedMotion) {
			return;
		}

		setEnabled(true);

		// Avoid rendering from (0,0) before the first real pointer move.
		targetRef.current.x = window.innerWidth / 2;
		targetRef.current.y = window.innerHeight / 2;
		posRef.current.x = window.innerWidth / 2;
		posRef.current.y = window.innerHeight / 2;

		const hideNativeCursor = () => {
			if (nativeCursorHiddenRef.current) return;
			document.body.classList.add("cursor-none");
			nativeCursorHiddenRef.current = true;
		};

		const showNativeCursor = () => {
			if (!nativeCursorHiddenRef.current) return;
			document.body.classList.remove("cursor-none");
			nativeCursorHiddenRef.current = false;
		};

		const onMove = (event: MouseEvent) => {
			pointerInsideRef.current = true;
			const target = event.target as HTMLElement | null;
			const interactive = target?.closest(
				"a,button,input,textarea,select,[role='button'],[data-cursor='hover']"
			);
			const magneticTarget = target?.closest(
				".cursor-can-hover,[data-cursor='magnetic']"
			) as HTMLElement | null;
			const shouldHide = Boolean(target?.closest('[data-no-custom-cursor="true"]'));

			magneticTargetRef.current = magneticTarget;
			hoveringRef.current = Boolean(interactive || magneticTarget);
			hiddenRef.current = shouldHide;

			if (shouldHide) {
				showNativeCursor();
			} else if (initializedRef.current) {
				hideNativeCursor();
			}

			targetRef.current.x = event.clientX;
			targetRef.current.y = event.clientY;

			if (!initializedRef.current) {
				initializedRef.current = true;
				posRef.current.x = event.clientX;
				posRef.current.y = event.clientY;
				hideNativeCursor();
			}

			gsap.to(posRef.current, {
				x: event.clientX,
				y: event.clientY,
				duration: 0.46,
				ease: "power3.out",
				overwrite: true,
				onUpdate: () => {
					velRef.current.x = event.clientX - posRef.current.x;
					velRef.current.y = event.clientY - posRef.current.y;
				},
			});
		};

		const onOver = (event: MouseEvent) => {
			const target = event.target as HTMLElement | null;
			const interactive = target?.closest(
				"a,button,input,textarea,select,[role='button'],[data-cursor='hover']"
			);
			const magneticTarget = target?.closest(
				".cursor-can-hover,[data-cursor='magnetic']"
			) as HTMLElement | null;

			magneticTargetRef.current = magneticTarget;
			hoveringRef.current = Boolean(interactive || magneticTarget);

			const shouldHide = Boolean(target?.closest('[data-no-custom-cursor="true"]'));
			hiddenRef.current = shouldHide;
			if (shouldHide) {
				showNativeCursor();
			} else if (initializedRef.current) {
				hideNativeCursor();
			}
		};

		const onWindowMouseLeave = () => {
			pointerInsideRef.current = false;
			hiddenRef.current = true;
			showNativeCursor();
		};

		const onWindowMouseEnter = () => {
			// Wait for real mousemove before enabling the custom cursor.
			pointerInsideRef.current = false;
			hiddenRef.current = false;
			showNativeCursor();
		};

		const onWindowBlur = () => {
			pointerInsideRef.current = false;
			hiddenRef.current = true;
			showNativeCursor();
		};

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key !== "Escape") return;
			// Emergency fallback: immediately restore system cursor.
			pointerInsideRef.current = false;
			hiddenRef.current = true;
			showNativeCursor();
		};

		const onWindowFocus = () => {
			pointerInsideRef.current = false;
			hiddenRef.current = false;
			showNativeCursor();
		};

		const onVisibilityChange = () => {
			if (document.hidden) {
				pointerInsideRef.current = false;
				hiddenRef.current = true;
				showNativeCursor();
			} else {
				pointerInsideRef.current = false;
				hiddenRef.current = false;
				showNativeCursor();
			}
		};

		const onPageHide = () => {
			pointerInsideRef.current = false;
			hiddenRef.current = true;
			showNativeCursor();
		};

		const animate = () => {
			const setter = setRef.current;
			if (!setter.x || !setter.y || !setter.rotate || !setter.scaleX || !setter.scaleY || !setter.width || !setter.height || !setter.radius || !setter.opacity) {
				if (blobRef.current && dotRef.current) {
					blobRef.current.style.opacity = "0";
					dotRef.current.style.opacity = "0";
				}
				return;
			}

			if (!initializedRef.current) {
				setter.opacity(0);
				return;
			}

			const tx = targetRef.current.x;
			const ty = targetRef.current.y;

			const magneticTarget = magneticTargetRef.current;
			const isMagneticHover =
				Boolean(magneticTarget) &&
				Boolean(magneticTarget?.isConnected) &&
				Boolean(magneticTarget?.offsetParent);

			let x = posRef.current.x;
			let y = posRef.current.y;
			let width = BASE_SIZE;
			let height = BASE_SIZE;
			let radius = BASE_SIZE / 2;
			let rotation = getAngle(velRef.current.x, velRef.current.y);
			let scale = getScale(velRef.current.x, velRef.current.y);

			if (isMagneticHover && magneticTarget) {
				const rect = magneticTarget.getBoundingClientRect();
				if (rect.width > 0 && rect.height > 0) {
					x = rect.left + rect.width / 2;
					y = rect.top + rect.height / 2;
					width = clamp(rect.width + 16, 52, 220);
					height = clamp(rect.height + 12, 32, 84);
					radius = clamp(height * 0.4, 12, 24);
					rotation = 0;
					scale = 0;
				}
			} else {
				const interactiveBump = hoveringRef.current ? 4 : 0;
				width = clamp(BASE_SIZE + scale * 150 + interactiveBump, BASE_SIZE, 104);
				height = clamp(BASE_SIZE - scale * 20, 30, BASE_SIZE);
				radius = height / 2;
			}

			setter.x(x);
			setter.y(y);
			setter.width(width);
			setter.height(height);
			setter.radius(radius);
			setter.rotate(rotation);
			setter.scaleX(1 + scale);
			setter.scaleY(1 - scale * 1.4);
			setter.opacity(hiddenRef.current || !pointerInsideRef.current ? 0 : 1);

			if (dotRef.current) {
				dotRef.current.style.left = `${tx}px`;
				dotRef.current.style.top = `${ty}px`;
			}
		};

		window.addEventListener("mousemove", onMove, { passive: true });
		window.addEventListener("mouseover", onOver, { passive: true });
		window.addEventListener("mouseleave", onWindowMouseLeave);
		window.addEventListener("mouseenter", onWindowMouseEnter);
		window.addEventListener("blur", onWindowBlur);
		window.addEventListener("focus", onWindowFocus);
		window.addEventListener("keydown", onKeyDown);
		window.addEventListener("beforeunload", onPageHide);
		window.addEventListener("pagehide", onPageHide);
		document.addEventListener("visibilitychange", onVisibilityChange);
		gsap.ticker.add(animate);

		return () => {
			window.removeEventListener("mousemove", onMove);
			window.removeEventListener("mouseover", onOver);
			window.removeEventListener("mouseleave", onWindowMouseLeave);
			window.removeEventListener("mouseenter", onWindowMouseEnter);
			window.removeEventListener("blur", onWindowBlur);
			window.removeEventListener("focus", onWindowFocus);
			window.removeEventListener("keydown", onKeyDown);
			window.removeEventListener("beforeunload", onPageHide);
			window.removeEventListener("pagehide", onPageHide);
			document.removeEventListener("visibilitychange", onVisibilityChange);
			gsap.ticker.remove(animate);
			gsap.killTweensOf(posRef.current);
			showNativeCursor();
		};
	}, []);

	if (!enabled) {
		return null;
	}

	return (
		<>
			<div
				ref={blobRef}
				className="pointer-events-none fixed left-0 top-0 z-[9999] h-[40px] w-[40px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-black will-change-transform dark:border-white"
				style={{ backdropFilter: "invert(100%)", opacity: 0 }}
			/>

			<div
				ref={dotRef}
				className="pointer-events-none fixed left-0 top-0 z-[10000] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
				style={{ backdropFilter: "invert(100%)", opacity: 0 }}
			/>
		</>
	);
}
