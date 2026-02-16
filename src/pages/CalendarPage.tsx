import { useState } from 'react';
import { ChevronLeft, ChevronRight, Cake, CalendarHeart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockContacts, getInitials, getAvatarColor } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarPage = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1)); // Feb 2026

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  // Get birthdays for current month
  const birthdaysThisMonth = mockContacts
    .filter(c => {
      const bDate = new Date(c.birthday);
      return bDate.getMonth() === month;
    })
    .map(c => ({
      ...c,
      day: new Date(c.birthday).getDate(),
    }));

  const prevMonth = () => setCurrentDate(new Date(year, month - 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1));

  const getDayBirthdays = (day: number) =>
    birthdaysThisMonth.filter(b => b.day === day);

  // Upcoming birthdays (next 90 days)
  const upcomingBirthdays = mockContacts
    .map(c => {
      const bDate = new Date(c.birthday);
      const thisYear = new Date(year, bDate.getMonth(), bDate.getDate());
      if (thisYear < today) thisYear.setFullYear(year + 1);
      const daysUntil = Math.floor((thisYear.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return { ...c, nextBirthday: thisYear, daysUntil };
    })
    .filter(c => c.daysUntil >= 0 && c.daysUntil <= 90)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="animate-in">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
          <CalendarHeart className="h-7 w-7 text-primary" /> Calendar
        </h1>
        <p className="text-muted-foreground mt-1">Never miss an important date</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 glass-card-static p-5 animate-in animate-in-delay-1">
          <div className="flex items-center justify-between mb-5">
            <Button variant="ghost" size="icon" className="rounded-xl" onClick={prevMonth}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-lg font-semibold text-foreground">{MONTHS[month]} {year}</h2>
            <Button variant="ghost" size="icon" className="rounded-xl" onClick={nextMonth}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map(d => (
              <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayBirthdays = getDayBirthdays(day);
              const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

              return (
                <div
                  key={day}
                  className={cn(
                    "aspect-square rounded-xl flex flex-col items-center justify-center text-sm relative transition-colors",
                    isToday && "bg-primary text-primary-foreground font-bold",
                    !isToday && dayBirthdays.length > 0 && "bg-accent/10",
                    !isToday && dayBirthdays.length === 0 && "hover:bg-secondary"
                  )}
                >
                  <span>{day}</span>
                  {dayBirthdays.length > 0 && (
                    <Cake className={cn("h-3 w-3 mt-0.5", isToday ? "text-primary-foreground" : "text-accent")} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-3 h-3 rounded bg-primary" /> Today
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Cake className="h-3 w-3 text-accent" /> Birthday
            </div>
          </div>
        </div>

        {/* Upcoming Birthdays sidebar */}
        <div className="space-y-4 animate-in animate-in-delay-2">
          <h3 className="font-semibold text-foreground">🎂 Upcoming Birthdays</h3>
          {upcomingBirthdays.length === 0 ? (
            <div className="glass-card-static p-4 text-center">
              <p className="text-sm text-muted-foreground">No birthdays in the next 90 days</p>
            </div>
          ) : (
            upcomingBirthdays.map(contact => (
              <div
                key={contact.id}
                className="glass-card p-4 cursor-pointer"
                onClick={() => navigate(`/contact/${contact.id}`)}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-primary-foreground", getAvatarColor(contact.name))}>
                    {getInitials(contact.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {contact.nextBirthday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={cn(
                      "text-xs font-semibold",
                      contact.daysUntil <= 7 ? "text-accent" : contact.daysUntil <= 30 ? "text-warning" : "text-muted-foreground"
                    )}>
                      {contact.daysUntil === 0 ? 'Today! 🎉' : `${contact.daysUntil}d`}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
