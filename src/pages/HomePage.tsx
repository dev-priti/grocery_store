import FeaturedSection from "../components/FeaturedSection";
import Counter from "../components/Counter";
import type { ProductType } from "../types/ProductType";

export type HomePageProps = {
    searchText?: string;
    addToCart?: (product: ProductType) => void;
}

function HomePage({ searchText = "", addToCart  }: HomePageProps) {
    
    return(
        <>
            <FeaturedSection searchText={searchText} addToCart={addToCart} />
            <Counter onClicking = {() => alert('clicked')} />
        </>
    );
}

export default HomePage;
