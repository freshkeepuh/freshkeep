/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `EnrollmentData` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `StudentData` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EnrollmentData_email_key" ON "EnrollmentData"("email");

-- CreateIndex
CREATE UNIQUE INDEX "StudentData_email_key" ON "StudentData"("email");
