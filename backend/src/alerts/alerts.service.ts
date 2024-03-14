import Alert from './alerts.model';

const createAlert = async (
  symbol: string,
  title: string,
  target: number,
  type: string,
  notes: string,
  expiresAt: number
) => {
  const alert = new Alert({
    symbol,
    title,
    target,
    type,
    notes,
    expiresAt,
  });

  return await alert.save();
};

export { createAlert };
