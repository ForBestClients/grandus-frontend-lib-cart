import styles from "@/modules/cart/components/credits/CreditsUnauth.module.scss";
import Button from "@/components/_other/button/Button";
import LoginForm from "@/components/forms/login/LoginForm";
import {useState} from "react";
import {useTranslation} from "@/app/i18n/client";

const CreditsUnauth = () => {
    const {t} = useTranslation();
    const [loginToggle, setLoginToggle] = useState(false);

    const handleLoginToggleButton = () => {
        setLoginToggle(!loginToggle);
    };

    return (
        <>
            <div className={styles.login}>
                <p className={styles.text}>{t('credits_form.login_required')}</p>
                <div className={styles.button}>
                    <Button
                        type="dark"
                        size="small"
                        onClick={handleLoginToggleButton}
                        aria-expanded={loginToggle}
                        aria-controls="credits-login-form"
                        className="w-full md:w-auto"
                    >
                        {t('credits_form.login')}
                    </Button>
                </div>
            </div>
            <div id="credits-login-form" className={loginToggle ? 'mt-5 block' : 'hidden'}>
                <LoginForm />
            </div>
        </>
    )
}

export default CreditsUnauth;
