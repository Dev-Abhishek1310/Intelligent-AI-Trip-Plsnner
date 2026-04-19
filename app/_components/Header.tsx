"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { SignIn, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const menuOptions = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Discover",
    path: "/discover",
  },
  {
    name: "Reviews",
    path: "/reviews",
  },
  {
    name: "Pricing",
    path: "/pricing",
  },
  {
    name: "Contact us",
    path: "/contact-us",
  },
];

function Header() {
  const { user } = useUser();
  const path = usePathname();

  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex gap-2 items-center">
        <Image src="/logo.svg" alt="logo" width={30} height={30} />
        <h2 className="font-bold text-2xl sm:text-base md:text-lg">Intelligent Trip Planner</h2>
      </div>
      <div className="flex gap-5 items-center">
        {menuOptions.map((menu, index) => (
          <Link key={index} href={menu.path}>
            <h2 className="text-lg hover:scale-105 transition-all hover:text-primary">
              {menu.name}
            </h2>
          </Link>
        ))}
      </div>
      <div className="flex gap-5 items-center hidden sm:flex
      ">
        {!user ? (
          <SignInButton mode="modal">
            <Button>Get Started</Button>
          </SignInButton>
        ) : (
          <>
            {path !== "/create-new-trip" && (
              <Link href={"/create-new-trip"}>
                <Button className="cursor-pointer">Create New Trip</Button>
              </Link>
            )}
            {path !== "/my-trips" && (
              <Link href={"/my-trips"}>
                <Button variant="outline" className="cursor-pointer">
                  My Trip
                </Button>
              </Link>
            )}
          </>
        )}
        <UserButton />
      </div>
    </div>
  );
}

export default Header;