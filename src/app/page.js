"use client";
import { Title } from "../ui/title/title";
import { FamilyList } from "../ui/form/family";

export default function Home() {
    return (
        <div className="max-w-xl mx-auto space-y-6">
            <Title />
            <FamilyList />
        </div>
    )
}
