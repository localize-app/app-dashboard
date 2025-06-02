import React from 'react';
import { Tag, Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { getLocaleDisplayName } from '../utils/validationHelpers';

interface PhrasesSidebarProps {
  activeTab: string;
  tabCounts: {
    ready: number;
    needs_attention: number;
    pending: number;
    untranslated: number;
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
                <div className="font-medium">
                  {getLocaleDisplayName(sourceLocale)}
                </div>
                <div className="text-gray-400">{sourceLocale}</div>
              </div>
            </div>

            <div className="border-l-4 border-blue-500 pl-2 py-1 bg-blue-50">
              <div className="text-sm text-gray-500">Target:</div>
              <div className="flex justify-between">
                <div className="font-medium">
                  {getLocaleDisplayName(targetLocale)}
                </div>
                <div className="text-gray-400">{targetLocale}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs section - Updated with Swagger status names */}
        <div>
          <div
            className={`flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 ${
              activeTab === 'ready'
                ? 'bg-blue-50 border-l-4 border-blue-500 pl-3'
                : ''
            }`}
            onClick={() => onTabChange('ready')}
          >
            <div className="font-medium">Ready (Published)</div>
            <Tag color="green">{tabCounts.ready || 0}</Tag>
          </div>

          <div
            className={`flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 ${
              activeTab === 'needs_attention'
                ? 'bg-blue-50 border-l-4 border-blue-500 pl-3'
                : ''
            }`}
            onClick={() => onTabChange('needs_attention')}
          >
            <div className="font-medium">Needs Attention</div>
            <Tag color="orange">{tabCounts.needs_attention || 0}</Tag>
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
            <Tag color="blue">{tabCounts.pending || 0}</Tag>
          </div>

          <div
            className={`flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 ${
              activeTab === 'untranslated'
                ? 'bg-blue-50 border-l-4 border-blue-500 pl-3'
                : ''
            }`}
            onClick={() => onTabChange('untranslated')}
          >
            <div className="font-medium">Untranslated</div>
            <Tag color="red">{tabCounts.untranslated || 0}</Tag>
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
            <Tag color="default">{tabCounts.archive || 0}</Tag>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhrasesSidebar;
