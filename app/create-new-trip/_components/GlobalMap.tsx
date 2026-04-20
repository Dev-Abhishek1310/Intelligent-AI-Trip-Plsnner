'use client';

import React, { useEffect, useRef } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import { useTripDetail } from '@/app/provider';
import { Activity, Itinerary } from './ChatBox';

function GlobalMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const { tripDetailInfo } = useTripDetail();

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY || '';

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [0, 20],
      zoom: 2,
      projection: 'globe',
    });

    const bounds = new mapboxgl.LngLatBounds();
    const markers: mapboxgl.Marker[] = [];

    tripDetailInfo?.itinerary?.forEach((day: Itinerary) => {
      day.activities?.forEach((activity: Activity) => {
        if (
          activity?.geo_coordinates &&
          typeof activity.geo_coordinates.longitude === 'number' &&
          typeof activity.geo_coordinates.latitude === 'number'
        ) {
          const marker = new mapboxgl.Marker({ color: '#ff4500' })
            .setLngLat([activity.geo_coordinates.longitude, activity.geo_coordinates.latitude])
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(activity.place_name))
            .addTo(mapRef.current!);

          markers.push(marker);
          bounds.extend([activity.geo_coordinates.longitude, activity.geo_coordinates.latitude]);
        }
      });
    });

    mapRef.current.on('load', () => {
      if (!bounds.isEmpty()) {
        mapRef.current!.fitBounds(bounds, { padding: 60, maxZoom: 10 });
      }
    });

    return () => {
      markers.forEach((m) => m.remove());
      mapRef.current?.remove();
    };
  }, [tripDetailInfo]);

  return (
    <div
      ref={mapContainerRef}
      style={{ width: '95%', height: '85vh', borderRadius: '20px' }}
    />
  );
}

export default GlobalMap;
