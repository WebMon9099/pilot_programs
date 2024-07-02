import { api } from '../clients';

async function getEquations() {
  try {
    const { data } = await api.get<{ question: string; answer: string }[]>(
      '/get-option.php?option=calculate_equations'
    );

    return data;
  } catch (err) {
    return Promise.reject(err);
  }
}

export default getEquations;
