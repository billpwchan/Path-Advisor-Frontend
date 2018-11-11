const TYPE = {
  ID: 'id',
  NODE_ID: 'nodeId',
  KEYWORD: 'keyword',
  NEAREST: 'nearest',
};

const EMPTY = {
  name: '',
  data: {},
};

function hasContent(input) {
  return input && input.data && Object.values(TYPE).includes(input.data.type);
}

function isEqual(a, b) {
  if (a === b) {
    return true;
  }

  if (a.name !== b.name || !a.data || !b.data) {
    return false;
  }

  return ['id', 'floor', 'value', 'type'].every(key => a.data[key] === b.data[key]);
}

export { TYPE, EMPTY, hasContent, isEqual };
