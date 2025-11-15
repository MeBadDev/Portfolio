import { FaGithub, FaGit, FaPython, FaGolang, FaRust, FaJava, FaJs, FaUbuntu, FaFedora, FaDebian, FaDigitalOcean, FaFlutter, FaDartLang, FaReact, FaAndroid, FaFire, FaReddit, FaDiscord, FaTwitch } from "react-icons/fa6"



import { ReactNode, useEffect, useState } from 'react';
import { FaMailBulk } from "react-icons/fa";
import GraphPaperBackground from "./GraphPaperBackground";
import BlogPreviewList from "./BlogPreviewList";

function TechIcon({ children }: { children: ReactNode }) {
    return <>
        <div className="p-2 text-4xl w-min h-min border-4 text-zinc-800 bg-zinc-200 transition hover:scale-150 ease-in-out">
            {children}
        </div>
    </>
}
function TechIconGrid() {
    return (
        <div className="w-fit grid grid-cols-4 gap-10">
            <TechIcon><FaGithub /></TechIcon>
            <TechIcon><FaGit /></TechIcon>
            <TechIcon><FaPython /></TechIcon>
            <TechIcon><FaGolang /></TechIcon>
            <TechIcon><FaRust /></TechIcon>
            <TechIcon><FaJava /></TechIcon>
            <TechIcon><FaJs /></TechIcon>
            <TechIcon><FaUbuntu /></TechIcon>
            <TechIcon><FaFedora /></TechIcon>
            <TechIcon><FaDebian /></TechIcon>
            <TechIcon><FaDigitalOcean /></TechIcon>
            <TechIcon><FaFlutter /></TechIcon>
            <TechIcon><FaDartLang /></TechIcon>
            <TechIcon><FaReact /></TechIcon>
            <TechIcon><FaAndroid /></TechIcon>
            <TechIcon><FaFire /></TechIcon>
        </div>
    );
}
function TitleAndDescription({ title, description, children }: { title: string, description: string, children?: ReactNode }) {
    return <>
        <div className="flex flex-col justify-center w-full">
            <p className="text-6xl md:text-7xl self-center text-shadow">{title}</p>
            <div className="flex flex-col text-3xl self-center">
                <p>{description}</p>
                {children}
            </div>
        </div>
    </>
}

function SocialMedia({text, icon, link}: {text: string, icon: ReactNode, link: string}) {
    return (
        <a href={link} target="_blank" rel="noopener noreferrer" className="flex flex-col justify-center items-center w-full mt-6 md:mt-0">
            <TechIcon>{icon}</TechIcon>
            <p className="text-xl md:text-4xl text-center align-middle">{text}</p>
        </a>
    )
}

function SocialMediaGrid() {
    return (
        <div className="flex flex-row justify-center w-full">
        <div className="w-fit grid grid-cols-5 gap-10">
            <SocialMedia text="GitHub" icon={<FaGithub/>} link="https://github.com/mebaddev"/>
            <SocialMedia text="Reddit" icon={<FaReddit/>} link="https://reddit.com/u/mebaddev"/>
            <SocialMedia text="Discord" icon={<FaDiscord/>} link="https://discord.com/users/836486140852568074"/>
            <SocialMedia text="Twitch" icon={<FaTwitch/>} link="https://www.twitch.tv/mebaddev"/>
            <SocialMedia text="Gmail" icon={<FaMailBulk/>} link="mailto:hello@mebaddev.net"/>
        </div>
        </div>
    )
}

