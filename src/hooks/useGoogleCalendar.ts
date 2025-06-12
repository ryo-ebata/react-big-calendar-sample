import { useState, useEffect, useCallback } from 'react';
import { CalendarEvent, GoogleCalendarEvent } from '../types/calendar';
import { message } from 'antd';

// 充実したモックデータ（Google Calendar API風）
const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'チーム会議 - 週次進捗確認',
    start: new Date(2025, 0, 13, 10, 0), // 2025年1月13日 10:00
    end: new Date(2025, 0, 13, 11, 0),   // 2025年1月13日 11:00
    description: 'プロジェクトの進捗確認と今後の計画について話し合います。アジェンダ：\n1. 先週の成果報告\n2. 今週の目標設定\n3. 課題と対策',
    location: '会議室A / オンライン',
    attendees: ['tanaka@company.com', 'sato@company.com', 'yamada@company.com'],
    color: '#1890ff',
    allDay: false,
    meetLink: 'https://meet.google.com/abc-defg-hij',
    meetId: 'abc-defg-hij'
  },
  {
    id: '2',
    title: 'プレゼンテーション準備',
    start: new Date(2025, 0, 14, 14, 0), // 2025年1月14日 14:00
    end: new Date(2025, 0, 14, 16, 0),   // 2025年1月14日 16:00
    description: '来週のクライアントプレゼンテーションの資料作成\n・デザインレビュー\n・コンテンツ最終確認',
    location: 'デザインルーム',
    attendees: ['designer@company.com', 'marketing@company.com'],
    color: '#52c41a',
    allDay: false
  },
  {
    id: '3',
    title: 'ランチミーティング with クライアント',
    start: new Date(2025, 0, 15, 12, 0), // 2025年1月15日 12:00
    end: new Date(2025, 0, 15, 13, 30),  // 2025年1月15日 13:30
    description: '新規プロジェクトについてのカジュアルな打ち合わせ\n・要件のヒアリング\n・予算感の確認',
    location: 'レストラン ABC（銀座）',
    attendees: ['client@example.com', 'sales@company.com'],
    color: '#fa8c16',
    allDay: false
  },
  {
    id: '4',
    title: '年次総会 2025',
    start: new Date(2025, 0, 16, 0, 0),  // 2025年1月16日 終日
    end: new Date(2025, 0, 16, 23, 59),  // 2025年1月16日 終日
    description: '会社の年次総会です。全社員参加必須。\n・2024年度実績報告\n・2025年度事業計画発表\n・表彰式',
    location: 'ホテル XYZ 大宴会場',
    attendees: ['all@company.com'],
    color: '#722ed1',
    allDay: true,
    meetLink: 'https://meet.google.com/annual-meeting-2025',
    meetId: 'annual-meeting-2025'
  },
  {
    id: '5',
    title: 'コードレビュー - 新機能実装',
    start: new Date(2025, 0, 17, 9, 0),  // 2025年1月17日 9:00
    end: new Date(2025, 0, 17, 10, 30),  // 2025年1月17日 10:30
    description: '新機能のコードレビューセッション\n・セキュリティチェック\n・パフォーマンス最適化\n・テストカバレッジ確認',
    location: 'オンライン',
    attendees: ['dev1@company.com', 'dev2@company.com', 'lead@company.com'],
    color: '#eb2f96',
    allDay: false,
    meetLink: 'https://meet.google.com/code-review-session',
    meetId: 'code-review-session'
  },
  {
    id: '6',
    title: 'クライアント訪問 - デモンストレーション',
    start: new Date(2025, 0, 17, 15, 0), // 2025年1月17日 15:00
    end: new Date(2025, 0, 17, 17, 0),   // 2025年1月17日 17:00
    description: 'プロジェクトの最終確認とデモンストレーション\n・システムデモ\n・ユーザビリティテスト\n・フィードバック収集',
    location: 'クライアント オフィス（新宿）',
    attendees: ['client@example.com', 'manager@company.com', 'engineer@company.com'],
    color: '#13c2c2',
    allDay: false
  },
  {
    id: '7',
    title: '1on1 ミーティング - 田中さん',
    start: new Date(2025, 0, 13, 16, 0), // 2025年1月13日 16:00
    end: new Date(2025, 0, 13, 16, 30),  // 2025年1月13日 16:30
    description: '月次1on1ミーティング\n・キャリア相談\n・目標設定\n・フィードバック',
    location: '小会議室B',
    attendees: ['tanaka@company.com'],
    color: '#f759ab',
    allDay: false,
    meetLink: 'https://meet.google.com/one-on-one-tanaka',
    meetId: 'one-on-one-tanaka'
  },
  {
    id: '8',
    title: 'デザインレビュー会',
    start: new Date(2025, 0, 14, 10, 0), // 2025年1月14日 10:00
    end: new Date(2025, 0, 14, 11, 30),  // 2025年1月14日 11:30
    description: 'UIデザインの最終レビュー\n・ユーザビリティ確認\n・アクセシビリティチェック\n・ブランドガイドライン準拠確認',
    location: 'デザインスタジオ',
    attendees: ['designer1@company.com', 'designer2@company.com', 'ux@company.com'],
    color: '#40a9ff',
    allDay: false,
    meetLink: 'https://meet.google.com/design-review-ui',
    meetId: 'design-review-ui'
  },
  {
    id: '9',
    title: 'セキュリティ監査',
    start: new Date(2025, 0, 15, 9, 0),  // 2025年1月15日 9:00
    end: new Date(2025, 0, 15, 12, 0),   // 2025年1月15日 12:00
    description: '四半期セキュリティ監査\n・脆弱性スキャン\n・アクセス権限確認\n・セキュリティポリシー更新',
    location: 'セキュリティルーム',
    attendees: ['security@company.com', 'admin@company.com'],
    color: '#ff7875',
    allDay: false
  },
  {
    id: '10',
    title: 'マーケティング戦略会議',
    start: new Date(2025, 0, 16, 14, 0), // 2025年1月16日 14:00
    end: new Date(2025, 0, 16, 16, 0),   // 2025年1月16日 16:00
    description: 'Q1マーケティング戦略の策定\n・ターゲット分析\n・キャンペーン企画\n・予算配分',
    location: 'マーケティング部',
    attendees: ['marketing@company.com', 'sales@company.com', 'analytics@company.com'],
    color: '#95de64',
    allDay: false,
    meetLink: 'https://meet.google.com/marketing-strategy-q1',
    meetId: 'marketing-strategy-q1'
  },
  {
    id: '11',
    title: 'システムメンテナンス',
    start: new Date(2025, 0, 18, 2, 0),  // 2025年1月18日 2:00
    end: new Date(2025, 0, 18, 6, 0),    // 2025年1月18日 6:00
    description: '定期システムメンテナンス\n・データベース最適化\n・セキュリティパッチ適用\n・バックアップ確認',
    location: 'データセンター',
    attendees: ['ops@company.com', 'dba@company.com'],
    color: '#ffc069',
    allDay: false
  },
  {
    id: '12',
    title: '新入社員研修',
    start: new Date(2025, 0, 14, 9, 0),  // 2025年1月14日 9:00
    end: new Date(2025, 0, 14, 17, 0),   // 2025年1月14日 17:00
    description: '新入社員向けオリエンテーション\n・会社概要説明\n・システム利用方法\n・メンター紹介',
    location: '研修室',
    attendees: ['hr@company.com', 'mentor1@company.com', 'mentor2@company.com'],
    color: '#b37feb',
    allDay: false,
    meetLink: 'https://meet.google.com/new-employee-training',
    meetId: 'new-employee-training'
  },
  {
    id: '13',
    title: 'プロダクトロードマップ会議',
    start: new Date(2025, 0, 15, 15, 0), // 2025年1月15日 15:00
    end: new Date(2025, 0, 15, 17, 0),   // 2025年1月15日 17:00
    description: '2025年度プロダクトロードマップの策定\n・機能優先度決定\n・リリーススケジュール\n・リソース配分',
    location: 'プロダクト会議室',
    attendees: ['product@company.com', 'engineering@company.com', 'design@company.com'],
    color: '#36cfc9',
    allDay: false,
    meetLink: 'https://meet.google.com/product-roadmap-2025',
    meetId: 'product-roadmap-2025'
  },
  {
    id: '14',
    title: 'お客様サポート定例会',
    start: new Date(2025, 0, 16, 10, 0), // 2025年1月16日 10:00
    end: new Date(2025, 0, 16, 11, 0),   // 2025年1月16日 11:00
    description: 'カスタマーサポート状況の共有\n・問い合わせ傾向分析\n・FAQ更新\n・改善提案',
    location: 'サポートセンター',
    attendees: ['support@company.com', 'qa@company.com'],
    color: '#ffec3d',
    allDay: false
  },
  {
    id: '15',
    title: 'ベンダー打ち合わせ',
    start: new Date(2025, 0, 17, 13, 0), // 2025年1月17日 13:00
    end: new Date(2025, 0, 17, 14, 30),  // 2025年1月17日 14:30
    description: '新システム導入に関する打ち合わせ\n・要件確認\n・見積もり調整\n・導入スケジュール',
    location: 'ベンダー会議室',
    attendees: ['vendor@example.com', 'procurement@company.com'],
    color: '#ff9c6e',
    allDay: false,
    meetLink: 'https://meet.google.com/vendor-meeting-system',
    meetId: 'vendor-meeting-system'
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
      await delay(1200); // リアルなAPI呼び出し感を演出
      setIsSignedIn(true);
      // サインイン後に自動的にイベントを設定
      setEvents(mockEvents);
      message.success(`Googleカレンダーに接続しました（${mockEvents.length}件の予定を取得）`);
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
      
      // 日付範囲でフィルタリング（実際のAPI風）
      let filteredEvents = mockEvents;
      if (startDate && endDate) {
        filteredEvents = mockEvents.filter(event => 
          event.start >= startDate && event.start <= endDate
        );
      }
      
      setEvents(filteredEvents);
      console.log('Fetched events:', filteredEvents.length);
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
      await delay(1200);
      
      const newEvent: CalendarEvent = {
        ...event,
        id: `event_${Date.now()}`, // より現実的なID生成
        color: event.color || '#1890ff'
      };
      
      setEvents(prevEvents => [...prevEvents, newEvent]);
      message.success('新しい予定を作成しました');
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
      await delay(900);
      
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId 
            ? { ...event, ...eventUpdate }
            : event
        )
      );
      
      message.success('予定を更新しました');
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
      await delay(700);
      
      setEvents(prevEvents => 
        prevEvents.filter(event => event.id !== eventId)
      );
      
      message.success('予定を削除しました');
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