// src/views/pages/Phrases/ManagePhrases/components/PhrasesSidebar.tsx
import React from 'react';
import { Tag, Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

interface PhrasesSidebarProps {
  activeTab: string;
  tabCounts: {
    published: number;
    translation_qa: number;
    pending: number;
    archive: number;
  };
  sourceLocale: string;
  targetLocale: string;
  onTabChange: (key: string) => void;
  onLanguageChange: (locale: string) => void;
}

const PhrasesSidebar: React.FC<PhrasesSidebarProps> = ({
  activeTab,
  tabCounts,
  sourceLocale,
  targetLocale,
  onTabChange,
  onLanguageChange,
}) => {
  return (
    <div className="w-1/4">
      <div className="border rounded-md overflow-hidden">
        {/* Language selector section */}
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium m-0">Language</h3>
            <Button
              type="text"
              icon={<SettingOutlined />}
              className="p-0"
              onClick={() => {
                // Handle language settings
                console.log('Language settings');
              }}
            />
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-500">Source:</div>
              <div className="flex justify-between">
                <div className="font-medium">English (United States)</div>
                <div className="text-gray-400">en-US</div>
              </div>
            </div>

            <div className="border-l-4 border-blue-500 pl-2 py-1 bg-blue-50">
              <div className="text-sm text-gray-500">Target:</div>
              <div className="flex justify-between">
                <div className="font-medium">French (Canada)</div>
                <div className="text-gray-400">fr-CA</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs section */}
        <div>
          <div
            className={`flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 ${
              activeTab === 'published'
                ? 'bg-blue-50 border-l-4 border-blue-500 pl-3'
                : ''
            }`}
            onClick={() => onTabChange('published')}
          >
            <div className="font-medium">Published</div>
            <Tag>{tabCounts.published}</Tag>
          </div>

          <div
            className={`flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 ${
              activeTab === 'needs_review'
                ? 'bg-blue-50 border-l-4 border-blue-500 pl-3'
                : ''
            }`}
            onClick={() => onTabChange('needs_review')}
          >
            <div className="font-medium">Translation QA</div>
            <Tag>{tabCounts.translation_qa}</Tag>
          </div>

          <div
            className={`flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 ${
              activeTab === 'pending'
                ? 'bg-blue-50 border-l-4 border-blue-500 pl-3'
                : ''
            }`}
            onClick={() => onTabChange('pending')}
          >
            <div className="font-medium">Pending</div>
            <Tag>{tabCounts.pending}</Tag>
          </div>

          <div
            className={`flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 ${
              activeTab === 'archive'
                ? 'bg-blue-50 border-l-4 border-blue-500 pl-3'
                : ''
            }`}
            onClick={() => onTabChange('archive')}
          >
            <div className="font-medium">Archive</div>
            <Tag>{tabCounts.archive}</Tag>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhrasesSidebar;
