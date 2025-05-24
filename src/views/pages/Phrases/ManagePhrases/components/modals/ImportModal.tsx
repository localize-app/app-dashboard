// src/views/pages/Phrases/ManagePhrases/components/modals/ImportModal.tsx
import React, { useState } from 'react';
import { Modal, Upload, Checkbox, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import phrasesApi from '@/api/services/phrasesService';

const { Dragger } = Upload;

interface ImportModalProps {
  visible: boolean;
  projectId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

const ImportModal: React.FC<ImportModalProps> = ({
  visible,
  projectId,
  onCancel,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [overwrite, setOverwrite] = useState(false);

  const handleImport = async () => {
    if (!file) {
      message.warning('Please select a file to import');
      return;
    }

    try {
      setLoading(true);
      const result = await phrasesApi.importPhrases(projectId, file, {
        overwrite,
      });

      message.success(
        `Import successful! ${result.imported} phrases imported, ${result.updated} updated.`
      );
      onSuccess();
    } catch (err) {
      console.error('Import failed:', err);
      message.error('Failed to import phrases');
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    accept: '.json,.csv,.xlsx',
    beforeUpload: (file: File) => {
      setFile(file);
      return false;
    },
    maxCount: 1,
  };

  return (
    <Modal
      title="Import Phrases"
      open={visible}
      onCancel={onCancel}
      onOk={handleImport}
      okText="Import"
      confirmLoading={loading}
      okButtonProps={{ disabled: !file }}
    >
      <div className="space-y-4">
        <div>
          <div className="font-medium mb-1">Upload File</div>
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Supported formats: JSON, CSV, Excel (XLSX)
            </p>
          </Dragger>
        </div>

        <div>
          <Checkbox
            checked={overwrite}
            onChange={(e) => setOverwrite(e.target.checked)}
          >
            Overwrite existing phrases with the same key
          </Checkbox>
        </div>
      </div>
    </Modal>
  );
};

export default ImportModal;
