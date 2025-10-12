import * as Yup from 'yup';
import { checkUser } from './dbUserActions';

export const forgotPasswordValidation = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email('Email is invalid')
    .test('unique-email', 'Email not found', async (value) => {
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
    .oneOf([Yup.ref('password')], 'Passwords must match'),
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

/**
 * Validation schema for Store form.
 */
export const storeValidation = Yup.object().shape({
  id: Yup.string().optional(),
  name: Yup.string()
    .required('Store name is required')
    .max(100, 'Store name must not exceed 100 characters'),
  address1: Yup.string()
    .required('Address 1 is required')
    .max(100, 'Address 1 must not exceed 100 characters'),
  address2: Yup.string()
    .max(100, 'Address 2 must not exceed 100 characters'),
  city: Yup.string()
    .required('City is required')
    .max(50, 'City must not exceed 50 characters'),
  state: Yup.string()
    .required('State is required')
    .max(50, 'State must not exceed 50 characters'),
  zipcode: Yup.string()
    .required('Zipcode is required')
    .max(20, 'Zipcode must not exceed 20 characters'),
  country: Yup.string()
    .default('USA')
    .oneOf(Object.values(Yup.ref('Country')), 'Invalid country selection'),
  phone: Yup.string()
    .max(20, 'Phone number must not exceed 20 characters'),
  website: Yup.string()
    .url('Website must be a valid URL')
    .max(256, 'Website must not exceed 256 characters'),
  picture: Yup.string()
    .max(256, 'Picture must not exceed 256 characters'),
});
