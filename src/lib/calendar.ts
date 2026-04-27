import { EventAttributes, createEvents } from 'ics';

export interface Birthday {
  name: string;
  date: Date;
  originalYear?: number;
}

export type CalendarType = 'recurring' | 'with_age';

export function generateICS(birthdays: Birthday[], type: CalendarType, targetYear: number): string {
  const events: EventAttributes[] = birthdays.map((bday) => {
    const month = bday.date.getMonth() + 1;
    const day = bday.date.getDate();
    
    let summary = `${bday.name}'s Birthday`;
    
    if (type === 'with_age' && bday.originalYear) {
      const age = targetYear - bday.originalYear;
      if (age > 0) {
        summary = `${bday.name}'s ${age}${getOrdinal(age)} Birthday`;
      }
    }

    const startYear = type === 'recurring' ? 2024 : targetYear;

    return {
      title: summary,
      start: [startYear, month, day],
      duration: { days: 1 },
      recurrenceRule: type === 'recurring' ? 'FREQ=YEARLY' : undefined,
      description: `Automatically generated from your vCard contacts.`,
      categories: ['Birthday'],
      status: 'CONFIRMED',
      busyStatus: 'FREE',
    };
  });

  const { error, value } = createEvents(events);
  
  if (error || !value) {
    throw new Error('Could not generate calendar events.');
  }

  return value;
}

function getOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
