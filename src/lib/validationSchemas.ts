import * as Yup from 'yup';
import { checkUser } from './dbUserActions';

export const forgotPasswordValidation = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email('Email is invalid')
    .test('unique-email', 'Email exists', async (value) => {
      if (!value) return false;
      return (checkUser({ email: value }));
    }),
});

export const signUpValidation = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email('Email is invalid')
    .test('unique-email', 'Email already in use', async (value) => {
      if (!value) return false;
      return !(await checkUser({ email: value }));
    }),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(20, 'Password must not exceed 20 characters'),
  confirmPassword: Yup.string()
    .required('Confirm Password is required')
    .oneOf([Yup.ref('password'), Yup.ref('confirmPassword')], 'Passwords must match'),
});

export const signInValidation = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email('Email is invalid'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(20, 'Password must not exceed 20 characters'),
});
