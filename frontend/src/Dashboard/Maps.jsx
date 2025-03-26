"use client";
import '@babel/polyfill';
import { useEffect, useState, useRef } from "react";
import { useLoadScript, GoogleMap, Marker, InfoWindow, Polyline, Autocomplete } from "@react-google-maps/api";
import { toast } from 'sonner';
import AppSidebar from './AppSidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import {
    Breadcrumb,  
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from '@/components/ui/separator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faStop } from '@fortawesome/free-solid-svg-icons';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const libraries = ["places", "geometry"];

// Static courthouse locations (Law related)
const courthouses = [
    { name: "Bombay High Court", lat: 18.9361, lng: 72.8357 },
    { name: "Pune District Court", lat: 18.5214, lng: 73.8567 },
    { name: "Nagpur District Court", lat: 21.1466, lng: 79.0888 },
    { name: "Aurangabad Bench High Court", lat: 19.8762, lng: 75.3433 },
    { name: "Thane District Court", lat: 19.2183, lng: 72.9781 },
];

// Static lawyers' locations
const lawyers = [
    { name: "Advocate Ramesh Sharma", lat: 18.9634, lng: 72.8333 },
    { name: "Advocate Neha Gupta", lat: 18.5246, lng: 73.8550 },
    { name: "Advocate Suresh Patil", lat: 21.1500, lng: 79.0800 },
    { name: "Advocate Priya Desai", lat: 19.8815, lng: 75.3300 },
    { name: "Advocate Amit Joshi", lat: 19.2100, lng: 72.9700 },
    { name: "Advocate Sneha Kulkarni", lat: 19.0750, lng: 72.8777 },
    { name: "Advocate Vinayak Rao", lat: 19.1320, lng: 72.9285 },
    { name: "Advocate Alok Saxena", lat: 19.2000, lng: 73.0400 },
    { name: "Advocate Sheetal Mehta", lat: 18.9900, lng: 72.8300 },
    { name: "Advocate Manish Pawar", lat: 19.0020, lng: 72.8500 },
];

