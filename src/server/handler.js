const crypto = require('crypto');
const { storeData, getData } = require('../services/storeData');
const predictClassification = require('../services/inferenceService');

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  const { label, suggestion } = await predictClassification(model, image);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
    id: id,
    result: label,
    suggestion: suggestion,
    createdAt: createdAt,
  };

  await storeData(id, data);

  const response = h.response({
    status: 'success',
    message: 'Model is predicted successfully',
    data,
  });
  response.code(201);
  return response;
}

async function getHistoryHandler(request, h) {
  try {
    const data = await getData();

    const response = h.response({
      status: 'success',
      data,
    });
    response.code(200);
  } catch (e) {
    const response = h.response({
      status: 'fail',
      message: e.message,
    });
    response.code(400);
  } finally {
    return response;
  }
}

module.exports = {
  postPredictHandler,
  getHistoryHandler,
};
