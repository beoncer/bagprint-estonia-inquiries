export type BadgeType = 'eco' | 'organic' | 'reusable' | 'recycled';

export interface BadgeConfig {
  id: BadgeType;
  label: string;
  borderColor: string;
  icon?: string;
}

export const BADGE_CONFIGS: Record<BadgeType, BadgeConfig> = {
  organic: {
    id: 'organic',
    label: 'Orgaaniline toode',
    borderColor: '#B4BE7B', // Olive green from the screenshot
    icon: 'LeafIcon'
  },
  reusable: {
    id: 'reusable',
    label: 'Korduvkasutatav toode',
    borderColor: '#2F4F4F', // Dark teal from the screenshot
    icon: 'RefreshCcwIcon'
  },
  recycled: {
    id: 'recycled',
    label: 'Ümbertöödeldud toode',
    borderColor: '#1E40AF', // Dark blue from the screenshot
    icon: 'RecycleIcon'
  },
  eco: {
    id: 'eco',
    label: 'Öko toode',
    borderColor: '#4CAF50',
    icon: 'LeafIcon'
  }
}; 