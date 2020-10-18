import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import Layout from '../core/Layout';
import { signin, authenticate, isAuthenticated } from '../auth/index';

const Signin = () => {
    const [values, setValues] = useState({
        email: 'admin01@gmail.com',
        password: 'ccccssss345',
        error: '',
        loading: false,
        redirectToReferrer: false
    });

    const { email, password, loading, error, redirectToReferrer } = values;
    const { user } = isAuthenticated();

    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value })
    }

    const clickSubmit = (event) => {
        event.preventDefault();
        setValues({ ...values, error: false, loading: true });
        signin({ email, password })
            .then(data => {
                if (data.error) {
                    setValues({ ...values, error: data.error, loading: false })
                }
                else {
                    authenticate(
                        data, () => {
                            setValues({
                                ...values,
                                redirectToReferrer: true
                            });
                        }
                    )
                }
            })
    }

    const signUpForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Email : </label>
                <input
                    placeholder="Please Enter Email Address "
                    onChange={handleChange('email')}
                    type="email"
                    className="form-control"
                    value={email}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Password : </label>
                <input
                    placeholder="Please Enter Password"
                    onChange={handleChange('password')}
                    type="password"
                    className="form-control"
                    value={password}
                />
            </div>
            <button onClick={clickSubmit} className="btn btn-success">Submit</button>
        </form>
    );

    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    )
    const showLoading = () => (
        loading && (<div className="alert alert-info">
            <h2>Loading...</h2>
        </div>)
    );

    const redirectUser = () => {
        if (redirectToReferrer) {
            if (user && user.role === 1) {
                return <Redirect to="/admin/dashboard" />
            }
            else {
                return <Redirect to="/user/dashboard" />
            }
        }
        if (isAuthenticated()) {
            return <Redirect to="/" />
        }
    }


    return (
        <Layout
            title="Signin"
            description="Signup to Node React E-Commerce App "
            className="container col-md-8 offset-md-2" >
            {showLoading()}
            {showError()}
            {signUpForm()}
            {redirectUser()}
            {/* {JSON.stringify(values)} */}
        </Layout>
    )
}

export default Signin;