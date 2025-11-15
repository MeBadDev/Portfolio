export default function Footer() {
    return (
        <footer className="w-full h-24 bg-zinc-900 flex justify-center items-center">
            <p className="text-2xl md:text-4xl text-zinc-500">© {new Date().getFullYear()} MeBadDev. All rights reserved.</p>
        </footer>
    );
}