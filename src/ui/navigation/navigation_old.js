import Link from "next/link";
import "./navigation.css";

export function Navigation() {
  return (
    <nav className="navigation">
      <div className="navigation__logo">
      {/* <div
        style={{
          color: "red",
          fontSize: "32px",
          fontWeight: "bold",
        }}
      > */}
        🌳 Имена и даты
      </div>

      <ul className="navigation__menu">
        <li>
          <Link href="/">Главная</Link>
        </li>

        <li>
          <Link href="/keystatic">
            Редактирование
          </Link>
        </li>
      </ul>
    </nav>
  );
}