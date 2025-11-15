import { useEffect, useRef } from 'react';
const parallaxLayers = [
  // { src: "/parallax-background/sky.png", speed: 0, zIndex: 0, offset: 0 },
  { src: "/parallax-background/clouds_bg.png", speed: 30, zIndex: 1, offset: 0 },
  { src: "/parallax-background/glacial_mountains.png", speed: 60, zIndex: 30, offset: 100 }, // Adjusted zIndex
  { src: "/parallax-background/clouds_mg_1.png", speed: 50, zIndex: 31, offset: 0 },
  { src: "/parallax-background/clouds_mg_2.png", speed: 80, zIndex: 32, offset: 0 },
  { src: "/parallax-background/clouds_mg_3.png", speed: 160, zIndex: 33, offset: 0 },
];

export default function AutoScrollParallax() {
  const layersRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {


    let scrollPosition = 0;
    let animationFrameId: number;

    const devicePixelRatio = window.devicePixelRatio || 1;

    const animateScroll = () => {
      scrollPosition += 1 * devicePixelRatio;
      layersRef.current.forEach((layer, index) => {
        const { speed, offset } = parallaxLayers[index];
        const positionOffset = ((scrollPosition * speed * 0.01 + offset));
        layer.style.backgroundPositionX = `${positionOffset}px`;
      });
      animationFrameId = requestAnimationFrame(animateScroll);
    };

    animateScroll();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100vh' }}>
      {parallaxLayers.map((layer, index) => (
        <div
          key={index}
          ref={(el) => { layersRef.current[index] = el!; }}
          style={{
            backgroundImage: `url(${layer.src})`,
            backgroundSize: 'auto 100%',
            backgroundRepeat: 'repeat-x',
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            zIndex: layer.zIndex,
            imageRendering: 'pixelated',
            pointerEvents: 'none',
          }}
        />
      ))}
    </div>
  );
}
