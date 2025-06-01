import {
  CheckOutlined,
  CloseOutlined,
  CiOutlined,
  DeleteOutlined,
  RestOutlined,
  UserOutlined,
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
    case 'ready':
    case 'published':
      return [
        {
          key: 'unpublish',
          label: 'Unpublish',
          operation: 'reject_translations', // Maps to reject_translations in backend
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
          key: 'tag',
          label: 'Add Tag',
          operation: 'tag',
          icon: <UserOutlined />,
          description: 'Add a tag to selected phrases',
          requiresTranslation: false,
        },
      ];

    case 'pending':
    case 'untranslated':
      return [
        {
          key: 'auto-translate',
          label: 'Auto-translate',
          operation: 'auto_translate',
          icon: <RobotOutlined />,
          description: 'Auto-translate missing translations',
          requiresTranslation: false,
        },
        {
          key: 'publish',
          label: 'Approve & Publish',
          operation: 'approve_translations', // Maps to approve_translations in backend
          type: 'primary',
          icon: <CheckOutlined />,
          description: 'Approve translations and publish phrases',
          requiresTranslation: true, // This requires translations!
        },
        {
          key: 'reject',
          label: 'Reject',
          operation: 'reject_translations', // Maps to reject_translations in backend
          icon: <CloseOutlined />,
          confirmMessage:
            'Are you sure you want to reject the selected phrases?',
          description: 'Rejected phrases will need to be re-translated',
          requiresTranslation: false,
        },
        {
          key: 'archive',
          label: 'Archive',
          operation: 'archive',
          icon: <CiOutlined />,
          confirmMessage:
            'Are you sure you want to archive the selected phrases?',
          description: 'Archive phrases for later use',
          requiresTranslation: false,
        },
        {
          key: 'tag',
          label: 'Add Tag',
          operation: 'tag',
          icon: <UserOutlined />,
          description: 'Add a tag to selected phrases',
          requiresTranslation: false,
        },
      ];

    case 'needs_attention':
    case 'needs_review':
      return [
        {
          key: 'approve',
          label: 'Approve & Publish',
          operation: 'approve_translations', // Maps to approve_translations in backend
          type: 'primary',
          icon: <CheckOutlined />,
          description: 'Approve translations and publish them',
          requiresTranslation: true, // This requires translations!
        },
        {
          key: 'reject',
          label: 'Reject',
          operation: 'reject_translations', // Maps to reject_translations in backend
          icon: <CloseOutlined />,
          confirmMessage:
            'Are you sure you want to reject the selected phrases?',
          description: 'Phrases will be sent back for re-translation',
          requiresTranslation: false,
        },
        {
          key: 'send-back',
          label: 'Send Back to Pending',
          operation: 'reject_translations', // Also maps to reject_translations to move back to pending
          icon: <UndoOutlined />,
          description: 'Return phrases to pending status for revision',
          requiresTranslation: false,
        },
        {
          key: 'tag',
          label: 'Add Tag',
          operation: 'tag',
          icon: <UserOutlined />,
          description: 'Add a tag to selected phrases',
          requiresTranslation: false,
        },
      ];

    case 'archive':
      return [
        {
          key: 'restore',
          label: 'Restore',
          operation: 'archive', // Toggle archive status (restore from archive)
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
        {
          key: 'untag',
          label: 'Remove Tag',
          operation: 'untag',
          icon: <CloseOutlined />,
          description: 'Remove a tag from selected phrases',
          requiresTranslation: false,
        },
      ];

    default:
      return [];
  }
};
