const ListEvent = {
  GET: 'list:get',
  REORDER: 'list:reorder',
  UPDATE: 'list:update',
  CREATE: 'list:create',
  RENAME: 'list:rename',
  DELETE: 'list:delete',
  REVERT: 'list:revert'
} as const;

export { ListEvent };
