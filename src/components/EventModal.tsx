import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, DatePicker, Switch, Button, Space, Divider, Select, ColorPicker, Tag, Tooltip } from 'antd';
import { Video, ExternalLink, MapPin, Clock, Users, Palette, Plus, X } from 'lucide-react';
import { CalendarEvent } from '../types/calendar';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface EventModalProps {
  visible: boolean;
  event?: CalendarEvent | null;
  onCancel: () => void;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
  onUpdate: (eventId: string, event: Partial<CalendarEvent>) => void;
  onDelete?: (eventId: string) => void;
  loading?: boolean;
}

// よく使用される参加者のリスト
const commonAttendees = [
  { value: 'tanaka@company.com', label: '田中 太郎 (tanaka@company.com)' },
  { value: 'sato@company.com', label: '佐藤 花子 (sato@company.com)' },
  { value: 'yamada@company.com', label: '山田 次郎 (yamada@company.com)' },
  { value: 'suzuki@company.com', label: '鈴木 美咲 (suzuki@company.com)' },
  { value: 'watanabe@company.com', label: '渡辺 健一 (watanabe@company.com)' },
  { value: 'ito@company.com', label: 'イトウ マリ (ito@company.com)' },
  { value: 'takahashi@company.com', label: '高橋 大輔 (takahashi@company.com)' },
  { value: 'client@example.com', label: 'クライアント (client@example.com)' },
  { value: 'vendor@example.com', label: 'ベンダー (vendor@example.com)' },
  { value: 'hr@company.com', label: '人事部 (hr@company.com)' },
  { value: 'marketing@company.com', label: 'マーケティング部 (marketing@company.com)' },
  { value: 'sales@company.com', label: '営業部 (sales@company.com)' },
];

// 定義済みの色パレット
const colorPresets = [
  { color: '#1890ff', name: 'ブルー' },
  { color: '#52c41a', name: 'グリーン' },
  { color: '#fa8c16', name: 'オレンジ' },
  { color: '#722ed1', name: 'パープル' },
  { color: '#eb2f96', name: 'ピンク' },
  { color: '#13c2c2', name: 'シアン' },
  { color: '#f5222d', name: 'レッド' },
  { color: '#faad14', name: 'イエロー' },
];

// 会議室のリスト
const meetingRooms = [
  '会議室A',
  '会議室B',
  '会議室C',
  '小会議室1',
  '小会議室2',
  'デザインスタジオ',
  'プレゼンテーションルーム',
  '研修室',
  'オンライン',
  'クライアント オフィス',
  'カフェテリア',
];

