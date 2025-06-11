import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Switch, Button, Space } from 'antd';
import { CalendarEvent } from '../types/calendar';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface EventModalProps {
  visible: boolean;
  event?: CalendarEvent | null;
  onCancel: () => void;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
  onUpdate: (eventId: string, event: Partial<CalendarEvent>) => void;
  onDelete?: (eventId: string) => void;
  loading?: boolean;
}

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
  const isEditing = !!event;

  useEffect(() => {
    if (visible && event) {
      form.setFieldsValue({
        title: event.title,
        description: event.description || '',
        location: event.location || '',
        dateRange: [dayjs(event.start), dayjs(event.end)],
        allDay: event.allDay || false,
        attendees: event.attendees?.join(', ') || ''
      });
    } else if (visible && !event) {
      form.resetFields();
      form.setFieldsValue({
        allDay: false,
        dateRange: [dayjs(), dayjs().add(1, 'hour')]
      });
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
        attendees: values.attendees 
          ? values.attendees.split(',').map((email: string) => email.trim()).filter(Boolean)
          : []
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

  return (
    <Modal
      title={isEditing ? 'イベントを編集' : '新しいイベント'}
      open={visible}
      onCancel={onCancel}
      width={600}
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
        <Form.Item
          name="title"
          label="タイトル"
          rules={[{ required: true, message: 'タイトルを入力してください' }]}
        >
          <Input placeholder="イベントのタイトル" />
        </Form.Item>

        <Form.Item
          name="dateRange"
          label="日時"
          rules={[{ required: true, message: '日時を選択してください' }]}
        >
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            className="w-full"
            placeholder={['開始日時', '終了日時']}
          />
        </Form.Item>

        <Form.Item name="allDay" valuePropName="checked">
          <Switch checkedChildren="終日" unCheckedChildren="時間指定" />
        </Form.Item>

        <Form.Item name="location" label="場所">
          <Input placeholder="場所を入力" />
        </Form.Item>

        <Form.Item name="description" label="説明">
          <TextArea rows={3} placeholder="イベントの説明" />
        </Form.Item>

        <Form.Item name="attendees" label="参加者">
          <Input placeholder="メールアドレスをカンマ区切りで入力" />
        </Form.Item>
      </Form>
    </Modal>
  );
};