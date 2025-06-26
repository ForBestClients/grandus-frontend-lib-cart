import styles from "@/modules/cart/components/credits/CreditsUnauth.module.scss";
import Button from "@/components/_other/button/Button";
import LoginForm from "@/components/forms/login/LoginForm";
import {useState} from "react";

const CreditsUnauth = () => {

    const [loginToggle, setLoginToggle] = useState(false);

    const handleLoginToggleButton = () => {
        setLoginToggle(!loginToggle);
    };

    return (
        <>
            <div className={styles.login}>
                Pre uplatnenie a využívanie kreditov sa musíte prihlásiť do svojho
                konta.
                <div className={styles.button}>
                    <Button type="ghost" onClick={handleLoginToggleButton}>Prihlásiť sa</Button>
                </div>
            </div>
            <div className={loginToggle ? 'block' : 'hidden'}>
                <LoginForm />
            </div>
        </>
    )
}

export default CreditsUnauth;
