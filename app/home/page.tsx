'use client';

import { useEffect } from 'react'
import Auth from "@/context/auth.context";
import HomeComp from "@/components/Home";

export const metadata = {
  title: "Home | Chatsy",
}

export default function Home() {
  useEffect(() => {
    if ("serviceWorker"in navigator) {
      navigator.serviceWorker.register('/sw.js')
    }
  }, [])
  return (
    <>
      <Auth.Consumer>{({ user }) => <>{user && <HomeComp />}</>}</Auth.Consumer>
    </>
  );
}
