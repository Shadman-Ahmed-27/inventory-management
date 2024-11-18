import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function deleteAllData() {
  // Define models in reverse dependency order
  const orderedModelNames = [
    "Sales", // Dependent on `Products`
    "Purchases", // Dependent on `Products`
    "ExpenseByCategory", // Dependent on `ExpenseSummary`
    "Products", // Independent but referenced by other models
    "ExpenseSummary", // Independent but referenced by `ExpenseByCategory`
    "Users", // Standalone
  ];

  for (const modelName of orderedModelNames) {
    const model: any = prisma[modelName as keyof typeof prisma];
    if (model) {
      try {
        console.log(`Deleting data from model: ${modelName}`);
        await model.deleteMany({});
        console.log(`Successfully cleared data from ${modelName}`);
      } catch (error) {
        console.error(`Failed to clear data from ${modelName}:`, error);
      }
    } else {
      console.error(
        `Model ${modelName} not found. Please ensure the model name is correctly specified.`
      );
    }
  }
}

async function seedData() {
  const dataDirectory = path.join(__dirname, "seedData");

  // Define files in dependency order
  const orderedFileNames = [
    "users.json",
    "products.json",
    "expenseSummary.json",
    "sales.json",
    "purchases.json",
    "expenseByCategory.json",
    "salesSummary.json",
    "purchaseSummary.json",
    "expenses.json",
  ];

  for (const fileName of orderedFileNames) {
    const filePath = path.join(dataDirectory, fileName);

    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      continue;
    }

    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const modelName = path.basename(fileName, path.extname(fileName));
    const model: any = prisma[modelName as keyof typeof prisma];

    if (!model) {
      console.error(`No Prisma model matches the file name: ${fileName}`);
      continue;
    }

    console.log(`Seeding ${modelName} with data from ${fileName}`);
    for (const data of jsonData) {
      try {
        await model.create({ data });
      } catch (error) {
        console.error(
          `Failed to insert data into ${modelName} from ${fileName}:`,
          error
        );
      }
    }
    console.log(`Successfully seeded ${modelName}`);
  }
}

async function main() {
  console.log("Starting data deletion...");
  await deleteAllData();

  console.log("Starting data seeding...");
  await seedData();

  console.log("Seeding process complete.");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
