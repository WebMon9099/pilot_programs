import { api } from '../clients';
import { Result } from '../types';

async function getUsersResults() {
  try {
    const { data } = await api.get<{
      median_score: number;
      weak_pass: number | null;
      strong_pass: number | null;
      past_results: Result[];
    }>('/get-users-results.php');

    return data;
  } catch (err) {
    return Promise.reject(err);
  }
}

export default getUsersResults;
