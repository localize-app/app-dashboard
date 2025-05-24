// src/views/pages/Phrases/ManagePhrases/components/PhrasesHeader.tsx
import React from 'react';
import { Typography, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface PhrasesHeaderProps {
  selectedProject: string;
  onAddPhrase: () => void;
}

const PhrasesHeader: React.FC<PhrasesHeaderProps> = ({
  selectedProject,
  onAddPhrase,
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <Title level={3}>Manage Phrases</Title>

      <div className="flex items-center gap-2">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAddPhrase}
          disabled={!selectedProject}
        >
          Add Phrase
        </Button>
      </div>
    </div>
  );
};

export default PhrasesHeader;
