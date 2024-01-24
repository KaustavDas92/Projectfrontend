
import { MyCarousel } from "./Components/Carousel"
import { ExploreTopBooks } from "./Components/ExploreTopBooks"
import { Heros } from "./Components/Heros"
import { LibraryServices } from "./Components/LibraryServices"

export const HomePage=() =>{
    return (
        <>
            <ExploreTopBooks/>
            <MyCarousel/>
            <Heros/>
            <LibraryServices/>
        </>
    )
}