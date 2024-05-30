import categorySeed from "./seeds/category.seed.js";

const seed = async () => {
  if (process.argv[2] === "--import") {
    await seedAll();
    process.exit();
  } else if (process.argv[2] === "--destroy") {
    await dropAll();
    process.exit();
  } else if (process.argv[2] === "--refresh") {
    await dropAll();
    await seedAll();
    process.exit();
  }
};

const seedAll = async () => {
  console.log("Seeding...");
  await categorySeed("seed");
  console.log("Seeding complete!");
};

const dropAll = async () => {
  console.log("Dropping...");
  await categorySeed("drop");
  console.log("Dropping complete!");
};

export default seed;
