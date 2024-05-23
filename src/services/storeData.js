const { Firestore } = require('@google-cloud/firestore');

async function storeData(id, data) {
  const db = new Firestore();

  const predictCollection = db.collection('prediction');
  return predictCollection.doc(id).set(data);
}

async function getData() {
  const db = new Firestore();
  const collectionRef = db.collection('prediction');
  const snapshot = await collectionRef.get();
  const data = [];
  snapshot.forEach((doc) => {
    const docData = doc.data();
    data.push({
      id: doc.id,
      history: {
        ...docData,
        id: doc.id,
      },
    });
  });

  return data;
}

module.exports = { storeData, getData };
