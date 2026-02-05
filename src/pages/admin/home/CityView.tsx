import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const CityView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Sample locations for search
  const locations = [
    { name: "Colombo", lat: 6.9271, lng: 79.8612 },
    { name: "Kandy", lat: 7.2906, lng: 80.6337 },
    { name: "Galle", lat: 6.0535, lng: 80.2210 },
    { name: "Jaffna", lat: 9.6615, lng: 80.0255 },
    { name: "Negombo", lat: 7.2084, lng: 79.8358 },
    { name: "Trincomalee", lat: 8.5874, lng: 81.2152 },
    { name: "Anuradhapura", lat: 8.3114, lng: 80.4037 },
    { name: "Batticaloa", lat: 7.7310, lng: 81.6747 },
    { name: "Matara", lat: 5.9549, lng: 80.5550 },
    { name: "Nuwara Eliya", lat: 6.9497, lng: 80.7891 },
  ];

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create map
    const map = L.map(mapContainerRef.current).setView([6.9271, 79.8612], 13);
    mapRef.current = map;

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add initial markers
    const initialMarkers = [
      { lat: 6.9271, lng: 79.8612, title: "Colombo City Center" },
      { lat: 6.9355, lng: 79.8500, title: "Fort Railway Station" },
      { lat: 6.9147, lng: 79.9729, title: "Colombo Airport Area" },
    ];

    initialMarkers.forEach((markerData) => {
      const marker = L.marker([markerData.lat, markerData.lng])
        .addTo(map)
        .bindPopup(markerData.title);
      markersRef.current.push(marker);
    });

    // Cleanup on unmount
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const handleSearch = () => {
    const location = locations.find(
      (loc) => loc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (location && mapRef.current) {
      // Move map to location
      mapRef.current.setView([location.lat, location.lng], 14);
      
      // Add a marker for the searched location
      const marker = L.marker([location.lat, location.lng])
        .addTo(mapRef.current)
        .bindPopup(location.name)
        .openPopup();
      
      markersRef.current.push(marker);
    }
  };

  const handleQuickSearch = (location: typeof locations[0]) => {
    setSearchQuery(location.name);
    if (mapRef.current) {
      mapRef.current.setView([location.lat, location.lng], 14);
      
      const marker = L.marker([location.lat, location.lng])
        .addTo(mapRef.current)
        .bindPopup(location.name)
        .openPopup();
      
      markersRef.current.push(marker);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#6330B8]">City View</h1>
        <p className="text-muted-foreground mt-1">
          Monitor real-time locations and search cities on the map
        </p>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for a city (e.g., Colombo, Kandy, Galle)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} className="bg-[#6330B8] hover:bg-[#6330B8]/90">
            <MapPin className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
        
        {/* Quick location buttons */}
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-sm text-muted-foreground mr-2">Quick search:</span>
          {locations.slice(0, 5).map((loc) => (
            <Button
              key={loc.name}
              variant="outline"
              size="sm"
              onClick={() => handleQuickSearch(loc)}
            >
              {loc.name}
            </Button>
          ))}
        </div>
      </Card>

      {/* Map Container */}
      <Card className="p-0 overflow-hidden">
        <div ref={mapContainerRef} style={{ height: "600px", width: "100%" }} />
      </Card>

      {/* Map Info */}
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Map Information</h3>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• Click on markers to view location details</p>
          <p>• Use the search bar to find specific cities</p>
          <p>• Zoom in/out using the map controls or mouse wheel</p>
          <p>• Current markers: {markersRef.current.length}</p>
        </div>
      </Card>
    </div>
  );
};

export default CityView;