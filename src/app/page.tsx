import { Avatar, AvatarFallback } from "@/elements/avatar";
import Collections from "@/pages/collections-page";

export default function Home() {
  return (
    <>
    <header className="flex flex-row justify-between p-4">
      <h2>Bidify</h2>
      <Avatar>
        <AvatarFallback>ME</AvatarFallback>
      </Avatar>
    </header>
    <Collections></Collections>
    <footer className="flex flex-row p-4 mt-auto">
      <p className="ml-auto">Copyright © 2025 Bidify</p>
    </footer>
    </>
  );
}
