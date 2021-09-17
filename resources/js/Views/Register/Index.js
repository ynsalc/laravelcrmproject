import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { inject, observer } from 'mobx-react';

const Register = (props) => {
    
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
        console.log(values)
        axios
            .post("/api/auth/register", { ...values })
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
                    props.history.push('/');
                    alert("Kayıt Tamamlandı");
                } else {
                    alert("Kayıt Yapılamadı");
                }
            })
            .catch((error) => {
                if (error.response) {
                    let err = error.response.data;
                    setErrors(err.errors);
                } else if (error.request) {
                    let err = error.request;
                    setError(err);
                } else {
                    setError(error.message);
                }
            });
    };

    let arr = [];
    Object.values(errors).forEach((value) => {
        arr.push(value);
    });

    return (
        <div
            style={{ minWidth: 330, textAlign: "center" }}
            className="text-center"
        >
            <div className="form-signin text-center mt-5">
                <img
                    className="mb-4"
                    src="https://getbootstrap.com/docs/5.1/assets/brand/bootstrap-logo.svg"
                    alt=""
                    width="72"
                    height="57"
                />
                <h1 className="h3 mb-3 font-weight-normal">Panele Kayıt Ol</h1>
                {arr.length != 0 && arr.map((item) => <p>{item}</p>)}
                {error != "" && <p>{error}</p>}
                <Formik
                    initialValues={{
                        name: "",
                        email: "",
                        password: "",
                        password_confirmation: "",
                    }}
                    onSubmit={handleSubmit}
                    validationSchema={Yup.object().shape({
                        email: Yup.string()
                            .email("Email Formatı Hatalı")
                            .required("Email Zorunludur"),
                        name: Yup.string().required(" Ad Soyad Zorunludur"),
                        password: Yup.string().required("Şifre Zorunludur"),
                        password_confirmation: Yup.string().oneOf(
                            [Yup.ref("password"), null],
                            "Şifreler Eşleşmiyor"
                        ),
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
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    onBlur={handleBlur}
                                    placeholder="Ad Soyad"
                                    value={values.name}
                                    onChange={handleChange("name")}
                                />
                                {errors.name && touched.name && (
                                    <p>{errors.name}</p>
                                )}
                            </div>
                            <div className="form-group">
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    onBlur={handleBlur}
                                    placeholder="name@example.com"
                                    value={values.email}
                                    onChange={handleChange("email")}
                                />
                                {errors.email && touched.email && (
                                    <p>{errors.email}</p>
                                )}
                            </div>
                            <div className="form-group">
                                <input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    onBlur={handleBlur}
                                    placeholder="Şifre"
                                    value={values.password}
                                    onChange={handleChange("password")}
                                />
                                {errors.password && touched.password && (
                                    <p>{errors.password}</p>
                                )}
                            </div>
                            <div className="form-group">
                                <input
                                    type="password"
                                    className="form-control"
                                    name="password_confirmation"
                                    onBlur={handleBlur}
                                    placeholder="Şifre Tekrarı"
                                    value={values.password_confirmation}
                                    onChange={handleChange(
                                        "password_confirmation"
                                    )}
                                />
                                {errors.password_confirmation &&
                                    touched.password_confirmation && (
                                        <p>{errors.password_confirmation}</p>
                                    )}
                            </div>

                            <button
                                disabled={!isValid || isSubmitting}
                                onClick={handleSubmit}
                                className="w-100 btn btn-lg btn-primary"
                                type="submit"
                            >
                                Kayıt Ol
                            </button>
                        </div>
                    )}
                </Formik>
                <Link className="mt-3" to="/login" style={{ display: "block" }}>
                    Giriş Yap
                </Link>
                <p className="mt-5 mb-3 text-muted">&copy; 2017–2021</p>
            </div>
        </div>
    );
}
export default inject("AuthStore")(observer(Register));
