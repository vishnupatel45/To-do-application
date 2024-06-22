import { Form, Formik, ErrorMessage, Field } from "formik";
import "./register.css";
import { Link } from "react-router-dom";
import { Button } from "@mui/material/";
import * as yup from 'yup';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

export default function Register() {
    const navigate = useNavigate();
    const[cookies,setCookies]=useCookies("username");

    return (
        <div className="Register mt-3 p-5 rounded text-dark">
            <h2 className="text-center text-white mb-5">Register</h2>
            <Formik
                initialValues={{
                    username: "",
                    password: "",
                    email: ""
                }}
                validationSchema={yup.object({
                    username: yup.string().required(),
                    password: yup.string().required().min(8, "Password must be at least 8 characters"),
                    email: yup.string().required("Please enter email")
                })}
                onSubmit={(values, { setSubmitting, setFieldError }) => {
                    axios.post("http://127.0.0.1:7500/register-user", values)
                        .then(response => {
                            
                            console.log("Registration successful:", response.data);
                            setCookies("username",response.data.username);
                            alert("Registration successful")
                            navigate("/");
                        })
                        .catch(error => {
                            console.error("Registration failed:", error);
                            if (error.response && error.response.data && error.response.data.message) {
                                setFieldError("username", error.response.data.message);
                            }
                        })
                        .finally(() => {
                            setSubmitting(false);
                        });
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <div className="form-floating my-3">
                            <Field name="username" type="text" className="form-control" placeholder="" />
                            <label htmlFor="username">Username</label>
                            <p className="text-danger fw-bold"><ErrorMessage name="username" /></p>
                        </div>
                        <div className="form-floating mb-3">
                            <Field name="password" type="password" className="form-control" placeholder="" />
                            <label htmlFor="password">Password</label>
                            <p className="text-danger fw-bold"><ErrorMessage name="password" /></p>
                        </div>
                        <div className="form-floating mb-4">
                            <Field name="email" type="email" className="form-control" placeholder="" />
                            <label htmlFor="email">Email</label>
                            <p className="text-danger fw-bold"><ErrorMessage name="email" /></p>
                        </div>
                        <Button type="submit" className="w-100" variant="contained" disabled={isSubmitting}>
                            {isSubmitting ? "Registering..." : "Register"}
                        </Button>
                    </Form>
                )}
            </Formik>

            <div className="text-white-50 my-2">
                Already have an account?
            </div>
            <Link to="/login">
                <Button variant="contained" className="w-100 mb-4" color="error" type="button">Login</Button>
            </Link>
        </div>
    );
}