import { useEffect, useState } from 'react';

export default function SecondPanel() {
    const [animationSpeed, setAnimationSpeed] = useState('40s');

    useEffect(() => {
        const updateAnimationSpeed = () => {
            setAnimationSpeed(window.innerWidth / 50 + 's');
        };

        updateAnimationSpeed();
        window.addEventListener('resize', updateAnimationSpeed);

        return () => window.removeEventListener('resize', updateAnimationSpeed);
    }, []);

    return (
        <>
            <div className="h-72 animate-background animate-[pan_1s_linear_infinite] m-0" style={{
                height: '100%',
                width: '100%',
                backgroundSize: '48px 48px',
                backgroundImage: 'linear-gradient(-45deg, rgb(var(--primary-stripe-rgb)) 25%, rgb(var(--secondary-stripe-rgb)) 25%, rgb(var(--secondary-stripe-rgb)) 50%, rgb(var(--primary-stripe-rgb)) 50%, rgb(var(--primary-stripe-rgb)) 75%, rgb(var(--secondary-stripe-rgb)) 75%, rgb(var(--secondary-stripe-rgb)) 100%)',
                boxShadow: 'inset 0rem 0.5rem 2rem 0.25rem rgb(0 0 0 / 40%)',
                animation: `pan ${animationSpeed} linear infinite`
            }}>
                <div className="h-full p-8 backdrop-brightness-75">
                    <div className="flex flex-col md:flex-row justify-center w-full h-full">
                        <div className="flex flex-col  w-full md:w-2/5 p-4 text-center justify-center text-shadow-md">
                            <h4 className="text-8xl text-zinc-100 ">ABOUT ME</h4>
                        </div>
                        <div className="flex flex-col w-full h-full p-4 text-center justify-center text-zinc-200 text-3xl text-shadow-sm">
                            <p>Hey, I'm MeBadDev -- a high school student/dev who loves breaking, fixing, and building stuffs.
I enjoy game development, web development, and creating things that (hopefully) make the world a little better. I've won multiple Game of the Month (GOTM) jams, and while the platform may be gone, the passion for game dev lives on.

I'm also into modding, Linux ricing, and learning more about hardware. Right now, I'm focused on programming, competitive Tetris, and whatever cool things catches my attention next..</p>
                        </div>
                    </div>
                </div>
                
            </div>
        </>
    )
}