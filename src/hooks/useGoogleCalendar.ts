import { useState, useEffect, useCallback } from 'react';
import { CalendarEvent, GoogleCalendarEvent } from '../types/calendar';
import { message } from 'antd';

// モックデータ
const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'チーム会議',
    start: new Date(2025, 0, 13, 10, 0), // 2025年1月13日 10:00
    end: new Date(2025, 0, 13, 11, 0),   // 2025年1月13日 11:00
    description: 'プロジェクトの進捗確認と今後の計画について話し合います。',
    location: '会議室A',
    attendees: ['member1@example.com', 'member2@example.com'],
    color: '#1890ff',
    allDay: false
  },
  {
    id: '2',
    title: 'プレゼンテーション準備',
    start: new Date(2025, 0, 14, 14, 0), // 2025年1月14日 14:00
    end: new Date(2025, 0, 14, 16, 0),   // 2025年1月14日 16:00
    description: '来週のクライアントプレゼンテーションの資料作成',
    location: 'オフィス',
    attendees: ['designer@example.com'],
    color: '#52c41a',
    allDay: false
  },
  {
    id: '3',
    title: 'ランチミーティング',
    start: new Date(2025, 0, 15, 12, 0), // 2025年1月15日 12:00
    end: new Date(2025, 0, 15, 13, 30),  // 2025年1月15日 13:30
    description: '新規プロジェクトについてのカジュアルな打ち合わせ',
    location: 'レストラン ABC',
    attendees: ['client@example.com'],
    color: '#fa8c16',
    allDay: false
  },
  {
    id: '4',
    title: '年次総会',
    start: new Date(2025, 0, 16, 0, 0),  // 2025年1月16日 終日
    end: new Date(2025, 0, 16, 23, 59),  // 2025年1月16日 終日
    description: '会社の年次総会です。全社員参加必須。',
    location: 'ホテル XYZ',
    attendees: ['all@company.com'],
    color: '#722ed1',
    allDay: true
  },
  {
    id: '5',
    title: 'コードレビュー',
    start: new Date(2025, 0, 17, 9, 0),  // 2025年1月17日 9:00
    end: new Date(2025, 0, 17, 10, 30),  // 2025年1月17日 10:30
    description: '新機能のコードレビューセッション',
    location: 'オンライン',
    attendees: ['dev1@example.com', 'dev2@example.com', 'lead@example.com'],
    color: '#eb2f96',
    allDay: false
  },
  {
    id: '6',
    title: 'クライアント訪問',
    start: new Date(2025, 0, 17, 15, 0), // 2025年1月17日 15:00
    end: new Date(2025, 0, 17, 17, 0),   // 2025年1月17日 17:00
    description: 'プロジェクトの最終確認とデモンストレーション',
    location: 'クライアント オフィス',
    attendees: ['client@example.com', 'manager@example.com'],
    color: '#13c2c2',
    allDay: false
  }
];

declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

export const useGoogleCalendar = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [gapiLoaded, setGapiLoaded] = useState(true); // モック環境では常にtrue

  // モック用の遅延関数
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // 初期化（モック）
  useEffect(() => {
    // モック環境では即座に初期化完了
    setGapiLoaded(true);
  }, []);

  // サインイン（モック）
  const signIn = async () => {
    setLoading(true);
    try {
      await delay(1000); // 1秒の遅延でリアルな感じを演出
      setIsSignedIn(true);
      message.success('Googleアカウントにサインインしました（モック）');
    } catch (error) {
      message.error('サインインに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // サインアウト（モック）
  const signOut = async () => {
    setLoading(true);
    try {
      await delay(500);
      setIsSignedIn(false);
      setEvents([]);
      message.success('サインアウトしました');
    } catch (error) {
      message.error('サインアウトに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // イベント一覧取得（モック）
  const fetchEvents = useCallback(async (startDate?: Date, endDate?: Date) => {
    if (!isSignedIn) return;

    setLoading(true);
    try {
      await delay(800); // API呼び出しの遅延をシミュレート
      
      // 日付範囲でフィルタリング（簡易版）
      let filteredEvents = mockEvents;
      if (startDate && endDate) {
        filteredEvents = mockEvents.filter(event => 
          event.start >= startDate && event.start <= endDate
        );
      }
      
      setEvents(filteredEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      message.error('イベントの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, [isSignedIn]);

  // イベント作成（モック）
  const createEvent = async (event: Omit<CalendarEvent, 'id'>) => {
    if (!isSignedIn) return;

    setLoading(true);
    try {
      await delay(1000);
      
      const newEvent: CalendarEvent = {
        ...event,
        id: Date.now().toString(), // 簡易的なID生成
        color: event.color || '#1890ff'
      };
      
      setEvents(prevEvents => [...prevEvents, newEvent]);
      message.success('イベントを作成しました（モック）');
    } catch (error) {
      console.error('Failed to create event:', error);
      message.error('イベントの作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // イベント更新（モック）
  const updateEvent = async (eventId: string, eventUpdate: Partial<CalendarEvent>) => {
    if (!isSignedIn) return;

    setLoading(true);
    try {
      await delay(800);
      
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId 
            ? { ...event, ...eventUpdate }
            : event
        )
      );
      
      message.success('イベントを更新しました（モック）');
    } catch (error) {
      console.error('Failed to update event:', error);
      message.error('イベントの更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // イベント削除（モック）
  const deleteEvent = async (eventId: string) => {
    if (!isSignedIn) return;

    setLoading(true);
    try {
      await delay(600);
      
      setEvents(prevEvents => 
        prevEvents.filter(event => event.id !== eventId)
      );
      
      message.success('イベントを削除しました（モック）');
    } catch (error) {
      console.error('Failed to delete event:', error);
      message.error('イベントの削除に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
};