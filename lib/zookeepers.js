const fs = require("fs");
const path = require("path");

function filterByQuery(query, zookeepers) {
    let filteredResultes = zookeepers;
    if(query.age) {
        filteredResultes = filteredResultes.filter(
            (zookeeper) => zookeeper.age === Number(query.age)
        );
    }

    if(query.favoriteAnimal) {
        filteredResultes = filteredResultes.filter(
            (zookeepers) => zookeepers.favoriteAnimal === query.favoriteAnimal
        );
    }

    if(query.name) {
        filteredResultes = filteredResultes.filter(
            (zookeepers) => zookeepers.name === query.name
        );
    }
    return filteredResultes;
}

function findById(id, zookeepers) {
    const result = zookeepers.filter((zookeeper) => zookeeper.id === id)[0] //filter retuns an array. By using [0] w set result equal to the value of that array index
    return result;
}

function createNewZookeeper(body, zookeepers) {
    const zookeeper = body;
    zookeepers.push(zookeeper);
    fs.writeFileSync(
        path.join(__dirname, "../data/zookepers.json"),
        JSON.stringify({ zookeepers }, null, 2)
    );
    return zookeeper;
}

function validateZookeeper(zookeeper) {
    if (!zookeeper.name || typeof zookeeper.name !== "string") {
      return false;
    }
    if (!zookeeper.age || typeof zookeeper.age !== "number") {
      return false;
    }
    if (
      !zookeeper.favoriteAnimal ||
      typeof zookeeper.favoriteAnimal !== "string"
    ) {
      return false;
    }
    return true;
  }
  
  module.exports = {
    filterByQuery,
    findById,
    createNewZookeeper,
    validateZookeeper,
  };