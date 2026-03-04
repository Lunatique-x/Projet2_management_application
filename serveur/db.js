const knex = require('knex');

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: './db.sqlite3'
  },
  useNullAsDefault: true
});

// Enable foreign keys
db.raw('PRAGMA foreign_keys = ON');

async function createTables() {

  // ---- role ----
  const existsRole = await db.schema.hasTable("role");
  if (!existsRole) {
    await db.schema.createTable("role", (table) => {
      table.increments("id_role").primary();
      table.string("nom").notNullable();
      table.string("commentaire");
    });
  }

  // ---- employe ----
  const existsEmploye = await db.schema.hasTable("employe");
  if (!existsEmploye) {
    await db.schema.createTable("employe", (table) => {
      table.increments("id_employe").primary();
      table.string("full_name").notNullable();
      table.string("email").notNullable();
      table.string("phone").notNullable();
      table.timestamp("date_embauche");
      table.float("commission");
      table.integer("role_id")
           .references("id_role")
           .inTable("role")
           .onDelete("SET NULL");
    });
  }

  // ---- client ----
  const existsClient = await db.schema.hasTable("client");
  if (!existsClient) {
    await db.schema.createTable("client", (table) => {
      table.increments("id_client").primary();
      table.string("full_name").notNullable();
      table.string("email").notNullable();
      table.string("phone").notNullable();
      table.timestamp("date_creation").defaultTo(db.fn.now());
    });
  }

  // ---- voiture ----
  const existsVoiture = await db.schema.hasTable("voiture");
  if (!existsVoiture) {
    await db.schema.createTable("voiture", (table) => {
      table.increments("id_voiture").primary();
      table.string("modele").notNullable();
      table.integer("stock").notNullable();
      table.string("couleur").notNullable();
      table.float("prix").notNullable();
    });
  }

  // ---- payement ----
  const existsPayement = await db.schema.hasTable("payement");
  if (!existsPayement) {
    await db.schema.createTable("payement", (table) => {
      table.increments("id_payement").primary();
      table.timestamp("date_creation").defaultTo(db.fn.now());
      table.timestamp("date_fin_garantie");
      table.float("prix_vente").notNullable();

      table.integer("client_id")
           .references("id_client")
           .inTable("client")
           .onDelete("CASCADE");

      table.integer("voiture_id")
           .references("id_voiture")
           .inTable("voiture")
           .onDelete("CASCADE");

      table.integer("employe_id")
           .references("id_employe")
           .inTable("employe")
           .onDelete("SET NULL");
    });
  }
}

// call function
createTables();

module.exports = db;