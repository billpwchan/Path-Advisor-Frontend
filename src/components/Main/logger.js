import axios from 'axios';
import { APIEndpoint } from '../../config/config';

export const MODE = {
  NORMAL: 'normal',
  NEAREST: 'nearest',
};

const logger = (hasQueryString, platform) => ({ from, to, mode }) => {
  console.log('logger', { APIEndpoint: APIEndpoint(), mode, from, to, hasQueryString, platform });

  const logUrl = `${APIEndpoint()}/logs`;
  axios.post(logUrl, {
    searchMode: mode,
    platform: platform.toLowerCase(),
    from,
    to,
  });
};

export default logger;
