'use client';
import { useState, useEffect} from 'react';

export function FamilyList() {
  const [people, setPeople] = useState([]);

  useEffect(() => {
    fetch('/api/family')
    .then(res => res.json())
    .then(data => setPeople(
      data.children.toSorted((a, b) => Number(a.id) - Number(b.id))));
    
  }, []);
  return (
    <div className="text-gray-200">
    <ul>
      {people.map(person => (
        <li   className="flex justify-between gap-5 py-4 border-b border-gray-600"key={person.id}>
          <span>{person.name}</span>
          <span>({person.date})</span>
        </li>
      ))}
    </ul>
    </div>
  );
}