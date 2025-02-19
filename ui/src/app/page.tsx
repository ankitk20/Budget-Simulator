import GoogleSignIn from "@/components/GoogleSignIn";
import UserSession from "@/components/UserSession";

export default function Home() {
  return (
    <main>
      <GoogleSignIn />
      <UserSession />
    </main>
  );
}
