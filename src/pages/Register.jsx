import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';

const Register = () => {

  const navigate = useNavigate();

  const validationSchema = Yup.object({

    firstName: Yup.string()
      .required('First Name is required'),

    lastName: Yup.string()
      .required('Last Name is required'),

    email: Yup.string()
      .email('Invalid Email')
      .required('Email is required'),

    phone: Yup.string()
      .matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number')
      .required('Phone Number is required'),

    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm Password is required'),

  });

  const formik = useFormik({

    initialValues: {

      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',

    },

    validationSchema,

    onSubmit: async (values, { setSubmitting, setErrors, resetForm }) => {

      try {

        const response = await register(values);

        alert(response.data.message);

        resetForm();

        navigate('/login');

      } catch (error) {

        setErrors({

          email:
            error.response?.data?.message ||
            'Registration Failed'

        });

      } finally {

        setSubmitting(false);

      }

    },

  });

  return (

    <div className="min-h-screen flex flex-col relative font-sans">

      <div className="absolute inset-0 z-0">

        <img
          src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=2070&auto=format&fit=crop"
          className="w-full h-full object-cover"
          alt="Truck"
        />

        <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply"></div>

      </div>

      <div className="relative z-10 flex-grow flex items-center justify-center p-4">

        <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-8 md:p-10">

          <div className="text-center mb-8">

            <h2 className="text-3xl font-bold text-slate-800">
              Create Your Account
            </h2>

            <p className="text-slate-500 mt-2">
              Fill in the details to get started
            </p>

          </div>

          <form
            onSubmit={formik.handleSubmit}
            className="space-y-4"
          >

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>

                <input
                  name="firstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  className={`w-full p-4 border rounded-xl bg-gray-50 outline-none ${formik.errors.firstName ? 'border-red-500' : 'border-gray-200'}`}
                  placeholder="First Name"
                />

                {formik.errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.firstName}
                  </p>
                )}

              </div>

              <div>

                <input
                  name="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  className={`w-full p-4 border rounded-xl bg-gray-50 outline-none ${formik.errors.lastName ? 'border-red-500' : 'border-gray-200'}`}
                  placeholder="Last Name"
                />

                {formik.errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.lastName}
                  </p>
                )}

              </div>

            </div>

            <div>

              <input
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                className={`w-full p-4 border rounded-xl bg-gray-50 outline-none ${formik.errors.email ? 'border-red-500' : 'border-gray-200'}`}
                placeholder="Email Address"
              />

              {formik.errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.email}
                </p>
              )}

            </div>

            <div>

              <input
                name="phone"
                type="text"
                value={formik.values.phone}
                onChange={formik.handleChange}
                className={`w-full p-4 border rounded-xl bg-gray-50 outline-none ${formik.errors.phone ? 'border-red-500' : 'border-gray-200'}`}
                placeholder="Phone Number"
              />

              {formik.errors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.phone}
                </p>
              )}

            </div>

            <div>

              <input
                name="password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                className={`w-full p-4 border rounded-xl bg-gray-50 outline-none ${formik.errors.password ? 'border-red-500' : 'border-gray-200'}`}
                placeholder="Password"
              />

              {formik.errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.password}
                </p>
              )}

            </div>

            <div>

              <input
                name="confirmPassword"
                type="password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                className={`w-full p-4 border rounded-xl bg-gray-50 outline-none ${formik.errors.confirmPassword ? 'border-red-500' : 'border-gray-200'}`}
                placeholder="Confirm Password"
              />

              {formik.errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.confirmPassword}
                </p>
              )}

            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:bg-blue-400"
            >
              {formik.isSubmitting ? 'Registering...' : 'Register'}
            </button>

          </form>

          <p className="mt-6 text-center text-sm text-slate-600">

            Already have an account?

            <Link
              to="/login"
              className="font-bold text-blue-600 hover:underline ml-1"
            >
              Login Now
            </Link>

          </p>

        </div>

      </div>

    </div>

  );

};

export default Register;