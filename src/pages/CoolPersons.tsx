import Footer from "../components/Footer";
import Topbar from "../components/Topbar";

type link = {
    name: string;
    url: string;
}
type PersonCardProps = {
    name: string;
    description: string;
    imageUrl: string | undefined;
    link: link[] | undefined;
};

function PersonCard({ name, description, imageUrl, link }: PersonCardProps) {
    return (
        <div className="flex flex-col bg-white text-zinc-900 p-6 gap-3 border-black border-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
                {imageUrl && (
                    <img 
                        src={imageUrl} 
                        alt={name} 
                        className="h-16 object-cover rounded-full m-2"
                        onLoad={(e) => {
                            const img = e.currentTarget;
                            if (img.naturalWidth !== img.naturalHeight) {
                                img.classList.remove('rounded-full');
                            }
                        }}
                    />
                )}
                <h3 className="text-3xl font-bold">{name}</h3>
            </div>
            <p className="text-xl leading-relaxed">{description}</p>
            <div className="flex gap-2 flex-wrap">
                {link?.map((l, i) => (
                    <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        {l.name}
                    </a>
                ))}
            </div>
        </div>
    );
}
export default function CoolPersons() {
    return (
        <>
        <Topbar/>
        <div className="min-h-screen w-full text-zinc-100 p-0 m-0" style={{
        backgroundSize: '48px 48px',
        backgroundImage: 'linear-gradient(-45deg, rgb(var(--primary-stripe-rgb)) 25%, rgb(var(--secondary-stripe-rgb)) 25%, rgb(var(--secondary-stripe-rgb)) 50%, rgb(var(--primary-stripe-rgb)) 50%, rgb(var(--primary-stripe-rgb)) 75%, rgb(var(--secondary-stripe-rgb)) 75%, rgb(var(--secondary-stripe-rgb)) 100%)',
        boxShadow: 'inset 0rem 0.5rem 2rem 0.25rem rgb(0 0 0 / 40%)',
        animation: `pan 40s linear infinite`
        }}>
        <div className="max-w-5xl mx-auto p-4
            md:p-8">
            <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col">
                    <h1 className="text-6xl">Cool Persons</h1>
                    <p className="text-xl">Some really cool ppls I've met IRL/online that deserves more attention! (In no particular order). If you'd like to be taken off the list or change the description, please let me know!</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PersonCard
                    name="Silver"
                    description="We met back in 2023 after a game jam. He's a talented developer and has made a bunch of awesome web games. It was fun playing Minecraft with him too :3"
                    imageUrl="https://silverspace.io/silverspace.gif"
                    link={[
                        { name: "Website", url: "https://silverspace.io"},
                        { name: "GitHub", url: "https://github.com/SilverSpace505"},
                    ]}
                />
                <PersonCard
                    name="Overscore"
                    description="Silver's classmate (I think?) really chill guy! We played among us together. He's fun to talk to."
                    imageUrl="https://overscore34.github.io/images/overscoreBanner.png"
                    link={[
                        { name: "Website", url: "https://overscore34.github.io/" },
                    ]}
                />
                <PersonCard
                    name="bemannU"
                    description="He shitposts in our discord server a lot (tbf, so does everyone else) and plays Minecraft!"
                    imageUrl="https://bemannu.github.io/image.png"
                    link={[
                        { name: "Website", url: "https://bemannu.github.io/" },
                    ]}
                />
                <PersonCard
                    name="BlazingFish"
                    description="He contributed 32.51% of the memes in our memes channel (yes i checked) and made some really cool songs."
                    imageUrl="https://blazingfish.github.io/images/icon.jpg"
                    link={[
                        { name: "Website", url: "https://blazingfish.github.io/" },
                    ]}
                />
                <PersonCard
                    name="AWeirdDev"
                    description="He somehow found me through Instagram. Good at Rust and has made some stuffs peoples actually uses (unlike my projects :P ). Sends funny memes and shitposts."
                    imageUrl="https://avatars.githubusercontent.com/u/90096971?v=1"
                    link={[
                        { name: "GitHub", url: "https://github.com/AWeirdDev" },
                    ]}
                />
                <PersonCard
                    name="Maoyue"
                    description="Uses Arch BTW. He hosts a SearXNG instance and a Minecraft server. Have a wide range of projects from Minecraft plugins to nice CLI tools!"
                    imageUrl="https://avatars.githubusercontent.com/u/95519633?v=4"
                    link={[
                        { name: "GitHub", url: "https://github.com/MagicTeaMC" }
                    ]}
                />
            </div>
        </div>
        </div>
        
        <Footer/>
     </>
    );
}
