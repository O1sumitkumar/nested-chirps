import * as Yup from 'yup';

export const signupValidationSchema = Yup.object({
  fullName: Yup.string()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must be no more than 50 characters'),
  
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be no more than 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  
  email: Yup.string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  
  password: Yup.string()
    .required('Password is required')
    .min(9, 'Password must be at least 9 characters')
    .max(32, 'Password must be no more than 32 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
});

export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  
  password: Yup.string()
    .required('Password is required')
    .min(9, 'Password must be at least 9 characters')
    .max(32, 'Password must be no more than 32 characters'),
});

export type SignupFormValues = Yup.InferType<typeof signupValidationSchema>;
export type LoginFormValues = Yup.InferType<typeof loginValidationSchema>;
