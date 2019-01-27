const EMPTY = 'EMPTY';

function APIEndpoint() {
  return process.env.REACT_APP_API_ENDPOINT_URI === EMPTY
    ? ''
    : process.env.REACT_APP_API_ENDPOINT_URI;
}

function SearchAPIEndpoint() {
  return process.env.REACT_APP_API_ENDPOINT_URI === EMPTY
    ? ''
    : process.env.REACT_APP_API_ENDPOINT_URI;
}

export { APIEndpoint, SearchAPIEndpoint };
