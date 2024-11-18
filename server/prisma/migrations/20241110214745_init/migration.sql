-- Create Users table
CREATE TABLE "Users" (
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    CONSTRAINT "Users_pkey" PRIMARY KEY ("userId")
);

-- Create Products table
CREATE TABLE "Products" (
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "rating" DOUBLE PRECISION,
    "stockQuantity" INTEGER NOT NULL,
    CONSTRAINT "Products_pkey" PRIMARY KEY ("productId")
);

-- Create Sales table
CREATE TABLE "Sales" (
    "saleId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    CONSTRAINT "Sales_pkey" PRIMARY KEY ("saleId")
);

-- Create Purchases table
CREATE TABLE "Purchases" (
    "purchaseId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitCost" DOUBLE PRECISION NOT NULL,
    "totalCost" DOUBLE PRECISION NOT NULL,
    CONSTRAINT "Purchases_pkey" PRIMARY KEY ("purchaseId")
);

-- Create Expenses table
CREATE TABLE "Expenses" (
    "expenseId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Expenses_pkey" PRIMARY KEY ("expenseId")
);

-- Create SalesSummary table
CREATE TABLE "SalesSummary" (
    "salesSummaryId" TEXT NOT NULL,
    "totalValue" DOUBLE PRECISION NOT NULL,
    "changePercentage" DOUBLE PRECISION,
    "date" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SalesSummary_pkey" PRIMARY KEY ("salesSummaryId")
);

-- Create PurchaseSummary table
CREATE TABLE "PurchaseSummary" (
    "purchaseSummaryId" TEXT NOT NULL,
    "totalPurchased" DOUBLE PRECISION NOT NULL,
    "changePercentage" DOUBLE PRECISION,
    "date" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PurchaseSummary_pkey" PRIMARY KEY ("purchaseSummaryId")
);

-- Create ExpenseSummary table
CREATE TABLE "ExpenseSummary" (
    "expenseSummaryId" TEXT NOT NULL,
    "totalExpenses" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ExpenseSummary_pkey" PRIMARY KEY ("expenseSummaryId")
);

-- Create ExpenseByCategory table
CREATE TABLE "ExpenseByCategory" (
    "expenseByCategoryId" TEXT NOT NULL,
    "expenseSummaryId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ExpenseByCategory_pkey" PRIMARY KEY ("expenseByCategoryId")
);

-- Add Foreign Key for Sales -> Products
ALTER TABLE "Sales"
ADD CONSTRAINT "Sales_productId_fkey"
FOREIGN KEY ("productId") REFERENCES "Products"("productId")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- Add Foreign Key for Purchases -> Products
ALTER TABLE "Purchases"
ADD CONSTRAINT "Purchases_productId_fkey"
FOREIGN KEY ("productId") REFERENCES "Products"("productId")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- Add Foreign Key for ExpenseByCategory -> ExpenseSummary
ALTER TABLE "ExpenseByCategory"
ADD CONSTRAINT "ExpenseByCategory_expenseSummaryId_fkey"
FOREIGN KEY ("expenseSummaryId") REFERENCES "ExpenseSummary"("expenseSummaryId")
ON DELETE CASCADE
ON UPDATE CASCADE;
