// src/views/pages/Phrases/ManagePhrases/components/modals/AddPhraseModal.tsx
import React, { useState } from 'react';
import { Modal, Form, Input, message } from 'antd';
import phrasesApi from '@/api/services/phrasesService';

interface AddPhraseModalProps {
  visible: boolean;
  projectId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

const AddPhraseModal: React.FC<AddPhraseModalProps> = ({
  visible,
  projectId,
  onCancel,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      await phrasesApi.createPhrase({
        ...values,
        project: projectId,
        status: 'pending',
      });

      message.success('Phrase added successfully');
      form.resetFields();
      onSuccess();
    } catch (err) {
      console.error('Error adding phrase:', err);
      message.error('Failed to add phrase');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add New Phrase"
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText="Add Phrase"
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="key"
          label="Phrase Key"
          rules={[{ required: true, message: 'Please enter a phrase key' }]}
        >
          <Input placeholder="e.g., button.save" />
        </Form.Item>

        <Form.Item
          name="sourceText"
          label="Source Text"
          rules={[{ required: true, message: 'Please enter the source text' }]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Enter the text to be translated"
          />
        </Form.Item>

        <Form.Item name="context" label="Context (Optional)">
          <Input.TextArea
            rows={2}
            placeholder="Provide context to help translators understand this phrase"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPhraseModal;
