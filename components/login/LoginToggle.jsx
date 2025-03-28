import LoginForm from "@/components/forms/login/LoginForm";
import {useState} from "react";

const LoginToggle = ({ children }) => {
    const [toggle, setToggle] = useState(false);
    const handleToggleButton = () => {
        setToggle(!toggle);
    };

    return (
        <>
            <div onClick={handleToggleButton}>{children}</div>
            <div className={toggle ? 'block' : 'hidden'}>
                <LoginForm />
            </div>
        </>
    );
}

export default LoginToggle;
