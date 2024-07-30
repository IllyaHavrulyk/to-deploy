const ListEvent = {
  CREATE: 'list:create',
  GET: 'list:get',
  REORDER: 'list:reorder',
  UPDATE: 'list:update',
  RENAME: 'list:rename',
  DELETE: 'list:delete',
  REVERT: 'list:revert'
} as const;

export { ListEvent };
