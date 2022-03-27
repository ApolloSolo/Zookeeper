const express = require('express');
const res = require('express/lib/response');
const app = express();
const PORT = process.env.PORT || 3000;
const { animals } = require('./data/animals.json')
const fs = require('fs');
const path = require('path');

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    let filteredResults = animalsArray;

    if(query.personalityTraits) {
        // Save personality trais as a dedicated array.
        // If traits is a string, place it into a new array and save.
        if(typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }

        // Loop through each trait in the traits array
        personalityTraitsArray.forEach(trait => {
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }

    if(query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if(query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if(query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0] 
    return result;
}

// Accepts req.body values and the array we want to push it into.
function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        JSON.stringify({ animals: animalsArray }, null, 2)
    );
    return animal;
}

function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
      }
      if (!animal.species || typeof animal.species !== 'string') {
        return false;
      }
      if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
      }
      if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
      }
      return true;
}

// We can assume that a route that has the term api in it will deal in transference of JSON data, 
// whereas a more normal-looking endpoint such as /animals should serve an HTML page.

app.get("/api/animals", (req, res) => {
    let results = animals;
    if(req.query) {
        results = filterByQuery(req.query, results);
    }
    res.send(results);
})

app.get("/api/animals/:id", (req, res) => {
    const result = findById(req.params.id, animals);
    if(result){
        res.json(result);
    } else {res.send("404: Animal not found")}
})

app.post("/api/animals", (req, res) => {
    req.body.id = animals.length.toString();
    if(!validateAnimal(req.body)) {
        res.status(400).send("The animal is not properly formatted.");
    } else {
        const animal = createNewAnimal(req.body, animals)
        res.json(animal);
    }
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html')); 
})

app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
})

app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
  })

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));  
  });

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})