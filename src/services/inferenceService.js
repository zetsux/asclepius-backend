const tf = require('@tensorflow/tfjs-node');

async function predictClassification(model, image) {
  const tensor = tf.node.decodeJpeg(image).resizeNearestNeighbor([224, 224]).expandDims().toFloat();

  const prediction = model.predict(tensor);
  const score = await prediction.data();
  const confidenceScore = Math.max(...score) * 100;

  const classes = ['Cancer', 'Non-cancer'];

  let label, suggestion;
  if (confidenceScore > 50) {
    label = classes[0];
    suggestion = 'Segera periksa ke dokter!';
  } else {
    label = classes[1];
    suggestion = 'Tidak ada masalah.';
  }

  return { label, suggestion };
}

module.exports = predictClassification;
