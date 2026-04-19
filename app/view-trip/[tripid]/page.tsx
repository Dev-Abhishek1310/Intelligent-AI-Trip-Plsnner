'use client'

import GlobalMap from '@/app/create-new-trip/_components/GlobalMap';
import TripDetailView from './_components/TripDetailView';
import { useTripDetail, useUserDetail } from '@/app/provider';
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

function ViewTrip() {
  const { tripid } = useParams();
  const { userDetail } = useUserDetail();
  const convex = useConvex();
  const [trip, setTrip] = useState<any>(null);
  const { setTripDetailInfo } = useTripDetail();

  useEffect(() => {
    if (!userDetail?._id || !tripid) return;
    GetTrip();
  }, [userDetail, tripid]);

  const GetTrip = async () => {
    const tripIdStr = Array.isArray(tripid) ? tripid[0] : tripid;
    if (!tripIdStr) return;

    try {
      const result = await convex.query(api.tripDetail.GetUserTripById, {
        uid: userDetail!._id,
        tripid: tripIdStr,
      });
      setTrip(result);
      setTripDetailInfo(result?.tripDetail);
    } catch (err) {
      console.error("Error fetching trip:", err);
    }
  };

  if (!trip) return <div className="p-10 text-center text-gray-500">Loading your trip…</div>;
  if (!tripid) return <div className="p-10 text-center">Trip ID not found.</div>;

  return (
    <div className='grid grid-cols-1 lg:grid-cols-5 gap-0'>
      <div className='lg:col-span-3'>
        <TripDetailView trip={trip.tripDetail} />
      </div>
      <div className='lg:col-span-2 lg:sticky lg:top-0 h-[calc(100vh-80px)]'>
        <GlobalMap />
      </div>
    </div>
  );
}

export default ViewTrip;