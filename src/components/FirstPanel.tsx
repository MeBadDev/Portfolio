import AutoScrollParallax from './AutoScrollParallax';

export default function FirstPanel() {
  return (
    <div className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-gradient-to-b from-blue-400 to-blue-950">
      <div className="absolute inset-0">
        <AutoScrollParallax />
      </div>
      <div className="relative z-20 flex flex-col items-center justify-center h-full -translate-y-48">
        <h1 className="text-center text-8xl lg:text-9xl font-bold text-zinc-100 flex">
          {"WELCOME".split("").map((letter, i) => (
            <span
              key={i}
              className="inline-block animate-letter-pop"
              style={{ 
                animationDelay: `${i * 0.3}s`,
                textShadow: '4px 4px 4px rgba(0, 0, 0, 1)' // text outline
              }}
            >
              {letter}
            </span>
          ))}
        </h1>
        <h4 className='text-center text-zinc-200 text-4xl' style={{ textShadow: '2px 2px 2px rgba(0, 0, 0, 1)' }}>
          This is my little website. Enjoy your stay! :D
        </h4>
      </div>
    </div>
  );
}
