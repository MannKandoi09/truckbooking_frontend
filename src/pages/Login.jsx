import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

const Login = () => {

  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),

    password: Yup.string()
      .required('Password is required'),
  });

  const formik = useFormik({

    initialValues: {
      email: '',
      password: '',
    },

    validationSchema,

    onSubmit: async (values, { setSubmitting, setErrors }) => {

      try {

        const response = await login(values);

        // Backend Response
        const loginData = response.data.data;

        // Save JWT Token
        localStorage.setItem("token", loginData.token);

        // Save User Details
        localStorage.setItem("role", loginData.role);
        localStorage.setItem("userId", loginData.id);
        localStorage.setItem("firstName", loginData.firstName);
        localStorage.setItem("lastName", loginData.lastName);
        localStorage.setItem("email", loginData.email);

        // Redirect Based On Role
        if (loginData.role === "ADMIN") {

          navigate("/admin-dashboard");

        } else {

          navigate("/user-dashboard");

        }

      } catch (error) {

        setErrors({
          email:
            error.response?.data?.message ||
            "Invalid Email or Password"
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

        <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 md:p-10">

          <div className="text-center mb-8">

            <h2 className="text-3xl font-bold text-slate-800">
              Welcome Back!
            </h2>

            <p className="text-slate-500 mt-2">
              Login to your account to continue
            </p>

          </div>

          <form
            onSubmit={formik.handleSubmit}
            className="space-y-5"
          >

            <div>

              <input
                name="email"
                type="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                className={`w-full p-4 border rounded-xl bg-gray-50 outline-none ${
                  formik.errors.email
                    ? "border-red-500"
                    : "border-gray-200"
                }`}
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
                name="password"
                type="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                className={`w-full p-4 border rounded-xl bg-gray-50 outline-none ${
                  formik.errors.password
                    ? "border-red-500"
                    : "border-gray-200"
                }`}
                placeholder="Password"
              />

              {formik.errors.password && (

                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.password}
                </p>

              )}

            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:bg-blue-400"
            >

              {formik.isSubmitting
                ? "Logging in..."
                : "Login"}

            </button>

          </form>

          <p className="mt-8 text-center text-sm text-slate-600">

            Don't have an account?

            <Link
              to="/register"
              className="font-bold text-blue-600 hover:underline ml-1"
            >
              Register Now
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
};

export default Login;