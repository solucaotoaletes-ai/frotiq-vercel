import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

const App = dynamic(() => import('../components/App'), { ssr: false });

export default function Home() {
  return <App />;
}
