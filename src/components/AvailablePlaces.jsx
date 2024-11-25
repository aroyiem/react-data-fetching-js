import Places from './Places.jsx';
import {useEffect, useState} from "react";
import ErrorPage from "./Error.jsx";
import {sortPlacesByDistance} from "../loc.js";
import {fetchAvailablePlaces} from "../http.js";

export default function AvailablePlaces({onSelectPlace}) {
    const [isFetching, setIsFetching] = useState(false);
    const [availablePlaces, setAvailablePlaces] = useState([]);
    const [error, setError] = useState();

    useEffect(() => {

        async function fetchPlaces() {
            setIsFetching(true);
            try {
                const places = await fetchAvailablePlaces();
                navigator.geolocation.getCurrentPosition((position) => {
                    const sortedPlaces = sortPlacesByDistance(places, position.coords.latitude, position.coords.longitude);
                    setAvailablePlaces(sortedPlaces);
                    setIsFetching(false);
                });
            } catch (error) {
                // ...
                setError({message: error.message || "Couldn't fetch places, please try again"});
                setIsFetching(false);
            }
        }
        fetchPlaces();
        /*fetch('http://localhost:3000/places').then((response) => {
            return response.json();
        }).then((resData) => {
            setAvailablePlaces(resData.places);
        });*/
    }, []);

    if(error) {
        return <ErrorPage title="An error occurred!" message={error.message}/>
    }

    return (
        <Places
            title="Available Places"
            places={availablePlaces}
            isLoading={isFetching}
            loadingText="Fetching place data..."
            fallbackText="No places available."
            onSelectPlace={onSelectPlace}
        />
    );
}
