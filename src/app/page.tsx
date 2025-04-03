import { AuthSection } from "@/components/auth/auth-section";
import Collections from "@/pages/collections-page";

export default function Home() {
  return (
    <>
    <header className="flex flex-row justify-between p-4">
      <h2>Bidify</h2>
      <AuthSection></AuthSection>
    </header>
    <Collections></Collections>
    <footer className="flex flex-row p-4 mt-auto">
      <p className="ml-auto">Copyright © 2025 Bidify</p>
    </footer>
    </>
  );
}
