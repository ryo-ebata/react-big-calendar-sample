import React, { useState, useEffect, useCallback } from 'react';
import { ConfigProvider, Layout, Spin, Alert } from 'antd';
import { CalendarHeader } from './components/CalendarHeader';
import { CalendarView } from './components/CalendarView';
import { useGoogleCalendar } from './hooks/useGoogleCalendar';
import { CalendarViewType } from './types/calendar';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import jaJP from 'antd/locale/ja_JP';

// 日本語設定
dayjs.locale('ja');

const { Content } = Layout;

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarViewType>('week');
  
  const {
    isSignedIn,
    events,
    loading,
    gapiLoaded,
    signIn,
    signOut,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent
  } = useGoogleCalendar();

  // サインイン状態が変わったらイベントを取得
  useEffect(() => {
    if (isSignedIn) {
      const startDate = dayjs(currentDate).subtract(1, 'month').toDate();
      const endDate = dayjs(currentDate).add(2, 'month').toDate();
      fetchEvents(startDate, endDate);
    }
  }, [isSignedIn, currentDate, fetchEvents]);

  // ナビゲーション処理
  const handleNavigate = useCallback((action: 'PREV' | 'NEXT' | 'TODAY') => {
    let newDate = dayjs(currentDate);
    
    switch (action) {
      case 'PREV':
        newDate = view === 'month' 
          ? newDate.subtract(1, 'month')
          : view === 'week'
          ? newDate.subtract(1, 'week')
          : newDate.subtract(1, 'day');
        break;
      case 'NEXT':
        newDate = view === 'month'
          ? newDate.add(1, 'month')
          : view === 'week'
          ? newDate.add(1, 'week')
          : newDate.add(1, 'day');
        break;
      case 'TODAY':
        newDate = dayjs();
        break;
    }
    
    setCurrentDate(newDate.toDate());
  }, [currentDate, view]);

  // 日付変更処理
  const handleDateChange = useCallback((date: Date) => {
    setCurrentDate(date);
  }, []);

  // ビュー変更処理
  const handleViewChange = useCallback((newView: CalendarViewType) => {
    setView(newView);
  }, []);

  if (!gapiLoaded) {
    return (
      <ConfigProvider locale={jaJP}>
        <Layout className="min-h-screen">
          <Content className="flex items-center justify-center">
            <div className="text-center">
              <Spin size="large" />
              <p className="mt-4 text-gray-600">Google APIを読み込んでいます...</p>
            </div>
          </Content>
        </Layout>
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider locale={jaJP}>
      <Layout className="min-h-screen bg-gray-50">
        <CalendarHeader
          currentDate={currentDate}
          view={view}
          isSignedIn={isSignedIn}
          loading={loading}
          onNavigate={handleNavigate}
          onViewChange={handleViewChange}
          onSignIn={signIn}
          onSignOut={signOut}
        />
        
        <Content className="flex-1">
          {!isSignedIn ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <Alert
                  message="Googleカレンダー連携"
                  description="Googleアカウントにサインインして、カレンダーの予定を表示・編集できます。"
                  type="info"
                  showIcon
                  className="mb-6"
                />
                <p className="text-gray-600 mb-4">
                  サインインするには、上部の「Googleでサインイン」ボタンをクリックしてください。
                </p>
              </div>
            </div>
          ) : (
            <CalendarView
              events={events}
              view={view}
              currentDate={currentDate}
              onNavigate={handleDateChange}
              onViewChange={handleViewChange}
              onCreateEvent={createEvent}
              onUpdateEvent={updateEvent}
              onDeleteEvent={deleteEvent}
              loading={loading}
            />
          )}
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;