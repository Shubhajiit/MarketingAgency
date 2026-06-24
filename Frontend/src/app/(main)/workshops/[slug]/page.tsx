import { redirect } from 'next/navigation';

export const revalidate = 60; // Revalidate every 60 seconds

async function getWorkshop(slug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
  try {
    const res = await fetch(`${apiUrl}/workshops/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data?.workshop;
  } catch (error) {
    console.error('Error fetching workshop details in ISR:', error);
    return null;
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function WorkshopsRedirectPage({ params }: PageProps) {
  const { slug } = await params;

  if (!slug) {
    redirect('/');
  }

  const workshop = await getWorkshop(slug);

  if (workshop) {
    if (workshop.type === 'three-days') {
      redirect(`/three-days-workshops/${slug}`);
    } else {
      redirect(`/one-day-workshop/${slug}`);
    }
  }

  redirect('/');
}
