

export default function GraphPaperBackground({ children }: { children: React.ReactNode }) {
    

    return (
        <>
            <div className="relative">
                <div
                    className="absolute top-0 left-0 bottom-0 right-0 -z-10"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #000000 1px, #e5e7eb 1px)',
                        backgroundSize: '40px 40px',
                    }}
                >
                    <div className="absolute top-0 left-0 bottom-0 right-0" style={{ pointerEvents: 'auto' }}>
                    </div>
                </div>
                <div className="relative z-10 flex flex-col justify-center text-center text-zinc-900 text-2xl">
                    {children}
                </div>
            </div>
        </>
    );
}