"use client";
import { Title } from "../ui/title/title";
import { FamilyList } from "../ui/form/family";
import { useEffect }  from "react"; 
export default function Home() {
  useEffect(() => {
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
  }, []);
    return (
        <div className="max-w-xl mx-auto space-y-6">
            <Title />
            <FamilyList />
        </div>
    );
}
