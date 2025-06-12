import React, { useState, useCallback, useMemo } from 'react';
import { Calendar, momentLocalizer, Views, View } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/ja';
import { CalendarEvent, CalendarViewType } from '../types/calendar';
import { EventModal } from './EventModal';
import { Video } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// 日本語設定
moment.locale('ja');
const localizer = momentLocalizer(moment);

interface CalendarViewProps {
  events: CalendarEvent[];
  view: CalendarViewType;
  currentDate: Date;
  onNavigate: (date: Date) => void;
  onViewChange: (view: CalendarViewType) => void;
  onCreateEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  onUpdateEvent: (eventId: string, event: Partial<CalendarEvent>) => void;
  onDeleteEvent: (eventId: string) => void;
  loading?: boolean;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  view,
  currentDate,
  onNavigate,
  onViewChange,
  onCreateEvent,
  onUpdateEvent,
  onDeleteEvent,
  loading = false
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);

  // react-big-calendarのビュー変換
  const bigCalendarView = useMemo(() => {
    switch (view) {
      case 'month': return Views.MONTH;
      case 'week': return Views.WEEK;
      case 'day': return Views.DAY;
      default: return Views.WEEK;
    }
  }, [view]);

  // イベントクリック処理
  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setSelectedSlot(null);
    setModalVisible(true);
  }, []);

  // 時間範囲選択処理
  const handleSelectSlot = useCallback(({ start, end }: { start: Date; end: Date }) => {
    setSelectedEvent(null);
    setSelectedSlot({ start, end });
    setModalVisible(true);
  }, []);

  // イベントドラッグ処理
  const handleEventDrop = useCallback(({ event, start, end }: { 
    event: CalendarEvent; 
    start: Date; 
    end: Date; 
  }) => {
    onUpdateEvent(event.id, { start, end });
  }, [onUpdateEvent]);

  // イベントリサイズ処理
  const handleEventResize = useCallback(({ event, start, end }: { 
    event: CalendarEvent; 
    start: Date; 
    end: Date; 
  }) => {
    onUpdateEvent(event.id, { start, end });
  }, [onUpdateEvent]);

  // モーダル閉じる処理
  const handleModalCancel = useCallback(() => {
    setModalVisible(false);
    setSelectedEvent(null);
    setSelectedSlot(null);
  }, []);

  // 新規イベント作成処理
  const handleCreateEvent = useCallback((eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent = selectedSlot 
      ? { ...eventData, start: selectedSlot.start, end: selectedSlot.end }
      : eventData;
    onCreateEvent(newEvent);
  }, [selectedSlot, onCreateEvent]);

  // イベントスタイル
  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    return {
      style: {
        backgroundColor: event.color || '#1890ff',
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  }, []);

  // カスタムイベントコンポーネント
  const EventComponent = ({ event }: { event: CalendarEvent }) => (
    <div className="flex items-center justify-between h-full">
      <span className="truncate flex-1">{event.title}</span>
      {event.meetLink && (
        <Video className="w-3 h-3 ml-1 flex-shrink-0" />
      )}
    </div>
  );

  // カレンダーメッセージの日本語化
  const messages = {
    allDay: '終日',
    previous: '前',
    next: '次',
    today: '今日',
    month: '月',
    week: '週',
    day: '日',
    agenda: 'アジェンダ',
    date: '日付',
    time: '時間',
    event: 'イベント',
    noEventsInRange: 'この期間にイベントはありません',
    showMore: (total: number) => `他 ${total} 件`
  };

  return (
    <div className="h-full bg-white">
      <div className="h-full p-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          titleAccessor="title"
          view={bigCalendarView}
          date={currentDate}
          onNavigate={onNavigate}
          onView={(newView: View) => {
            const viewMap: Record<View, CalendarViewType> = {
              [Views.MONTH]: 'month',
              [Views.WEEK]: 'week',
              [Views.DAY]: 'day',
              [Views.AGENDA]: 'month'
            };
            onViewChange(viewMap[newView] || 'week');
          }}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          onEventDrop={handleEventDrop}
          onEventResize={handleEventResize}
          selectable
          resizable
          popup
          eventPropGetter={eventStyleGetter}
          messages={messages}
          components={{
            event: EventComponent
          }}
          className="h-full"
          style={{ height: 'calc(100vh - 200px)' }}
          formats={{
            timeGutterFormat: 'HH:mm',
            eventTimeRangeFormat: ({ start, end }) => 
              `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`,
            dayFormat: 'M/D (ddd)',
            dateFormat: 'D',
            monthHeaderFormat: 'YYYY年 M月',
            dayHeaderFormat: 'M月D日 (ddd)',
            dayRangeHeaderFormat: ({ start, end }) =>
              `${moment(start).format('YYYY年M月D日')} - ${moment(end).format('M月D日')}`
          }}
        />
      </div>

      <EventModal
        visible={modalVisible}
        event={selectedEvent}
        onCancel={handleModalCancel}
        onSave={handleCreateEvent}
        onUpdate={onUpdateEvent}
        onDelete={onDeleteEvent}
        loading={loading}
      />
    </div>
  );
};