const Maps = () => {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [routePath, setRoutePath] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const [searchCoordinates, setSearchCoordinates] = useState(null);
    const [recording, setRecording] = useState(false);
    const inputRef = useRef(null);
    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

    // Initialize SpeechRecognition
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;
    
    try {
        recognition = new SpeechRecognitionAPI();
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onresult = (event) => {
            const speechToText = event.results[0][0].transcript;
            setSearchInput(speechToText);
            toast.success("Address transcribed!");
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            stopRecording();
            
            switch(event.error) {
                case 'network':
                    toast.error("Network error: Please check your internet connection.");
                    break;
                case 'not-allowed':
                    toast.error("Microphone access denied. Please allow microphone access.");
                    break;
                case 'no-speech':
                    toast.error("No speech was detected. Please try again.");
                    break;
                default:
                    toast.error(`Speech recognition error: ${event.error}`);
            }
        };

        recognition.onend = () => {
            setRecording(false);
        };
        
    } catch (error) {
        console.error("Speech recognition not supported:", error);
        toast.error("Speech recognition is not supported in your browser.");
    }

    const startRecording = () => {
        if (!recognition) {
            toast.error("Speech recognition is not supported in your browser.");
            return;
        }
        try {
            setRecording(true);
            recognition.start();
        } catch (error) {
            console.error("Error starting recognition:", error);
            toast.error("Error starting speech recognition");
            setRecording(false);
        }
    };

    const stopRecording = () => {
        if (recognition) {
            recognition.stop();
        }
        setRecording(false);
    };

    useEffect(() => {
        if (transcript) {
            setSearchInput(transcript);
        }
    }, [transcript]);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
        libraries,
    });

    // Get user's current location
    useEffect(() => {
        if (navigator.geolocation && isLoaded) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                    toast.success("Location detected successfully.");
                },
                () => {
                    toast.error("Failed to access location. Please enable location services.");
                }
            );
        }
    }, [isLoaded]);

    // Function to get directions using the backend Directions API on port 4000
    const getDirections = async (destination) => {
        if (!currentLocation) {
            toast.error("User location not detected!");
            return;
        }
        try {
            // Convert coordinates to address using Geocoding service
            const geocoder = new window.google.maps.Geocoder();

            // Get address for current location
            const originResult = await geocoder.geocode({ location: currentLocation });
            const originAddress = originResult.results[0].formatted_address;

            // Get address for destination
            const destResult = await geocoder.geocode({
                location: { lat: destination.lat, lng: destination.lng }
            });
            const destinationAddress = destResult.results[0].formatted_address;

            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/directions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    origin: { address: originAddress },
                    destination: { address: destinationAddress },
                    travelMode: "DRIVE"
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch directions");
            }

            const data = await response.json();
            if (data.routes && data.routes.length > 0) {
                const encoded = data.routes[0].polyline.encodedPolyline;
                const decodedPath = window.google.maps.geometry.encoding.decodePath(encoded);
                setRoutePath(decodedPath);
            } else {
                toast.error("No routes found.");
                setRoutePath(null);
            }
        } catch (error) {
            console.error("Error fetching directions:", error);
            toast.error("Could not fetch directions.");
            setRoutePath(null);
        }
    };

    useEffect(() => {
        if (isLoaded && window.google && inputRef.current) {
            const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
                types: ["geocode"],
            });

            autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace();
                if (place.geometry) {
                    setSearchCoordinates({
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng(),
                    });
                    setSearchInput(place.formatted_address);
                    toast.success("Location selected!");
                }
            });
        }
    }, [isLoaded]);

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading maps...</div>;

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset style={{ backgroundColor: `var(--background-color)` }}>
                <div className="flex items-center gap-2 mb-7">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block font-semibold">
                                Dashboard
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="font-semibold" style={{ color: `var(--text-color)` }}>Google Maps</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                {/* Search Input */}
                <div className="mb-4 flex items-center gap-2">
                    <input
                        type="text"
                        ref={inputRef}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-black"
                        placeholder="Search for a location"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <button 
                        onClick={recording ? stopRecording : startRecording} 
                        className="p-2 rounded-full hover:bg-gray-100"
                        title={recording ? "Stop Recording" : "Start Recording"}
                    >
                        <FontAwesomeIcon icon={recording ? faStop : faMicrophone} />
                    </button>
                </div>

                <GoogleMap
                    center={currentLocation || { lat: 19.0760, lng: 72.8777 }}
                    zoom={10}
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                >
                    {/* User Location - Green Marker */}
                    {currentLocation && (
                        <Marker
                            position={currentLocation}
                            icon={{
                                url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                            }}
                            title="Your Location"
                        />
                    )}

                    {/* Courthouses - Red Markers */}
                    {courthouses.map((court, index) => (
                        <Marker
                            key={`court-${index}`}
                            position={{ lat: court.lat, lng: court.lng }}
                            onClick={() => setSelectedLocation(court)}
                            icon={{
                                url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                            }}
                            title={court.name}
                        />
                    ))}

                    {/* Lawyers - Blue Markers */}
                    {lawyers.map((lawyer, index) => (
                        <Marker
                            key={`lawyer-${index}`}
                            position={{ lat: lawyer.lat, lng: lawyer.lng }}
                            onClick={() => setSelectedLocation(lawyer)}
                            icon={{
                                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                            }}
                            title={lawyer.name}
                        />
                    ))}

                    {/* Render the route path if available */}
                    {routePath && (
                        <Polyline
                            path={routePath}
                            options={{ strokeColor: "#FF0000", strokeOpacity: 0.8, strokeWeight: 4 }}
                        />
                    )}

                    {/* InfoWindow for selected lawyer or courthouse */}
                    {selectedLocation && (
                        <InfoWindow
                            position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                            onCloseClick={() => {
                                setSelectedLocation(null);
                                setRoutePath(null); // Remove directions when closing the info window
                            }}
                        >
                            <div style={{ color: "black" }}>
                                <h3 className="font-bold">{selectedLocation.name}</h3>
                                <button
                                    onClick={() => getDirections(selectedLocation)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded mt-2 hover:bg-blue-600"
                                >
                                    Get Directions
                                </button>
                            </div>
                        </InfoWindow>
                    )}

                    {/* Search Result Marker with InfoWindow */}
                    {searchCoordinates && (
                        <>
                            <Marker
                                position={searchCoordinates}
                                icon={{
                                    url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
                                }}
                                title="Searched Location"
                                onClick={() => setSelectedLocation({ 
                                    name: searchInput,
                                    lat: searchCoordinates.lat,
                                    lng: searchCoordinates.lng
                                })}
                            />
                            <InfoWindow
                                position={searchCoordinates}
                                onCloseClick={() => {
                                    setSelectedLocation(null);
                                    setRoutePath(null);
                                }}
                            >
                                <div style={{ color: "black" }}>
                                    <h3 className="font-bold">{searchInput}</h3>
                                    <button
                                        onClick={() => getDirections({
                                            lat: searchCoordinates.lat,
                                            lng: searchCoordinates.lng
                                        })}
                                        className="bg-blue-500 text-white px-3 py-1 rounded mt-2 hover:bg-blue-600"
                                    >
                                        Get Directions
                                    </button>
                                </div>
                            </InfoWindow>
                        </>
                    )}
                </GoogleMap>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default Maps;
