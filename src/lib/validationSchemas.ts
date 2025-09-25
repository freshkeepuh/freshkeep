import * as Yup from 'yup';
import { checkUser } from './dbUserActions';

export const forgotPasswordValidation = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email('Email is invalid')
    .test('unique-email', 'Email exists', async (value) => {
      if (!value) return false;
      return (await checkUser({ email: value }));
    }),
});
