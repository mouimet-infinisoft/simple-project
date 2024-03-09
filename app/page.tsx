"use client"
import { HomeComponent } from '@/components/ui/Home';
import { BrainStackProvider } from '../utils/BrainStackProvider';

export default function HomePage() {
  return (
    <BrainStackProvider>
      <HomeComponent/>
    </BrainStackProvider>
  );
}
