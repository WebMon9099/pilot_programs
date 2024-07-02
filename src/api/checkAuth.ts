import { api } from '../clients';

async function getUsersResults() {
  try {
    await api.get('/init-auth.php');
  } catch (err) {
    return Promise.reject(err);
  }
}

export default getUsersResults;
