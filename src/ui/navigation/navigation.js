import Link from "next/link";

export function Navigation() {
  return (
    <div className="navbar bg-neutral text-neutral-content shadow">
   {/* <div className="navbar bg_base-100 shadow shadow-emerald-200"> */}
  
      <div className="flex-1">
        <Link
          href="/"
          className="btn btn-ghost text-xl"
        >
          🌳 Имена и даты
        </Link>
      </div>

      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/">Главная</Link>
          </li>

          <li>
            <Link href="/keystatic" className="btn btn-primary btn-sm">
              Редактирование
            </Link>
          </li>
        </ul>
      </div>
    </div>

  );
}