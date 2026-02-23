-- Create enums
CREATE TYPE "EquipmentStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'RETIRED');
CREATE TYPE "StoplightStatus" AS ENUM ('GREEN', 'YELLOW', 'RED');
CREATE TYPE "WorkOrderStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'COMPLETED');

-- Create tables
CREATE TABLE "Role" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE
);

CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "roleId" INTEGER NOT NULL REFERENCES "Role"("id"),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Equipment" (
  "id" TEXT PRIMARY KEY,
  "assetTag" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "model" TEXT NOT NULL,
  "serialNumber" TEXT,
  "location" TEXT NOT NULL,
  "status" "EquipmentStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "TeamLeader" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id"),
  "equipmentId" TEXT NOT NULL REFERENCES "Equipment"("id"),
  "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("userId", "equipmentId")
);

CREATE TABLE "Template" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "TemplateItem" (
  "id" TEXT PRIMARY KEY,
  "templateId" TEXT NOT NULL REFERENCES "Template"("id") ON DELETE CASCADE,
  "label" TEXT NOT NULL,
  "required" BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE "Inspection" (
  "id" TEXT PRIMARY KEY,
  "equipmentId" TEXT NOT NULL REFERENCES "Equipment"("id"),
  "inspectorId" TEXT NOT NULL REFERENCES "User"("id"),
  "templateId" TEXT REFERENCES "Template"("id"),
  "status" "StoplightStatus" NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "WorkOrder" (
  "id" TEXT PRIMARY KEY,
  "inspectionId" TEXT NOT NULL UNIQUE REFERENCES "Inspection"("id"),
  "summary" TEXT NOT NULL,
  "status" "WorkOrderStatus" NOT NULL DEFAULT 'OPEN',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "NotificationSetting" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id"),
  "emailEnabled" BOOLEAN NOT NULL DEFAULT true,
  "smsEnabled" BOOLEAN NOT NULL DEFAULT false,
  "redAlertOnly" BOOLEAN NOT NULL DEFAULT true,
  UNIQUE("userId")
);
