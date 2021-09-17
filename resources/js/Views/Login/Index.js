import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { inject, observer } from "mobx-react";

const Login = (props) => {
    const [errors, setErrors] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (props.AuthStore.appState != null) {
            if (props.AuthStore.appState.isLoggedIn) {
                return props.history.push("/");
            }
        }
    });

    const handleSubmit = (values) => {
        axios
            .post(`/api/auth/login`, { ...values })
            .then((res) => {
                if (res.data.success) {
                    const userData = {
                        id: res.data.id,
                        name: res.data.name,
                        email: res.data.email,
                        access_token: res.data.access_token,
                    };
                    const appState = {
                        isLoggedIn: true,
                        user: userData,
                    };
                    props.AuthStore.saveToken(appState);
                    //props.history.push('/');
                    window.location.reload();
                } else {
                    alert("Giriş Yapamadınız");
                }
            })
            .catch((error) => {
                if (error.response) {
                    let err = error.response.data;
                    if (err.errors) {
                        setErrors(err.errors);
                    } else {
                        setError(error.response.data.message);
                    }
                    //alert(err.errors)
                } else if (error.request) {
                    let err = error.request;
                    setError(err);
                } else {
                    setError(error.message);
                }
            });
    };
    let arr = [];
    if (errors.length > 0) {
        Object.values(errors).forEach((value) => {
            arr.push(value);
        });
    }
    return (
        <div className="form-signin text-center mt-5">
            <div>
                <img
                    className="mb-4"
                    src="https://getbootstrap.com/docs/5.1/assets/brand/bootstrap-logo.svg"
                    alt=""
                    width="72"
                    height="57"
                />
                <h1 className="h3 mb-3 font-weight-normal">Panele Giriş Yap</h1>
                {arr.length != 0 && arr.map((item) => <p>{item}</p>)}
                {error != "" && <p>{error}</p>}
                <Formik
                    initialValues={{
                        email: "",
                        password: "",
                    }}
                    onSubmit={handleSubmit}
                    validationSchema={Yup.object().shape({
                        email: Yup.string()
                            .email("Email Formatı Hatalı")
                            .required("Email Zorunludur"),
                        password: Yup.string().required("Şifre Zorunludur"),
                    })}
                >
                    {({
                        values,
                        handleChange,
                        handleSubmit,
                        handleBlur,
                        errors,
                        isValid,
                        isSubmitting,
                        touched,
                    }) => (
                        <div>
                            <div className="form-group">
                                <label htmlFor="inputEmail" className="sr-only">
                                    Email Adres
                                </label>
                                <input
                                    autoComplete="off"
                                    type="email"
                                    className="form-control"
                                    placeholder="Email address"
                                    value={values.email}
                                    onChange={handleChange("email")}
                                />
                                {errors.email && touched.email && (
                                    <p>{errors.email}</p>
                                )}
                            </div>

                            <div className="form-group">
                                <label
                                    htmlFor="inputPassword"
                                    className="sr-only"
                                >
                                    Şifre
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Şifre"
                                    value={values.password}
                                    onChange={handleChange("password")}
                                />
                                {errors.password && touched.password && (
                                    <p>{errors.password}</p>
                                )}
                            </div>

                            <button
                                disabled={!isValid || isSubmitting}
                                onClick={handleSubmit}
                                className="btn btn-lg btn-primary btn-block"
                                type="button"
                            >
                                Giriş Yap
                            </button>
                        </div>
                    )}
                </Formik>
                <Link
                    className="mt-3"
                    style={{ display: "block" }}
                    to="/register"
                >
                    Kayıt Ol
                </Link>
                <p className="mt-5 mb-3 text-muted">© 2017-2018</p>
            </div>
        </div>
    );
};

export default inject("AuthStore")(observer(Login));
