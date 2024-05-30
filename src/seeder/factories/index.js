const seedTable = async (Table, data) => {
  const tableName = Table.getTableName();
  try {
    console.log(`---Seeding to ${tableName} table---`);

    await Table.bulkCreate(data);

    console.log(` ${data.length} document inserted to ${tableName} table`);
  } catch (err) {
    console.log("Insertion failed!");
    console.log(err);
  }
};

const dropTable = async (Table) => {
  const tableName = Table.getTableName();
  try {
    await Table.destroy({ where: {}, truncate: false });
    console.log(`---${tableName} table dropped---`);
  } catch (err) {
    console.log(`---${tableName} table drop failed---`);
  }
};

export { seedTable, dropTable };
