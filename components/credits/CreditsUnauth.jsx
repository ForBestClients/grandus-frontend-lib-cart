'use client';

import styles from '@/modules/cart/components/credits/CreditsUnauth.module.scss';
import Button from '@/components/_other/button/Button';
import LoginForm from '@/components/forms/login/LoginForm';
import { useState } from 'react';
import { useTranslation } from '@/app/i18n/client';

const CreditsUnauth = () => {
  const { t } = useTranslation();
  const [loginToggle, setLoginToggle] = useState(false);

  const handleLoginToggleButton = () => {
    setLoginToggle(!loginToggle);
  };

  return (
    <>
      <div className={styles.login}>
        {t('credits_form.unauth.title')}
        <div className={styles.button}>
          <Button type="ghost" onClick={handleLoginToggleButton}>{t('credits_form.unauth.button')}</Button>
        </div>
      </div>
      <div className={loginToggle ? 'block' : 'hidden'}>
        <LoginForm />
      </div>
    </>
  );
};

export default CreditsUnauth;
