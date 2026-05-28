const express = require('express');
//const  db  = require('./db'); V1
const { db } = require('./db');//V2
const app = express();
app.use(express.json());

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

app.put('/roles/:id', updateById('role', 'id_role'));
app.put('/employes/:id', updateById('employe', 'id_employe'));
app.put('/clients/:id', updateById('client', 'id_client'));
app.put('/voitures/:id', updateById('voiture', 'id_voiture'));
app.put('/payements/:id', async (req, res) => {
  const { id } = req.params;
  const { client_id, employe_id, voiture_id, prix_vente } = req.body;

  try {
    // Utilisation d'une transaction Knex pour sécuriser les modifications d'un coup
    await db.transaction(async (trx) => {
      
      // Récupérer l'ancien paiement pour connaître l'ancienne voiture
      const ancienPayement = await trx('payement')
        .where({ id_payement: id })
        .first();

      if (!ancienPayement) {
        return res.status(404).json({ message: 'Paiement introuvable' });
      }

      const ancienneVoitureId = ancienPayement.voiture_id;
      const nouvelleVoitureId = Number(voiture_id);

      // Si la voiture a changé, on réajuste les stocks
      if (ancienneVoitureId !== nouvelleVoitureId) {
        
        // Rendre le stock à l'ancienne voiture
        await trx('voiture')
          .where({ id_voiture: ancienneVoitureId })
          .increment('stock', 1);

        // Vérifier si la nouvelle voiture a du stock disponible
        const nouvelleVoiture = await trx('voiture')
          .where({ id_voiture: nouvelleVoitureId })
          .first();

        if (!nouvelleVoiture || nouvelleVoiture.stock <= 0) {
          throw new Error("STOCKS_INSUFFISANTS");
        }

        // Déduire le stock de la nouvelle voiture
        await trx('voiture')
          .where({ id_voiture: nouvelleVoitureId })
          .decrement('stock', 1);
      }

      // Mettre à jour la facture de paiement
      await trx('payement')
        .where({ id_payement: id })
        .update({
          client_id,
          employe_id,
          voiture_id: nouvelleVoitureId,
          prix_vente
        });

      // Récupérer la ligne mise à jour pour la renvoyer
      const payementMisAJour = await trx('payement')
        .where({ id_payement: id })
        .first();

      res.json(payementMisAJour);
    });

  } catch (err) {
    if (err.message === "STOCKS_INSUFFISANTS") {
      return res.status(400).json({ error: "La nouvelle voiture sélectionnée est en rupture de stock." });
    }
    console.error("Erreur PUT /payements:", err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = app;