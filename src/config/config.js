function APIEndpoint() {
  if (process.env.NODE_ENV === 'production') {
    return 'http://pathadvisor.ust.hk';
  }
  return 'http://localhost:8888/interface';
}

export { APIEndpoint };
