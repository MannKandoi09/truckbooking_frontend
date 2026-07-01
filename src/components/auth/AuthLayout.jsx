import React from "react";
import "../../styles/auth.css";

import logo from "../../assets/images/trucklogo.jpg";
import truckBg from "../../assets/images/truck-bg.jpg";
import truckSide from "../../assets/images/truck-side.jpg";

const AuthLayout = ({
    title,
    subtitle,
    children,
    footerText,
    footerLinkText,
    footerLink
}) => {

    return (
        <div
            className="auth-container"
            style={{
                backgroundImage: `url(${truckBg})`
            }}
        >
            {/* Overlay */}
            <div className="auth-overlay">

                {/* Logo */}
                <div className="auth-logo">

                    <img src={logo} alt="Logo" />

                    <div>
                        <h2>TRUCK</h2>
                        <p>MANAGEMENT SYSTEM</p>
                    </div>

                </div>

                {/* Left Text */}
                <div className="auth-left">

                    <h1>
                        Manage Your Fleet
                        <br />
                        with Ease
                    </h1>

                    <p>
                        Join Truck Management System and simplify
                        your transportation operations.
                    </p>

                </div>

                {/* Center Card */}
                <div className="auth-card">

                    <h1>{title}</h1>

                    <p className="subtitle">
                        {subtitle}
                    </p>

                    {children}

                    <div className="auth-footer">

                        {footerText}

                        <a href={footerLink}>
                            {footerLinkText}
                        </a>

                    </div>

                </div>

                {/* Right Truck */}
                <div className="truck-image">

                    <img
                        src={truckSide}
                        alt="Truck"
                    />

                </div>

                {/* Bottom Footer */}
                <div className="bottom-footer">

                    <span>
                        Secure
                    </span>

                    <span>
                        Reliable
                    </span>

                    <span>
                        Efficient
                    </span>

                </div>

            </div>

        </div>
    );
};

export default AuthLayout;