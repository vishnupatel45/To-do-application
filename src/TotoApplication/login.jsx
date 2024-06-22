import { useState } from "react";
import { Formik, Field, Form, ErrorMessage, setFieldError } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import "./login.css";
import { Button } from "@mui/material";
import axios from "axios";
import { useCookies } from "react-cookie";

export default function Login() {
  const [error, setError] = useState(null);
  const[cookies,setCookie]=useCookies("username");
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const response = await axios.post("http://127.0.0.1:7500/login", values);
      console.log("Login successful:", response.data);
      setCookie("username",response.data.username);
      navigate("/");
      setError(null);
      // You can perform further actions after successful login, such as redirecting the user to another page
    } catch (error) {
      console.error("Login failed:", error.response.data);
      if (error.response.status === 401) {
        setFieldError("password", "Incorrect username or password");
      } else {
        setError(error.response.data.message || "Login failed");
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="Login mt-3 mx-auto p-5 rounded text-dark">
      <h2 className="text-center text-white mb-5">Login</h2>
      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={yup.object({
          username: yup.string().required(),
          password: yup.string().required().min(8, "Password must be at least 8 characters"),
        })}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            <div className="form-floating my-3">
              <Field name="username" type="text" className="form-control" placeholder="" />
              <label htmlFor="username">Username</label>
              <p className="text-danger"><ErrorMessage name="username" /></p>
            </div>
            <div className="form-floating mb-4">
              <Field name="password" type="text" className="form-control" placeholder="" />
              <label htmlFor="password">Password</label>
              <p className="text-danger"><ErrorMessage name="password" /></p>
            </div>
            {error && <div className="text-danger mb-3">{error}</div>}
            <Button variant="contained" className="w-100" color="info" type="submit">Submit</Button>
          </Form>
        )}
      </Formik>

      <div className="text-white-50 my-2">
        Don't have an account?
      </div>
      <Link to="/register"><Button variant="contained" className="w-100 mb-4" color="error" type="button">Register</Button></Link>
    </div>
  );
}