import React from "react";
import NavBar_Desktop from "../molecules/NavBar_Desktop";
import NavBar_Mobile from "../molecules/NavBar_Mobile";

const Navbar: React.FC = () => {
    return (
        <div>
            <NavBar_Desktop />
            <NavBar_Mobile />
        </div>
    );
};

export default Navbar;
