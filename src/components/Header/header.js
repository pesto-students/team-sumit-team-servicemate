import React, { useEffect } from 'react';
import "./styles/header.scss"
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from "react-router-dom";
import useCityLocation from '../../hooks/Location';
import { IconButton } from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import restClient from '../../config/axios';
import { setAllCategories, } from '../../scenes/Categories/actions';
import { useDispatch, useSelector } from 'react-redux';
import { setLogoutUser } from './actions';
import { useAlert } from '../../hooks/NotificationSnackbar';

const Header = () => {
    const navigate = useNavigate()
    const { currentLocation, setLocation, getPermission } = useCityLocation()
    const dispatch = useDispatch()
    const { allCategories = [] } = useSelector(state => state.categories)
    const loggedInUser = useSelector(state => state.user.authUser)
    const { showSuccessAlert } = useAlert()

    useEffect(() => {
        getAllCategories()
    }, [])

    const getAllCategories = async () => {
        const apiUrl = 'api/vendor/categories'
        const { data } = await restClient(apiUrl)
        const categories = [{ name: 'All', value: 'all' }, ...data]
        dispatch(setAllCategories(categories))
    }

    const userActions = [{ name: "Login", handleAction: () => handleAction("/login") }, { name: "Register", handleAction: () => handleAction('/register') }]

    const handleAction = (path, callback) => {
        navigate(path)
        callback && callback()
    }

    const handleLogout = () => {
        dispatch(setLogoutUser())
        showSuccessAlert("You have been logged out")
    }

    const AuthUserAction = [{ name: "My Profile", handleAction: () => handleAction("/dashboard2/profile",) },
    { name: "Appointments", handleAction: () => handleAction("/dashboard2/appointments") }, { name: "Logout", handleAction: () => handleAction("/", handleLogout) }]

    const getUserActions = () => {
        return loggedInUser ? AuthUserAction : userActions
    }

    return (
        <header className='header'>
            <section className="header__top">
                <section className='header-wrapper'>
                    <section className='header__left flex-1'>
                        <section style={{
                            fontWeight: '900',
                            fontSize: '1.2rem',
                            cursor: "pointer",
                        }} onClick={() => { navigate('/') }}>
                            <span style={{ color: 'black' }}>service</span><span style={{ color: 'white' }}>mate</span>
                        </section>
                    </section>
                    <section className='header__center flex-1'>
                        <section className='quick-search-wrapper flex'>
                            <section>
                                <select className='select-category'>
                                    {allCategories.map(option => (
                                        <option key={option.id} value={option.value} >{option.name}</option>
                                    ))}
                                </select>
                            </section>
                            <section>
                                <input className='search-input' name='quick-search' placeholder="I'm looking for..."></input>
                            </section>
                            <section>
                                <button className='black-button' >Search</button>
                            </section>
                        </section>
                    </section>
                    <section className='header__right'>
                        <section className='flex'>
                            <section>
                                <PersonIcon sx={{ height: 50, width: 50 }}></PersonIcon>
                            </section>
                            <section>
                                {getUserActions().map(action => (
                                    <section className='user-action cursor-pointer font-bold' key={"path-" + action.name} onClick={() => {
                                        console.log("action--->", action)
                                        action.handleAction && action.handleAction()
                                    }}>
                                        {action.name}
                                    </section>
                                ))}
                            </section>
                        </section>
                    </section>
                </section>
            </section>
            <section className='header-navigation pt-4 pb-4'>
                <ul className='menu'>
                    <li className='menu-item' onClick={() => { navigate('/services') }}>Services</li>
                    <li className='menu-item' onClick={() => { navigate('/about') }}>About Us</li>
                    <li className='menu-item' onClick={() => { navigate('/contact') }}>Contact Us</li>
                    <li>
                        <section className='get-location'>
                            <select className='location-select p-0.5' value={currentLocation} onChange={(e) => setLocation(e.target.value)}>
                                {[{ name: "Bengaluru" }, { name: "Mumbai" }, { name: "Delhi" }, { name: "Hyderabad" }].map(city => (
                                    <option key={city.name} value={city.name}>{city.name}</option>
                                ))}
                            </select>
                            <IconButton onClick={() => getPermission()}><MyLocationIcon /></IconButton>
                        </section>
                    </li>
                </ul>
            </section>
        </header>
    );
};

export default Header;