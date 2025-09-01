-- CreateEnum
CREATE TYPE "Hobby" AS ENUM ('Surfing', 'Running', 'Biking', 'Paddling');

-- CreateEnum
CREATE TYPE "Level" AS ENUM ('Freshman', 'Sophomore', 'Junior', 'Senior');

-- CreateEnum
CREATE TYPE "Major" AS ENUM ('Physics', 'Math', 'Chemistry', 'ComputerScience');

-- CreateTable
CREATE TABLE "EnrollmentData" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "enrolled" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EnrollmentData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentData" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "bio" TEXT,
    "hobbies" "Hobby"[],
    "level" "Level" NOT NULL,
    "gpa" INTEGER NOT NULL,
    "major" "Major" NOT NULL,

    CONSTRAINT "StudentData_pkey" PRIMARY KEY ("id")
);
