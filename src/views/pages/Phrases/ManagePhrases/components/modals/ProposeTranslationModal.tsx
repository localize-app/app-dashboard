// src/views/pages/Phrases/ManagePhrases/components/modals/ProposeTranslationModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Input, Checkbox, message, Button, Space } from 'antd';
import { Phrase } from '@/types/phrases.types';
import phrasesApi from '@/api/services/phrasesService';
import translationApi from '@/api/services/translationService';
import { RobotOutlined } from '@ant-design/icons';

interface ProposeTranslationModalProps {
  visible: boolean;
  phrase: Phrase | null;
  targetLocale: string;
  onCancel: () => void;
  onSuccess: () => void;
}

const ProposeTranslationModal: React.FC<ProposeTranslationModalProps> = ({
  visible,
  phrase,
  targetLocale,
  onCancel,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [markAsHuman, setMarkAsHuman] = useState(true);
  const [proposedTranslation, setProposedTranslation] = useState('');

  useEffect(() => {
    if (phrase && visible) {
      const translation = phrase.translations?.[targetLocale];
      setProposedTranslation(translation?.text || '');
    }
  }, [phrase, targetLocale, visible]);

  const handleSuggestTranslation = async () => {
    if (!phrase) return;

    try {
      setSuggestLoading(true);

      // Use the translation API to get a suggestion
      const result = await translationApi.translateText({
        text: phrase.sourceText,
        targetLanguage: targetLocale,
        sourceLanguage: 'en-US', // Assuming source is always en-US
      });

      if (result.translatedText) {
        setProposedTranslation(result.translatedText);
        setMarkAsHuman(false); // Auto-translations should not be marked as human
        message.success('Translation suggestion generated');
      } else {
        message.error('Failed to generate translation suggestion');
      }
    } catch (err) {
      console.error('Error getting translation suggestion:', err);
      message.error('Failed to generate translation suggestion');
    } finally {
      setSuggestLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!phrase || !proposedTranslation.trim()) {
      message.warning('Please enter a translation.');
      return;
    }

    try {
      setLoading(true);
      await phrasesApi.addTranslation(phrase.id, targetLocale, {
        text: proposedTranslation,
        isHuman: markAsHuman,
        status: 'pending',
      });

      message.success('Translation proposed successfully');
      onSuccess();
    } catch (err) {
      console.error('Error proposing translation:', err);
      message.error('Failed to propose translation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Propose Translation"
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText="Submit"
      confirmLoading={loading}
      width={600}
    >
      {phrase && (
        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-500 mb-1">Source (en-US):</div>
            <div className="p-3 border rounded bg-gray-50">
              {phrase.sourceText}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-1">
              Translation ({targetLocale}):
            </div>
            <Input.TextArea
              rows={5}
              value={proposedTranslation}
              onChange={(e) => setProposedTranslation(e.target.value)}
              placeholder="Enter translation here..."
              className="w-full"
            />

            <div className="flex justify-between items-center mt-2">
              <Button
                icon={<RobotOutlined />}
                onClick={handleSuggestTranslation}
                loading={suggestLoading}
                type="default"
              >
                Suggest Translation
              </Button>

              <Checkbox
                checked={markAsHuman}
                onChange={(e) => setMarkAsHuman(e.target.checked)}
              >
                Mark as human translation
              </Checkbox>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ProposeTranslationModal;
