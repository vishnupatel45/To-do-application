import React, { useState, useEffect } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from 'yup';
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import "./dashboard.css";

const Dashboard = () => {
    const [cookies, setCookie, removeCookie] = useCookies(["username"]);
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState(false);
    const [toggle, setToggle] = useState(""); //for calling useEffect after function calls
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (cookies.username) {
                    const response = await axios.get(`http://localhost:7500/get-data/${cookies.username}`);
                    setTasks(response.data.tasks.reverse());
                } else {
                    navigate("/login");
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [cookies.username, navigate, toggle]);

    const handleSignout = () => {
        removeCookie("username");
        window.location.reload();
    };

    const handleDeleteTask = async (title) => {
        try {
            await axios.delete(`http://127.0.0.1:7500/delete-task/${cookies.username}/${title}`);
            setToggle(Date.now());
        } catch (error) {
            console.error(error);
        }
    };

    const initialValues = {
        tasktitle: "",
        description: "",
        taskdate: "",
        username: cookies.username || ""
    };

    return (
        <div className="Dashboard row container-fluid m-0 p-0">
            <div className="col d-none d-lg-block"></div>
            <div className="col p-0">
                <div className="h3 my-3 text-center">
                    {cookies.username}'s Dashboard &nbsp;
                    <button className="btn bg-gradient text-danger fw-bold rounded" onClick={handleSignout}>Signout</button>
                </div>
                <div className="dashboard-items bg-dark container-fluid">
                    {newTask &&
                        <div className="popup bg-dark p-3 rounded">
                            <div className="h4">Add Task Details</div>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={
                                    yup.object({
                                        tasktitle: yup.string().required(),
                                        description: yup.string().required(),
                                        taskdate: yup.string().required(),
                                    })
                                }
                                onSubmit={async (values) => {
                                    try {
                                        await axios.post(`http://127.0.0.1:7500/addtask`, values);
                                        setNewTask(false);
                                        setToggle(Date.now());
                                    } catch (error) {
                                        console.error(error);
                                    }
                                }}
                            >
                                {() => (
                                    <Form>
                                        <div className="form-floating mb-3 text-secondary">
                                            <Field name="tasktitle" placeholder="" autoFocus className="form-control"></Field>
                                            <label htmlFor="tasktitle">Task Title</label>
                                            <ErrorMessage name="tasktitle" component="p" className="text-danger fw-bold" />
                                        </div>
                                        <div className="form-floating mb-3 text-secondary">
                                            <Field name="description" placeholder="" className="form-control"></Field>
                                            <label htmlFor="description">Description</label>
                                            <ErrorMessage name="description" component="p" className="text-danger fw-bold" />
                                        </div>
                                        <div className="form-floating mb-3">
                                            <Field name="taskdate" type="date" placeholder="" className="form-control"></Field>
                                            <label htmlFor="taskdate">Task Date</label>
                                            <ErrorMessage name="taskdate" component="p" className="text-danger fw-bold" />
                                        </div>
                                        <button type="submit" className="btn btn-warning w-100 rounded-5 fw-bold"> Save +</button>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    }
                    <div className="row p-3 text-white bg-gradient rounded-top bg-dark border-bottom">
                        <div className="col-1">No</div>
                        <div className="col-7">Task Name</div>
                        <div className="col-3">Date</div>
                        <div className="col-1 p-0">
                            <button className="rounded btn py-0 px-1 bg-gradient bi-plus text-white" onClick={() => setNewTask(!newTask)}></button>
                        </div>
                    </div>
                    {tasks && tasks.length > 0 ?
                        tasks.map((task, index) => (
                            <div className="row p-3" key={index}>
                                <div className="col-1">{index + 1}</div>
                                <div className="col-7">{task.title}</div>
                                <div className="col-3">{new Date(task.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'numeric', year: 'numeric' })}</div>
                                <div className="col-1 text-start p-0">
                                    <button className="rounded btn py-0 px-1 bg-gradient bi-trash-fill text-danger" onClick={() => handleDeleteTask(task.title)}></button>
                                </div>
                                <div className="bg-white p-3 rounded-3 mt-2 text-dark">{task.description}</div>
                            </div>
                        )) :
                        "no data found"}
                </div>
            </div>
            <div className="col d-none d-lg-block"></div>
        </div>
    );
};

export default Dashboard;