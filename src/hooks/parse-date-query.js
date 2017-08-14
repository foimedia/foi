module.exports = (property) => {
  const _parse = (query) => {
    if(query[property]) {
      if(typeof query[property] == 'string') {
        query[property] = new Date(query[property]);
      } else {
        for(let key in query[property]) {
          query[property][key] = new Date(query[property][key]);
        }
      }
    }
    return query;
  }
  return hook => {
    const { query } = hook.params;
    if(query !== undefined) {
      _parse(query);
      if(query['$or']) {
        query['$or'] = query['$or'].map(_parse);
      }
    }
    return hook;
  }
};