function TetrioStatPanel() {
    const [totalGames, setTotalGames] = useState("Fetching!")
    const [totalWins, setTotalWins] = useState("Fetching!")
    const [rank, setRank] = useState("Fetching!")
    const [fortyLinesRecord, setFortyLinesRecord] = useState("Fetching!")
    const [countryRank, setCountryRank] = useState("Fetching!")
    useEffect(() => {
        fetch("https://tetrio-stats.mebaddev.net/league", {cache: "no-store"}).then(response => response.json()).then((data) => {
            const standings = data.data.standing_local
            const rank = data.data.rank
            setTotalGames(totalGames)
            setTotalWins(totalWins)
            setCountryRank(standings)
            setRank(rank.toUpperCase())
        })

        fetch("https://tetrio-stats.mebaddev.net/40l", {cache: "no-store"}).then(response => response.json()).then((data) => {
            const forty = Math.round(data.data.record.results.stats.finaltime) / 1000
            setFortyLinesRecord(forty.toString())
        })

    }, [])
    return (
        <>
            <div className="flex w-full flex-col p-4 gap-4 border-8 md:mx-16 text-zinc-800 md:max-w-1/2">
                <div className="flex flex-row justify-center gap-4 text-center align-middle">
                    <img src="https://txt.osk.sh/branding/tetrio-mono-dark.svg" className="w-12" alt="TETR.IO logo"/>
                    <p className="text-5xl ">TETR.IO STATS</p>
                </div>
                <div className="flex flex-col md:flex-row gap-4 w-full">
                    <div className="flex flex-col w-full bg-emerald-400 border-8 h-full p-2">
                        <p className="text-4xl">
                            CURRENT RANK
                        </p>
                        <p className="text-4xl">
                            {rank}
                        </p>
                    </div>
                    <div className="flex flex-col w-full bg-emerald-400 border-8 h-full p-2">
                        <p className="text-4xl">
                            40L RECORD
                        </p>
                        <p className="text-3xl">
                            {fortyLinesRecord} seconds
                        </p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4 w-full ">
                    <div className="flex flex-col w-full bg-emerald-400 border-8 h-full p-2">
                        <p className="text-4xl">
                            COUNTRY RANK
                        </p>
                        <p className="text-3xl">
                            #{countryRank}
                        </p>
                    </div>
                    <div className="flex flex-col w-full bg-emerald-400 border-8 h-full justify-center items-center hover:bg-emerald-200 p-2">
                        <a className="text-4xl w-full h-full text-center flex items-center justify-center" href="https://ch.tetr.io/u/mebaddev" target="_blank" rel="noopener noreferrer">
                            VIEW FULL PROFILE
                        </a>
                    </div>
                </div>

            </div>
        </>
    )
}

export default function ThirdPanel() {
    const [dailyAverage, setDailyAverage] = useState("Fetching!")
    const [grandTotal, setGrandTotal] = useState("Fetching!")
    useEffect(() => {
        let cancelled = false;
        fetch("https://wakatime.com/share/@MCplayer00/626ab6f7-d570-4499-821a-ee848e377a1d.json", { cache: "no-store" })
            .then(response => response.json())
            .then((data) => {
                if (cancelled) return;
                const daily = data.data.grand_total.human_readable_daily_average
                const total = data.data.grand_total.human_readable_total
                setDailyAverage(daily)
                setGrandTotal(total)
            })
            .catch(() => {/* ignore */});
        return () => { cancelled = true; };
    }, [])

    return (
        <GraphPaperBackground>
            <h1 className="text-7xl md:text-8xl mt-8 text-shadow">TO PUT IT SHORT:</h1>
            <div className="flex flex-col md:flex-row w-full h-full mt-16 jusfiy-center p-8">
                
                <TitleAndDescription title="I PROGRAM" description={`And I LOVE doing it! According to WakaTime, I've spent:`}>
                    <ul>
                        <li className="text-3xl">- Most of my time on Javascript and Typescript.</li>
                        <li className="text-3xl">- {dailyAverage} per coding session, on average.</li>
                        <li className="text-3xl">- {grandTotal} programming in total.</li>
                    </ul>
                </TitleAndDescription>

                <div className="flex flex-col w-full h-full items-center mt-12 md:mt-9">
                    <p className="text-6xl mb-4">I am familiar with:</p>
                    <TechIconGrid />
                </div>
            </div>

            <div className="flex flex-col-reverse md:flex-row w-full h-full mt-16 justify-center p-8">

                <TetrioStatPanel/>
                <TitleAndDescription title="I TETRIS" description="And I'm pretty decent at it! I play/has played:">
                    <ul>
                        <li className="text-3xl">- Tetris Effect: Connected</li>
                        <li className="text-3xl">- TETR.IO (my favourite :D)</li>
                        <li className="text-3xl">- Jstris</li>
                        <li className="text-3xl">- Puyo Puyo Tetris</li>
                        <li className="text-3xl">- Tetris 99</li>
                    </ul>
                </TitleAndDescription>
            </div>
            <div className="flex flex-col md:flex-row w-full h-full mt-16 justify-center p-8">

                <TitleAndDescription title="I SHARE" description="Although not much, I love talking about stuffs I build, challenges I face, and whatever cool stuffs I discover along the way. Here's my social medias, and you can find my blog posts below!"/>
                <SocialMediaGrid/>
            </div>

            {/* Latest blogs preview and Show More */}
            <div className="w-full p-4 md:p-8">
                <BlogPreviewList/>
            </div>
        </GraphPaperBackground>

    )
}
