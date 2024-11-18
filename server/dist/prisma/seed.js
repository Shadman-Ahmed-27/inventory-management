"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prisma = new client_1.PrismaClient();
function deleteAllData() {
    return __awaiter(this, void 0, void 0, function* () {
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
            const model = prisma[modelName];
            if (model) {
                try {
                    console.log(`Deleting data from model: ${modelName}`);
                    yield model.deleteMany({});
                    console.log(`Successfully cleared data from ${modelName}`);
                }
                catch (error) {
                    console.error(`Failed to clear data from ${modelName}:`, error);
                }
            }
            else {
                console.error(`Model ${modelName} not found. Please ensure the model name is correctly specified.`);
            }
        }
    });
}
function seedData() {
    return __awaiter(this, void 0, void 0, function* () {
        const dataDirectory = path_1.default.join(__dirname, "seedData");
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
            const filePath = path_1.default.join(dataDirectory, fileName);
            if (!fs_1.default.existsSync(filePath)) {
                console.error(`File not found: ${filePath}`);
                continue;
            }
            const jsonData = JSON.parse(fs_1.default.readFileSync(filePath, "utf-8"));
            const modelName = path_1.default.basename(fileName, path_1.default.extname(fileName));
            const model = prisma[modelName];
            if (!model) {
                console.error(`No Prisma model matches the file name: ${fileName}`);
                continue;
            }
            console.log(`Seeding ${modelName} with data from ${fileName}`);
            for (const data of jsonData) {
                try {
                    yield model.create({ data });
                }
                catch (error) {
                    console.error(`Failed to insert data into ${modelName} from ${fileName}:`, error);
                }
            }
            console.log(`Successfully seeded ${modelName}`);
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Starting data deletion...");
        yield deleteAllData();
        console.log("Starting data seeding...");
        yield seedData();
        console.log("Seeding process complete.");
    });
}
main()
    .catch((e) => {
    console.error("Error during seeding:", e);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
