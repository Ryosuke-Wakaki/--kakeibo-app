// components/CalendarView.tsx
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import jaLocale from "@fullcalendar/core/locales/ja";

export const Calendar = () => {
  return (
    <div style={{ marginTop: "20px" }}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locales={[jaLocale]}
        locale="ja"
        dateClick={(info) => alert(`${info.dateStr} がクリックされました`)}
      />
    </div>
  );
};
