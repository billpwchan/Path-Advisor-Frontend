function APIEndpoint() {
  if (process.env.NODE_ENV === 'production') {
    return 'http://pathadvisor.ust.hk';
  }
  return 'http://pathadvisor.ust.hk';
}

function SearchAPIEndpoint() {
  if (process.env.NODE_ENV === 'production') {
    return 'http://pathadvisor.ust.hk';
  }
  return 'http://pathadvisor.ust.hk';
}

export { APIEndpoint, SearchAPIEndpoint };
