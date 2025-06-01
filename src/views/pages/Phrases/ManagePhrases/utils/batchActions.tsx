import {
  CheckOutlined,
  CloseOutlined,
  CiOutlined,
  DeleteOutlined,
  RestOutlined,
  UserOutlined,
  SendOutlined,
  UndoOutlined,
  RobotOutlined,
} from '@ant-design/icons';

export interface BatchAction {
  key: string;
  label: string;
  operation: string;
  type?: 'default' | 'primary' | 'dashed' | 'link' | 'text';
  confirmMessage?: string;
  icon?: React.ReactNode;
  description?: string;
  requiresTranslation?: boolean; // New field to indicate if action requires translations
}

export const getBatchActionsForTab = (activeTab: string): BatchAction[] => {
  switch (activeTab) {
    case 'published':
      return [
        {
          key: 'unpublish',
          label: 'Unpublish',
          operation: 'unpublish',
          icon: <UndoOutlined />,
          confirmMessage:
            'Are you sure you want to unpublish the selected phrases?',
          description: 'Phrases will be moved back to pending status',
          requiresTranslation: false,
        },
        {
          key: 'archive',
          label: 'Archive',
          operation: 'archive',
          icon: <CiOutlined />,
          confirmMessage:
            'Are you sure you want to archive the selected phrases?',
          description: 'Archived phrases can be restored later',
          requiresTranslation: false,
        },
        {
          key: 'mark-human',
          label: 'Mark as Human',
          operation: 'mark_human',
          icon: <UserOutlined />,
          description: 'Mark translations as human-verified',
          requiresTranslation: false,
        },
      ];

    case 'pending':
      return [
        {
          key: 'auto-translate',
          label: 'Auto-translate',
          operation: 'auto_translate',
          icon: <RobotOutlined />,
          requiresTranslation: false,
        },
        {
          key: 'publish',
          label: 'Publish',
          operation: 'approve_translations',
          type: 'primary',
          icon: <CheckOutlined />,
          description: 'Make phrases live and available',
          requiresTranslation: true, // This requires translations!
        },
        {
          key: 'reject',
          label: 'Reject',
          operation: 'reject',
          icon: <CloseOutlined />,
          confirmMessage:
            'Are you sure you want to reject the selected phrases?',
          description: 'Rejected phrases will need to be re-translated',
          requiresTranslation: false,
        },
        {
          key: 'send-for-review',
          label: 'Send for Review',
          operation: 'send_for_review',
          icon: <SendOutlined />,
          description: 'Move phrases to translation QA queue',
          requiresTranslation: true, // This also requires translations
        },
        {
          key: 'archive',
          label: 'Archive',
          operation: 'archive',
          icon: <CiOutlined />,
          confirmMessage:
            'Are you sure you want to archive the selected phrases?',
          requiresTranslation: false,
        },
      ];

    case 'needs_review':
      return [
        {
          key: 'approve',
          label: 'Approve & Publish',
          operation: 'approve_translations',
          type: 'primary',
          icon: <CheckOutlined />,
          description: 'Approve translations and publish them',
          requiresTranslation: true, // This requires translations!
        },
        {
          key: 'reject',
          label: 'Reject',
          operation: 'reject',
          icon: <CloseOutlined />,
          confirmMessage:
            'Are you sure you want to reject the selected phrases?',
          description: 'Phrases will be sent back for re-translation',
          requiresTranslation: false,
        },
        {
          key: 'send-back',
          label: 'Send Back to Pending',
          operation: 'send_back_pending',
          icon: <UndoOutlined />,
          description: 'Return phrases to pending status for revision',
          requiresTranslation: false,
        },
      ];

    case 'archive':
      return [
        {
          key: 'restore',
          label: 'Restore',
          operation: 'restore',
          type: 'primary',
          icon: <RestOutlined />,
          description: 'Restore phrases to their previous status',
          requiresTranslation: false,
        },
        {
          key: 'delete',
          label: 'Delete Permanently',
          operation: 'delete',
          icon: <DeleteOutlined />,
          confirmMessage:
            'Are you sure you want to permanently delete the selected phrases? This action cannot be undone.',
          description: 'This will permanently remove phrases from the system',
          requiresTranslation: false,
        },
      ];

    default:
      return [];
  }
};
