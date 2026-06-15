'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();

  // Do not render the footer on the contact page
  if (pathname === '/contact') {
    return null;
  }

  return <Footer />;
}
