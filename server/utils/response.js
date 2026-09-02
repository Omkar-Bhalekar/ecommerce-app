function success(res, message, data = null, status = 200) {
  const payload = { success: true, message };
  if (data !== null) payload.data = data;
  return res.status(status).json(payload);
}

function fail(res, message, status = 400) {
  return res.status(status).json({ success: false, message });
}

module.exports = { success, fail };
