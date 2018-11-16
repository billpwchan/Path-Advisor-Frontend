import axios from 'axios';
import { APIEndpoint } from '../../config/config';
import { PLATFORM } from './detectPlatform';

export const MODE = {
  NORMAL: 'normal',
  CUSTOM: 'custom',
};

// TO-DO: remove after API revamp
function searchModeQuery(mode, platform) {
  const platformSuffix = platform === PLATFORM.MOBILE ? ':Mobile' : '';

  switch (mode) {
    case MODE.NORMAL:
      return `normal${platformSuffix}`;
    case MODE.CUSTOM:
      return `quickCustom${platformSuffix}`;
    default:
      return `normal${platformSuffix}`;
  }
}

const logger = (hasQueryString, platform) => ({ from, to, mode }) => {
  console.log('logger', { APIEndpoint: APIEndpoint(), mode, from, to, hasQueryString, platform });

  const logUrl = `${APIEndpoint()}/logging.php`;
  axios.get(logUrl, {
    params: {
      searchMode: searchModeQuery(mode, platform),
      from,
      to,
    },
  });
};

export default logger;