export const EventModal: React.FC<EventModalProps> = ({
  visible,
  event,
  onCancel,
  onSave,
  onUpdate,
  onDelete,
  loading = false
}) => {
  const [form] = Form.useForm();
  const [customAttendee, setCustomAttendee] = useState('');
  const [selectedColor, setSelectedColor] = useState('#1890ff');
  const isEditing = !!event;

  useEffect(() => {
    if (visible && event) {
      form.setFieldsValue({
        title: event.title,
        description: event.description || '',
        location: event.location || '',
        dateRange: [dayjs(event.start), dayjs(event.end)],
        allDay: event.allDay || false,
        attendees: event.attendees || [],
        meetLink: event.meetLink || '',
        color: event.color || '#1890ff'
      });
      setSelectedColor(event.color || '#1890ff');
    } else if (visible && !event) {
      form.resetFields();
      form.setFieldsValue({
        allDay: false,
        dateRange: [dayjs(), dayjs().add(1, 'hour')],
        attendees: [],
        color: '#1890ff'
      });
      setSelectedColor('#1890ff');
    }
  }, [visible, event, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const [start, end] = values.dateRange;
      
      const eventData = {
        title: values.title,
        description: values.description,
        location: values.location,
        start: start.toDate(),
        end: end.toDate(),
        allDay: values.allDay,
        attendees: values.attendees || [],
        meetLink: values.meetLink || undefined,
        meetId: values.meetLink ? values.meetLink.split('/').pop() : undefined,
        color: values.color || selectedColor
      };

      if (isEditing && event) {
        await onUpdate(event.id, eventData);
      } else {
        await onSave(eventData);
      }
      
      onCancel();
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const handleDelete = () => {
    if (event && onDelete) {
      Modal.confirm({
        title: 'イベントを削除しますか？',
        content: 'この操作は取り消せません。',
        okText: '削除',
        okType: 'danger',
        cancelText: 'キャンセル',
        onOk: () => {
          onDelete(event.id);
          onCancel();
        }
      });
    }
  };

  const handleMeetLinkClick = (meetLink: string) => {
    window.open(meetLink, '_blank', 'noopener,noreferrer');
  };

  const addCustomAttendee = () => {
    if (customAttendee && customAttendee.includes('@')) {
      const currentAttendees = form.getFieldValue('attendees') || [];
      if (!currentAttendees.includes(customAttendee)) {
        form.setFieldsValue({
          attendees: [...currentAttendees, customAttendee]
        });
      }
      setCustomAttendee('');
    }
  };

  const removeAttendee = (attendeeToRemove: string) => {
    const currentAttendees = form.getFieldValue('attendees') || [];
    form.setFieldsValue({
      attendees: currentAttendees.filter((attendee: string) => attendee !== attendeeToRemove)
    });
  };

  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          <div 
            className="w-4 h-4 rounded-full" 
            style={{ backgroundColor: selectedColor }}
          />
          <span>{isEditing ? 'イベントを編集' : '新しいイベント'}</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={700}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          キャンセル
        </Button>,
        ...(isEditing && onDelete ? [
          <Button key="delete" danger onClick={handleDelete} loading={loading}>
            削除
          </Button>
        ] : []),
        <Button key="submit" type="primary" onClick={handleSubmit} loading={loading}>
          {isEditing ? '更新' : '作成'}
        </Button>
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        className="mt-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Form.Item
              name="title"
              label={
                <div className="flex items-center space-x-1">
                  <span>タイトル</span>
                  <span className="text-red-500">*</span>
                </div>
              }
              rules={[{ required: true, message: 'タイトルを入力してください' }]}
            >
              <Input 
                placeholder="イベントのタイトル" 
                size="large"
              />
            </Form.Item>
          </div>

          <Form.Item
            name="dateRange"
            label={
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>日時</span>
                <span className="text-red-500">*</span>
              </div>
            }
            rules={[{ required: true, message: '日時を選択してください' }]}
          >
            <RangePicker
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              className="w-full"
              placeholder={['開始日時', '終了日時']}
              size="large"
            />
          </Form.Item>

          <Form.Item name="allDay" valuePropName="checked">
            <div className="flex items-center space-x-2 pt-6">
              <Switch checkedChildren="終日" unCheckedChildren="時間指定" />
              <span className="text-sm text-gray-600">終日イベント</span>
            </div>
          </Form.Item>

          <Form.Item 
            name="location" 
            label={
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>場所</span>
              </div>
            }
          >
            <Select
              placeholder="場所を選択または入力"
              allowClear
              showSearch
              size="large"
              mode="tags"
              maxTagCount={1}
            >
              {meetingRooms.map(room => (
                <Option key={room} value={room}>{room}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item 
            name="color" 
            label={
              <div className="flex items-center space-x-1">
                <Palette className="w-4 h-4" />
                <span>色</span>
              </div>
            }
          >
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {colorPresets.map(preset => (
                  <Tooltip key={preset.color} title={preset.name}>
                    <div
                      className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                        selectedColor === preset.color ? 'border-gray-400' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: preset.color }}
                      onClick={() => {
                        setSelectedColor(preset.color);
                        form.setFieldsValue({ color: preset.color });
                      }}
                    />
                  </Tooltip>
                ))}
              </div>
              <ColorPicker
                value={selectedColor}
                onChange={(color) => {
                  const hexColor = color.toHexString();
                  setSelectedColor(hexColor);
                  form.setFieldsValue({ color: hexColor });
                }}
                size="large"
              />
            </div>
          </Form.Item>
        </div>

        <Form.Item 
          name="description" 
          label="説明"
        >
          <TextArea 
            rows={3} 
            placeholder="イベントの説明や議題を入力" 
          />
        </Form.Item>

        <Form.Item 
          name="attendees" 
          label={
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>参加者</span>
            </div>
          }
        >
          <Select
            mode="multiple"
            placeholder="参加者を選択"
            size="large"
            allowClear
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={commonAttendees}
            dropdownRender={(menu) => (
              <>
                {menu}
                <Divider style={{ margin: '8px 0' }} />
                <Space style={{ padding: '0 8px 4px' }}>
                  <Input
                    placeholder="メールアドレスを入力"
                    value={customAttendee}
                    onChange={(e) => setCustomAttendee(e.target.value)}
                    onPressEnter={addCustomAttendee}
                  />
                  <Button 
                    type="text" 
                    icon={<Plus className="w-4 h-4" />} 
                    onClick={addCustomAttendee}
                  >
                    追加
                  </Button>
                </Space>
              </>
            )}
          />
        </Form.Item>

        {/* 選択された参加者の表示 */}
        <Form.Item shouldUpdate={(prevValues, currentValues) => 
          prevValues.attendees !== currentValues.attendees
        }>
          {({ getFieldValue }) => {
            const attendees = getFieldValue('attendees') || [];
            return attendees.length > 0 ? (
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">選択された参加者:</div>
                <div className="flex flex-wrap gap-1">
                  {attendees.map((attendee: string) => (
                    <Tag
                      key={attendee}
                      closable
                      onClose={() => removeAttendee(attendee)}
                      className="mb-1"
                    >
                      {attendee}
                    </Tag>
                  ))}
                </div>
              </div>
            ) : null;
          }}
        </Form.Item>

        <Divider />

        <Form.Item 
          name="meetLink" 
          label={
            <div className="flex items-center space-x-1">
              <Video className="w-4 h-4" />
              <span>Google Meet リンク</span>
            </div>
          }
        >
          <Input 
            placeholder="https://meet.google.com/xxx-xxxx-xxx"
            prefix={<Video className="w-4 h-4 text-gray-400" />}
            size="large"
          />
        </Form.Item>

        {event?.meetLink && (
          <div className="mb-4">
            <Button
              type="primary"
              icon={<Video className="w-4 h-4" />}
              onClick={() => handleMeetLinkClick(event.meetLink!)}
              className="mr-2 meet-join-button"
              size="large"
            >
              Meetに参加
            </Button>
            <Button
              type="link"
              icon={<ExternalLink className="w-4 h-4" />}
              onClick={() => handleMeetLinkClick(event.meetLink!)}
              size="small"
            >
              新しいタブで開く
            </Button>
          </div>
        )}
      </Form>
    </Modal>
  );
};