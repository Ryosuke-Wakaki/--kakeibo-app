import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import jaLocale from "@fullcalendar/core/locales/ja";

import type { CalendarProps } from "../types/props";

export const Calendar = (props: CalendarProps ) => {
  const { onMonthChange, onDateClick, dailySummaries } = props;

  // 日別の収支データをFullCalendarのイベント形式に変換
  const events = Object.entries(dailySummaries).flatMap(([date, summary]) => {
    const eventsForDate = [];
    
    // 収入がある場合は青いイベントを追加
    if (summary.income > 0) {
      eventsForDate.push({
        date: date,
        display: 'block' as const,
        title: `¥${summary.income.toLocaleString()}`,
        backgroundColor: '#2196f3',  // 青
        borderColor: '#2196f3',      // 青
        textColor: '#ffffff'         // 白文字
      });
    }
    
    // 支出がある場合は赤いイベントを追加
    if (summary.expense > 0) {
      eventsForDate.push({
        date: date,
        display: 'block' as const,
        title: `¥${summary.expense.toLocaleString()}`,
        backgroundColor: '#f44336',  // 赤
        borderColor: '#f44336',      // 赤
        textColor: '#ffffff'         // 白文字
      });
    }
    
    return eventsForDate;
  });

  return (
    <div style={{ marginTop: "20px" }}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locales={[jaLocale]}
        locale="ja"
        selectable={true}
        events={events}
        dateClick={(info) => {
          const formattedDate = info.dateStr.replace(/-/g, "/"); // yyyy/MM/dd
          onDateClick(formattedDate);
        }}
        datesSet={(info) => {
          // info.view.currentStart は表示している月の1日を指す
          const currentStart = info.view.currentStart;
          const month = `${currentStart.getFullYear()}/${String(currentStart.getMonth() + 1).padStart(2, "0")}`;
          onMonthChange(month);
        }}
        eventContent={(eventInfo) => {
          return (
            <div style={{ 
              fontSize: '0.75rem', 
              padding: '2px 6px',
              fontWeight: '500',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {eventInfo.event.title}
            </div>
          );
        }}
      />
    </div>
  );
};
