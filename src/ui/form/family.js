'use client';
import { Fragment, useState, useEffect} from 'react';

export function FamilyList() {
  const [people, setPeople] = useState([]);
  const [filter, setFilter] = useState('all');

  // console.log('PEOPLE:', people);
  useEffect(() => {
    fetch('/api/family')
    .then(res => res.json())
    .then(data => {
      // console.log('CHILDREN:', JSON.stringify(data.children, null, 2));
      setPeople(
        data.children.toSorted(
          (a, b) => Number(a.id) - Number(b.id)
        )
      );
    });
  }, []);

  const getBirthdayThisYear = (date) => {
    const [day, month] = date.split('.').map(Number);

    const birthday = new Date();
    birthday.setMonth(month - 1);
    birthday.setDate(day);
    birthday.setHours(0,0,0,0);

    return birthday;
  };

  console.log(
    `BIRTHDAYS:`,
    people.map(person => (
      {
        name: person.name,
        birthday: getBirthdayThisYear(person.date),
      }
    ))
  );

  const getBirthdayKey = (date) => {
    const [day, month] = date.split('.');

    return `${month}-${day}`;
  }

  console.log(
    `BIRTHDAY KEYS:`,
    people.map(person => ({
      name: person.name,
      key: getBirthdayKey(person.date),
    }))
  );

  const formatBirthdayKey = (key) =>{
    const [month, day] = key.split('-');

    const months = [
      'января',
      'февраля',
      'марта',
      'апреля',
      'мая',
      'июня',
      'июля',
      'августа',
      'сентября',
      'октября',
      'ноября',
      'декабря',
    ];

    return `${Number(day)} ${months[Number(month) - 1]}`;
  }

  const getAgeOnBirthday = (date) => {
    const [day, month, year] = date.split('.').map(Number);

    const today = new Date();

    const birthdayThisYear = new Date(
      today.getFullYear(),
      month - 1,
      day
    );

    const todayDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    let birthdayYear = today.getFullYear();

    if (birthdayThisYear < todayDate) {
      birthdayYear++;
    }

    return birthdayYear - Number(year);
  }

  console.log(
    'AGES:',
    people.map(person => ({
      name: person.name,
      age: getAgeOnBirthday(person.date),
    }))
  );

  const getAgeThisYear = (dateString) => {
    const [, , birthYear] = dateString.split('.').map(Number);

    return new Date().getFullYear() - birthYear;
  };

  const getAgeWord = (age) => {
    const lastTwo = age%100;
    const lastOne = age%10;

    if (lastTwo >= 11 && lastTwo <= 20) {
      return 'лет';
    }

    if (lastOne === 1) {
      return 'год';
    }

    if (lastOne >= 2 && lastOne <= 4) {
      return 'года';
    }

    return 'лет';
  }

  console.log(
    [1, 2, 4, 5, 11, 12, 14, 20, 21, 22, 24, 25, 31, 32, 35]
    .map(age => `${age} ${getAgeWord(age)}`)
  );

  const getDaysWord = (days) => {
    const lastTwo = days % 100;
    const lastOne = days % 10;

    if (lastTwo >= 11 && lastTwo <= 20) {
      return 'дней';
    }

    if (lastOne === 1) {
      return 'день';
    }

    if (lastOne >= 2 && lastOne <= 4) {
      return 'дня';
    }

    return 'дней';
  };

  console.log(
    [1, 2, 4, 5, 11, 12, 14, 20, 21, 22, 24, 25, 31, 32, 35]
    .map(day => `${day} ${getDaysWord(day)}`)
  );

  const getPeopleWord = (count) => {
    const lastTwo = count%100;
    const lastOne = count%10;

    if (lastTwo >= 11 && lastTwo <= 20) {
      return 'человек';
    }

    if (lastOne === 1) {
      return 'человек';
    }

    if (lastOne >= 2 && lastOne <= 4) {
      return 'человека';
    }

    return 'человек';
  };

  console.log(
  [1, 2, 4, 5, 11, 12, 14, 20, 21, 22, 24, 25, 31, 32, 35]
    .map(count => `${count} ${getPeopleWord(count)}`)
);

  const getDaysUntilBirthday = (date) => {

    const today = new Date();
    const [day, month] = date.split('.').map(Number);

    const todayUTC = Date.UTC(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    let birthdayUTC = Date.UTC(
      today.getFullYear(),
      month - 1,
      day
    );

    if (birthdayUTC < todayUTC) {
      birthdayUTC = Date.UTC(
        today.getFullYear() + 1,
        month - 1,
        day
      );
    }

    const diff = birthdayUTC - todayUTC;

    return diff / (1000 * 60 * 60 * 24);
  }

  console.log(
    `DAYS UNTIL:`,
    people.map(person => (
      {
        name: person.name,
        date: person.date,
        birthday: getDaysUntilBirthday(person.date),
      }
    ))
  );

  const filteredPeople = people.filter(person => {
    const days = getDaysUntilBirthday(person.date);
    if (filter === 'today') {
      return days === 0;
    }

    if (filter === '3days') {
      return days >= 0 && days <= 3;
    }

    if (filter === 'week') {
      return days >= 0 && days <= 7;
    }

    if (filter === '30days') {
      return days >= 0 && days <= 30;
    }

    if (filter === 'month') {
      const [, month] = person.date.split('.').map(Number);

      return month === new Date(). getMonth() + 1;
    }

    return true;
  })

  console.log(`FILTERED:`, filter, filteredPeople);

  const countToday = people.filter(
    person => getDaysUntilBirthday(person.date) === 0
  ).length;

  const count3Days = people.filter(
    person => getDaysUntilBirthday(person.date) <= 3
  ).length;

  const countWeek = people.filter(
    person => getDaysUntilBirthday(person.date) <= 7
  ).length;

  const count30Days = people.filter(
    person => getDaysUntilBirthday(person.date) <= 30
  ).length;

  const countMonth = people.filter(person => {
    const [, month] = person.date.split('.').map(Number);

    return month === new Date().getMonth() + 1
  }).length;

  const sortedPeople = [...filteredPeople].sort(
    (a,b) =>
      getDaysUntilBirthday(a.date) -
      getDaysUntilBirthday(b.date)
  );

  const groupedPeople = sortedPeople.reduce((groups, person) => {
    const key = getBirthdayKey(person.date);

    if(!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(person);

    return groups;
  }, {});

  console.log('GROUPED:', groupedPeople);

  const sortedGroups = Object.entries(groupedPeople).sort(
    ([keyA], [keyB]) => {
      const personA = groupedPeople[keyA][0];
      const personB = groupedPeople[keyB][0];

      if (filter === 'month') {
        const [, dayA] = keyA.split('-').map(Number);
        const [, dayB] = keyB.split('-').map(Number);

        return dayA - dayB;
      }

      return (
        getDaysUntilBirthday(personA.date) -
        getDaysUntilBirthday(personB.date)
      );

    }
  );

  console.log(
    'FILTER TEST:',
    people.map(
      person => ({
        name: person.name,
        days: getDaysUntilBirthday(person.date),
        in30days: getDaysUntilBirthday(person.date) <= 30,
      })
    )
  );

  return (
    <div className="text-gray-200">
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`btn ${filter === 'all' ? 'btn-primary' : ''}`}
        >
          Все ({people.length})
        </button>

        <button
          onClick={() => setFilter('today')}
          className={`btn ${filter === 'today' ? 'btn-primary' : ''}`}
        >
          Сегодня ({countToday})
        </button>

        <button
          onClick={() => setFilter('3days')}
          className={`btn ${filter === '3days' ? 'btn-primary' : ''}`}
        >
          3 дня ({count3Days})
        </button>

        <button
          onClick={() => setFilter('week')}
          className={`btn ${filter === 'week' ? 'btn-primary' : ''}`}
        >
          Неделя ({countWeek})
        </button>

        <button
          onClick={() => setFilter('30days')}
          className={`btn ${filter === '30days' ? 'btn-primary' : ''}`}
        >
          30 дней ({count30Days})
        </button>

        <button
          onClick={() => setFilter('month')}
          className={`btn ${filter === 'month' ? 'btn-primary' : ''}`}
        >
          Месяц ({countMonth})
        </button>



      </div>
    <ul>
      {/* {people.map(person => ( */}
      {/* {filteredPeople.map(person => ( */}
      {/* {sortedPeople.map(person => (
        <li   className="flex justify-between gap-5 py-4 border-b border-gray-600"key={person.id}>
          <span>{person.name}</span>
          <span className="text-right">
            <span>({person.date})</span>

            <span className="block text-sm text-gray-400">
              {daysUntil === 0
                ? '🎂 Сегодня'
                : 'через ' + daysUntil + ' ' + getDaysWord(daysUntil)
              }

            </span>
          </span>
        </li>
      ))} */}
      {/* {Object.entries(groupedPeople).map(([key, group]) => ( */}
      {sortedGroups.map(([key, group]) => {
        const daysUntil = getDaysUntilBirthday(group[0].date);
        const ageOnBirthday = getAgeThisYear(group[0].date);

        return (
        <li
          key={key}
          className={
            daysUntil === 0
              ? 'py-4 border-b border-gray-600 bg-gray-800 rounded-lg'
              : 'py-4 border-b border-gray-600'
          }
        >
          <div className="py-2">
            <div className="font-semibold">
              🎂 {formatBirthdayKey(key)}
              {group.length > 1 && (
                <span className="text-sm text-gray-400 ml-2">
                  · {group.length} {getPeopleWord(group.length)}
                </span>
              )}
            </div>

            <div className="text-sm text-gray-400">
              {daysUntil === 0
                ? '🎉 Сегодня!'
                : filter === 'month' && daysUntil > 30
                  ? 'В этом году исполнилось ' + ageOnBirthday + ' ' + getAgeWord(ageOnBirthday)
                  : 'через ' + daysUntil + ' ' + getDaysWord(daysUntil)
              }
            </div>

          </div>
          {group.map(person => {
            // const age = getAgeOnBirthday(person.date);
            const age =
              filter === 'month' && daysUntil > 30
                ? getAgeThisYear(person.date)
                : getAgeOnBirthday(person.date);

            return (
              <Fragment key={person.id}>
                <div className="pl-4 py-2">
                  <div>{person.name}</div>
                  {/* <div className="text-sm text-gray-400">
                    {filter === 'month' && daysUntil > 30
                      ? 'В этом году исполнилось ' + age + ' ' + getAgeWord(age)
                      : 'исполняется ' + age + ' ' + getAgeWord(age)
                    }
                  </div> */}
                  {!(filter === 'month' && daysUntil > 30) && (
                    <div className="text-sm text-gray-400">
                      {/* {'исполняется ' + age + ' ' + getAgeWord(age)} */}
                      {daysUntil === 0
                        ? 'Исполняется ' + age + ' ' + getAgeWord(age)
                        : 'Исполнится ' + age + ' ' + getAgeWord(age)
                      }
                    </div>
                  )}
                </div>
              </Fragment>
            )
          })}

        </li>
        );
      })}
    </ul>
    </div>
  );
}