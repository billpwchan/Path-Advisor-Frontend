import axios from 'axios';
import { APIEndpoint } from '../../config/config';

async function postSuggestion(data) {
  const response = await axios.post(`${APIEndpoint()}/suggestions`, data);

  const { success } = response.data || {};

  return {
    ...response,
    data: {
      success,
    },
  };
}

export default postSuggestion;
