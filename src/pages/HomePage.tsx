import FeaturedSection from "../components/FeaturedSection";
import Counter from "../components/Counter";

export type HomePageProps = {
    searchText?: string;
}

function HomePage({ searchText }: HomePageProps) {
    
    return(
        <>
            <FeaturedSection searchText={searchText} />
            <Counter onClicking = {() => alert('clicked')} />
        </>
    );
}

export default HomePage;
