const express = require('express');
const knex = require('knex');

const app = express();
app.use(express.json());

// ---- DB CONFIG ----
const db = knex({
  client: 'sqlite3',
  connection: {
    filename: './db.sqlite3'
  },
  useNullAsDefault: true
});

// Enable foreign keys
db.raw('PRAGMA foreign_keys = ON');

// ---- UPDATE HELPERS ----
const updateById = (table, idField) => async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await db(table)
      .where({ [idField]: id })
      .update(req.body);

    if (!updated) {
      return res.status(404).json({ message: 'Not found' });
    }

    const row = await db(table)
      .where({ [idField]: id })
      .first();

    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---- PUT ROUTES ----
app.put('/roles/:id', updateById('role', 'id_role'));
app.put('/employes/:id', updateById('employe', 'id_employe'));
app.put('/clients/:id', updateById('client', 'id_client'));
app.put('/voitures/:id', updateById('voiture', 'id_voiture'));
app.put('/payements/:id', updateById('payement', 'id_payement'));

// ---- START SERVER ----
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


module.exports = app;