const CardEvent = {
  CREATE: 'card:create',
  DELETE: 'card:delete',
  REORDER: 'card:reorder',
  RENAME: 'card:rename',
  CHANGE_DESCRIPTION: 'card:change-description',
  COPY: 'card:copy'
} as const;

export { CardEvent };
