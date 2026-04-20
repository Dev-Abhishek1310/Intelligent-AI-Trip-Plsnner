'use client'

import React, { Suspense, useState } from 'react'
import dynamic from 'next/dynamic';
import ChatBox from './_components/ChatBox';
import Itinerary from './_components/Itinerary';
import { Button } from '@/components/ui/button';
import { Globe2, Plane } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const GlobalMap = dynamic(() => import('./_components/GlobalMap'), { ssr: false });

function CreateNewTripContent() {
  const [activeIndex, setActiveIndex] = useState(1);

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-5 p-10'>
      <div>
        <ChatBox />
      </div>
      <div className='col-span-2 relative'>
        {activeIndex === 0 ? <Itinerary /> : <GlobalMap />}

        <Tooltip>
          <TooltipTrigger asChild className='absolute bg-black bottom-10 left-1/2 -translate-x-1/2 rounded-2xl'>
            <Button
              className='bg-black hover:bg-gray-700'
              onClick={() => setActiveIndex(activeIndex == 0 ? 1 : 0)}
              size={'lg'}
            >
              {activeIndex == 0 ? <Plane /> : <Globe2 />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" align="center" sideOffset={10}>
            Switch between Map and Trip
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

export default function CreateNewTrip() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-500">Loading...</div>}>
      <CreateNewTripContent />
    </Suspense>
  );
}
