'use client';
import { Fragment, useState, useEffect} from 'react';

export function FamilyList() {
  const [people, setPeople] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/api/family')
    .then(res => res.json())
    .then(data => {
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

  const getBirthdayKey = (date) => {
    const [day, month] = date.split('.');

    return `${month}-${day}`;
  }

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
            const age =
              filter === 'month' && daysUntil > 30
                ? getAgeThisYear(person.date)
                : getAgeOnBirthday(person.date);

            return (
              <Fragment key={person.id}>
                <div className="pl-4 py-2">
                  <div>{person.name}</div>
                  {!(filter === 'month' && daysUntil > 30) && (
                    <div className="text-sm text-gray-400">
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