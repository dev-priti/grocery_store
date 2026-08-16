import FeaturedSection from "../components/FeaturedSection";
import Counter from "../components/Counter";

function HomePage() {
    return(
        <>
            <FeaturedSection />
            <Counter onClicking = {() => alert('clicked')} />
        </>
    );
}

export default HomePage;
