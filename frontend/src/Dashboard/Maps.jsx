import '@babel/polyfill';
import { useEffect, useRef, useState } from "react";
import { useLoadScript, GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { toast } from 'sonner';
import AppSidebar from './AppSidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from '@/components/ui/separator';

const libraries = ["places"];

const Maps = () => {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [courts, setCourts] = useState([]);
    const [selectedCourt, setSelectedCourt] = useState(null);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
        libraries,
    });

    // Get user's current location
    useEffect(() => {
        if (navigator.geolocation && isLoaded) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setCurrentLocation({ lat, lng });
                    fetchNearbyCourts(lat, lng);  // Fetch courts nearby
                },
                () => {
                    toast.error("Failed to access location. Please enable location services.");
                }
            );
        }
    }, [isLoaded]);

    // Fetch legal courts near current location
    const fetchNearbyCourts = (lat, lng) => {
        const service = new window.google.maps.places.PlacesService(document.createElement('div'));

        const request = {
            location: new window.google.maps.LatLng(lat, lng),
            radius: 15000,  // 15 km range
            type: 'courthouse'  // Legal courts
        };

        service.nearbySearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                setCourts(results);
                toast.success(`Found ${results.length} legal courts nearby.`);
            } else {
                toast.error("No legal courts found nearby.");
            }
        });
    };

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading maps...</div>;

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset style={{ backgroundColor: `var(--background-color)` }}>
                <div className="flex items-center gap-2 mb-7">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb >
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block font-semibold">
                                Dashboard
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="font-semibold" style={{ color: `var(--text-color)` }}>My Profile</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <GoogleMap
                    center={currentLocation || { lat: 20.5937, lng: 78.9629 }}  // Default location (India)
                    zoom={13}
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                >
                    {currentLocation && (
                        <Marker
                            position={currentLocation}
                            icon={{
                                url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                            }}
                            title="Your Location"
                        />
                    )}

                    {courts.map((court, index) => (
                        <Marker
                            key={index}
                            position={{
                                lat: court.geometry.location.lat(),
                                lng: court.geometry.location.lng()
                            }}
                            onClick={() => setSelectedCourt(court)}
                            icon={{
                                url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                            }}
                        />
                    ))}

                    {selectedCourt && (
                        <InfoWindow
                            position={{
                                lat: selectedCourt.geometry.location.lat(),
                                lng: selectedCourt.geometry.location.lng()
                            }}
                            onCloseClick={() => setSelectedCourt(null)}
                        >
                            <div>
                                <h3 className="font-bold">{selectedCourt.name}</h3>
                                <p>{selectedCourt.vicinity}</p>
                                <p>Rating: {selectedCourt.rating || "N/A"}</p>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default Maps;
