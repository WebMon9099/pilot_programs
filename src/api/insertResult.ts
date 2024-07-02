import { api } from '../clients';

async function insertResult(data: {
  score: number;
  duration: number;
  mode: string;
}) {
  try {
    return await api.post('/insert-result.php', data);
  } catch (err) {
    return Promise.reject(err);
  }
}

export default insertResult;
