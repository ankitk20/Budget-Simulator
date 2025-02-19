import Auth from "@/components/Auth";
import Hero from "@/components/Hero";
import UserSession from "@/components/UserSession";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-6">
      <Hero />
      <Auth />
    </main>
  );
}
