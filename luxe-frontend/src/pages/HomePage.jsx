import Hero from "../components/Sections/Hero.jsx";
import Ticker from "../components/Sections/Ticker.jsx";
import TrustBar from "../components/Sections/TrustBar.jsx";

import PromoBanner from "../components/Sections/PromoBanner.jsx";
import Categories from "./Categories.jsx";

import Reveal from "../components/Reveal.jsx";

const HomePage = () => {
    return <>
        <Reveal>
            <Hero />
        </Reveal>

        <Reveal>
            <Ticker />
        </Reveal>

        <Reveal>
            <TrustBar />
        </Reveal>

        <Reveal>
            <PromoBanner />
        </Reveal>

        <Reveal>
            <Categories />
        </Reveal>
    </>
}

export default HomePage;