import * as Yup from 'yup';

import { Hobby, Level, Major } from '@prisma/client';

export const levelKeys = Object.keys(Level).filter((key) => Number.isNaN(Number(key)));
export const hobbyKeys = Object.keys(Hobby).filter((key) => Number.isNaN(Number(key)));
export const majorKeys = Object.keys(Major).filter((key) => Number.isNaN(Number(key)));

export const gpaValues = ['0.0-0.9', '1.0-1.9', '2.0-2.9', '3.0-3.9', '4.0+'];
export const gpa2String = (num: number) => gpaValues[num];
export const gpa2Number = (str: string) => gpaValues.indexOf(str);

export interface ICreateStudentForm {
  bio: string | undefined | null;
  enrolled?: Date | undefined | null;
  hobbies?: (string | undefined | null)[] | undefined;
  name: string;
  email: string;
  level: string;
  gpa: number;
  major: string;
}

export const CreateStudentSchema = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string().email().required(),
  bio: Yup.string().optional(),
  level: Yup.string().required(),
  gpa: Yup.number().required(),
  enrolled: Yup.date().required(),
  hobbies: Yup.array().of(Yup.string()),
  major: Yup.string().oneOf(majorKeys),
});

export const EditStudentSchema = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string().email().required(),
  bio: Yup.string(),
  level: Yup.string().required(),
  gpa: Yup.number().required(),
  enrolled: Yup.date().required(),
  hobbies: Yup.array().of(Yup.string()),
  major: Yup.string().oneOf(majorKeys),
});
