import GraphPaperBackground from "../components/GraphPaperBackground";


export default function NotFoundPage() {
    return (
        
        <GraphPaperBackground>
            <div className="flex flex-col items-center justify-center min-h-screen w-full h-full">
            <h1 className="text-9xl font-bold mb-4 text-red-400">Oops, 404!</h1>
            <p className="text-2xl mb-8 m-4 text-center text-zinc-800">Sorry, the page you are looking for does not exists. Maybe you'd like to go back home?</p>
            <a href="#/" className="text-xl text-blue-500 hover:underline">Go back to Home</a>
            </div>
        </GraphPaperBackground>
    );
    }
