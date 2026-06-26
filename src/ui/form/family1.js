// import familyData from './familyData.json';
import familyData from './familyData.js';

export function FamilyList() {
  return (
    <ul>
      {/* {familyData.children.map(person => ( */}
      {familyData.map(person => (
        <li key={person.id}>
          {person.name} ({person.date})
        </li>
      ))}
    </ul>
  );
}