import React from 'react';
import { Button, Space, Typography } from 'antd';
import { ChevronLeft, ChevronRight, Calendar, User, LogOut } from 'lucide-react';
import { CalendarViewType } from '../types/calendar';
import dayjs from 'dayjs';

const { Title } = Typography;

interface CalendarHeaderProps {
  currentDate: Date;
  view: CalendarViewType;
  isSignedIn: boolean;
  loading: boolean;
  onNavigate: (action: 'PREV' | 'NEXT' | 'TODAY') => void;
  onViewChange: (view: CalendarViewType) => void;
  onSignIn: () => void;
  onSignOut: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  view,
  isSignedIn,
  loading,
  onNavigate,
  onViewChange,
  onSignIn,
  onSignOut
}) => {
  const getDateTitle = () => {
    switch (view) {
      case 'month':
        return dayjs(currentDate).format('YYYY年 M月');
      case 'week':
        const startOfWeek = dayjs(currentDate).startOf('week');
        const endOfWeek = dayjs(currentDate).endOf('week');
        return `${startOfWeek.format('YYYY年 M月D日')} - ${endOfWeek.format('M月D日')}`;
      case 'day':
        return dayjs(currentDate).format('YYYY年 M月D日 (ddd)');
      default:
        return '';
    }
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            <Title level={3} className="!mb-0 text-gray-800">
              カレンダー
            </Title>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              icon={<ChevronLeft className="w-4 h-4" />}
              onClick={() => onNavigate('PREV')}
              type="text"
            />
            <Button
              onClick={() => onNavigate('TODAY')}
              type="default"
              className="min-w-[80px]"
            >
              今日
            </Button>
            <Button
              icon={<ChevronRight className="w-4 h-4" />}
              onClick={() => onNavigate('NEXT')}
              type="text"
            />
          </div>

          <Title level={4} className="!mb-0 text-gray-700 min-w-[200px]">
            {getDateTitle()}
          </Title>
        </div>

        <div className="flex items-center space-x-4">
          <Space>
            <Button
              type={view === 'day' ? 'primary' : 'default'}
              onClick={() => onViewChange('day')}
              size="small"
            >
              日
            </Button>
            <Button
              type={view === 'week' ? 'primary' : 'default'}
              onClick={() => onViewChange('week')}
              size="small"
            >
              週
            </Button>
            <Button
              type={view === 'month' ? 'primary' : 'default'}
              onClick={() => onViewChange('month')}
              size="small"
            >
              月
            </Button>
          </Space>

          <div className="w-px h-6 bg-gray-300" />

          {isSignedIn ? (
            <Button
              icon={<LogOut className="w-4 h-4" />}
              onClick={onSignOut}
              type="text"
              loading={loading}
            >
              サインアウト
            </Button>
          ) : (
            <Button
              icon={<User className="w-4 h-4" />}
              onClick={onSignIn}
              type="primary"
              loading={loading}
            >
              Googleでサインイン
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};