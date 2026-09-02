const { success, fail } = require('../utils/response');

const METHODS = [
  { id: 'CARD', label: 'Credit/Debit Card' },
  { id: 'UPI', label: 'UPI' },
  { id: 'NET_BANKING', label: 'Net Banking' },
  { id: 'WALLET', label: 'Wallet' },
];

exports.methods = (_req, res) => {
  return success(res, 'Payment methods loaded', METHODS);
};

exports.simulate = (req, res) => {
  const { payment_method } = req.body;
  const method = (payment_method || '').toUpperCase();
  const valid = METHODS.some((m) => m.id === method);
  if (!valid) return fail(res, 'Invalid payment method');
  return success(res, 'Payment authorized', {
    payment_status: 'SUCCESS',
    payment_method: method,
  });
};
