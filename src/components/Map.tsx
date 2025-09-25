'use client';

import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';

interface Location {
  id: string;
  name: string;
  address: string;
}

interface MapComponentProps {
  firstLocation?: Location;
}

type LatLng = { lat: number; lng: number };

const FALLBACK_CENTER: LatLng = { lat: 21.3099, lng: -157.8581 };

const MapComponent = ({ firstLocation }: MapComponentProps) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const address = firstLocation?.address;
  const [center, setCenter] = useState<LatLng>(FALLBACK_CENTER);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // If no address or API key, show fallback immediately
    if (!apiKey || !address) {
      setReady(true);
      return () => {};
    }

    let cancelled = false;
    setReady(false);

    (async () => {
      try {
        const resp = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`,
        );
        const data = await resp.json();
        const loc = data.results?.[0]?.geometry?.location;
        if (!cancelled && loc) {
          setCenter({ lat: loc.lat, lng: loc.lng });
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    })();

    return () => { cancelled = true; };
  }, [apiKey, address]);

  if (!ready) {
    return (
      <div style={{
        width: '100%',
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8f9fa',
        borderRadius: '8px',
      }}
      >
        Loading map...
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey || ''}>
      <Map
        defaultZoom={15}
        defaultCenter={center}
        style={{ width: '100%', height: '400px' }}
        gestureHandling="greedy"
      />
    </APIProvider>
  );
};

MapComponent.defaultProps = {
  firstLocation: undefined,
};

export default MapComponent;
