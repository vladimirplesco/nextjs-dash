import Link from "next/link";

export default function PeoplePage() {
  return (
    <>
    <h1 className="text-3xl font-bold">
      People
    </h1>

    <p className="mt-4">
      Коллекция People редактируется через Keystatic.
    </p>

    <Link
      href="/keystatic"
      className="btn btn-primary mt-6"
      >
        Открыть редактор
    </Link>

    </>
  );
}