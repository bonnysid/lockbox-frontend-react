type AvatarStyle = {
  background: string;
  color: string;
};

const AVATAR_COLORS: AvatarStyle[] = [
  {
    background: 'var(--color-bg-info)',
    color: 'var(--color-info-primary)',
  },
  {
    background: 'var(--color-bg-error)',
    color: 'var(--color-error-primary)',
  },
  {
    background: 'var(--color-bg-success)',
    color: 'var(--color-success-primary)',
  },
  {
    background: 'var(--color-bg-warning)',
    color: 'var(--color-warning-primary)',
  },
  {
    background: 'var(--color-bg-run)',
    color: 'var(--color-run-primary)',
  },
  {
    background: 'var(--color-bg-primary)',
    color: 'var(--color-bg-tertiary)',
  },
];

export { AVATAR_COLORS };
