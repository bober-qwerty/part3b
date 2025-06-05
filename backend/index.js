const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serwowanie statycznych plików z folderu 'dist'
app.use(express.static(path.join(__dirname, 'dist')));

// Dane przykładowe
let persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
];

// API endpoints

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/info', (req, res) => {
  const time = new Date();
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${time}</p>
  `);
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = persons.find(p => p.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  persons = persons.filter(p => p.id !== id);
  res.status(204).end();
});

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: 'Name or number is missing' });
  }

  if (persons.find(p => p.name === name)) {
    return res.status(400).json({ error: 'Name must be unique' });
  }

  const newPerson = {
    id: (Math.floor(Math.random() * 1000000)).toString(),
    name,
    number
  };

  persons.push(newPerson);
  res.status(201).json(newPerson);
});

app.put('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const { name, number } = req.body;

  const index = persons.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Not found' });
  }

  const updatedPerson = { ...persons[index], name, number };
  persons[index] = updatedPerson;
  res.json(updatedPerson);
});

// Obsługa innych ścieżek - fallback do index.html (dla React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Uruchomienie serwera
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
