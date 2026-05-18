const path = require('path');
const knex = require('knex');
const bcrypt = require('bcrypt');

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, 'db.sqlite3')
  },
  useNullAsDefault: true
});

async function createTables() {
  // Enable foreign keys before creating tables
  await db.raw('PRAGMA foreign_keys = ON');

  // ---- role ----
  const existsRole = await db.schema.hasTable("role");

if (!existsRole) {
  await db.schema.createTable("role", (table) => {
    table.increments("id_role").primary();

    table.string("nom").notNullable();
    table.boolean("viewStock").notNullable().defaultTo(false);
    table.boolean("modStock").notNullable().defaultTo(false);
    table.boolean("viewClients").notNullable().defaultTo(false);
    table.boolean("delClients").notNullable().defaultTo(false);
    table.boolean("modClients").notNullable().defaultTo(false);
    table.boolean("viewSell").notNullable().defaultTo(false);
    table.boolean("delSell").notNullable().defaultTo(false);
    table.boolean("addSell").notNullable().defaultTo(false);
    table.boolean("addClient").notNullable().defaultTo(false);
    table.boolean("addStock").notNullable().defaultTo(false);
    table.boolean("delStock").notNullable().defaultTo(false);
  });
} else {
  const roleTable = "role";

  if (!(await db.schema.hasColumn(roleTable, 'viewStock'))) {
    await db.schema.table(roleTable, (table) => {
      table.boolean('viewStock').notNullable().defaultTo(false);
    });
  }

  if (!(await db.schema.hasColumn(roleTable, 'viewClients'))) {
    await db.schema.table(roleTable, (table) => {
      table.boolean('viewClients').notNullable().defaultTo(false);
    });
  }

  if (!(await db.schema.hasColumn(roleTable, 'delClients'))) {
    await db.schema.table(roleTable, (table) => {
      table.boolean('delClients').notNullable().defaultTo(false);
    });
  }

  if (!(await db.schema.hasColumn(roleTable, 'viewSell'))) {
    await db.schema.table(roleTable, (table) => {
      table.boolean('viewSell').notNullable().defaultTo(false);
    });
  }

  if (!(await db.schema.hasColumn(roleTable, 'delSell'))) {
    await db.schema.table(roleTable, (table) => {
      table.boolean('delSell').notNullable().defaultTo(false);
    });
  }

  if (!(await db.schema.hasColumn(roleTable, 'addSell'))) {
    await db.schema.table(roleTable, (table) => {
      table.boolean('addSell').notNullable().defaultTo(false);
    });
  }

  if (!(await db.schema.hasColumn(roleTable, 'addStock'))) {
    await db.schema.table(roleTable, (table) => {
      table.boolean('addStock').notNullable().defaultTo(false);
    });
  }

  if (!(await db.schema.hasColumn(roleTable, 'delStock'))) {
    await db.schema.table(roleTable, (table) => {
      table.boolean('delStock').notNullable().defaultTo(false);
    });
  }

  if ((await db.schema.hasColumn(roleTable, 'seeStock')) && (await db.schema.hasColumn(roleTable, 'viewStock'))) {
    await db.raw('UPDATE role SET viewStock = seeStock');
  }

  if ((await db.schema.hasColumn(roleTable, 'seeClients')) && (await db.schema.hasColumn(roleTable, 'viewClients'))) {
    await db.raw('UPDATE role SET viewClients = seeClients');
  }
}

  // ---- employe ----
  const existsEmploye = await db.schema.hasTable("employe");
  if (!existsEmploye) {
    await db.schema.createTable("employe", (table) => {
      table.increments("id_employe").primary();
      table.string("full_name");
      table.string("email").notNullable();
      table.string("phone");
      table.date("date_embauche").defaultTo(db.raw('CURRENT_DATE'));
      table.string("password").notNullable();
      table.float("commission");
      table.integer("role_id")
           .references("id_role")

           .inTable("role")
           .onDelete("SET NULL");
    });
  }

  await seedAdminRoleAndUser();

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

  await seedDefaultClientAndVoiture();

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

async function seedAdminRoleAndUser() {
  const adminRoleName = 'admin';
  let adminRole = await db('role').where({ nom: adminRoleName }).first();

  if (!adminRole) {
    await db('role').insert({
      nom: adminRoleName,
      viewStock: true,
      modStock: true,
      viewClients: true,
      delClients: true,
      modClients: true,
      viewSell: true,
      delSell: true,
      addSell: true,
      addClient: true,
      addStock: true,
      delStock: true
    });
    adminRole = await db('role').where({ nom: adminRoleName }).first();
  } else {
    await db('role')
      .where({ id_role: adminRole.id_role })
      .update({
        viewStock: true,
        modStock: true,
        viewClients: true,
        delClients: true,
        modClients: true,
        viewSell: true,
        delSell: true,
        addSell: true,
        addClient: true,
        addStock: true,
        delStock: true
      });
  }

  let adminUser = await db('employe').where({ email: 'admin@gmail.com' }).first();


  if (!adminUser) {
    const hashedPassword = await bcrypt.hash('123456', 10);
    await db('employe').insert({
      full_name: 'Sebastien',
      email: 'admin@gmail.com',
      password: hashedPassword,
      phone: '0000000000',
      commission: 0,
      role_id: adminRole.id_role
    });
  }
}

async function seedDefaultClientAndVoiture() {
  const defaultClientName = 'Myriam';
  const clientExists = await db('client').where({ full_name: defaultClientName }).first();
  if (!clientExists) {
    await db('client').insert({
      full_name: defaultClientName,
      email: 'myriam@example.com',
      phone: '0000000000'
    });
  }

  const defaultVoitureModele = 'Toyota 2017';
  const voitureExists = await db('voiture').where({ modele: defaultVoitureModele }).first();
  if (!voitureExists) {
    await db('voiture').insert({
      modele: defaultVoitureModele,
      stock: 1,
      couleur: 'Blanc',
      prix: 15000
    });
  }
}

// Initialize database schema and seed admin data
// createTables().catch((error) => {
//   console.error('Database initialization error:', error);
// });

// module.exports = db;
// module.exports.initializeDatabase = createTables;



module.exports = {
  db,
  initializeDatabase: createTables
};