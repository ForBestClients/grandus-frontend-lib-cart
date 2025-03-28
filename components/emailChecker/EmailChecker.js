"use client"
import { useRef } from 'react';
import isEmpty from 'lodash/isEmpty';
import useUser from 'grandus-lib/hooks/useUser';
import EmailCheckInput from 'components/_other/form/EmailCheckInput';
import SocialLogin from '@/modules/user/components/auth/SocialLogin';;
import LoginForm from '@/components/forms/login/LoginForm';
import styles from './EmailChecker.module.scss';
import {useTranslation} from "@/app/i18n/client";
import Button from "@/components/_other/button/Button";

const EmailChecker = ({
    email,
    handleChange = null,
    handleBlur = null,
    emailExists,
    afterLoginCallback,
    setEmailExists,
    error = null,
    inputClassName = '',
  }) => {
  const { t } = useTranslation();
  const { user } = useUser();
  const emailCheckerInputRef = useRef();

  if (!isEmpty(user)) {
    return null;
  }

  const handleEmailCheck = (emailExists, email) => {
    setEmailExists(emailExists);
  };

  const handleEmailChange = (e) => {
    setEmailExists(null);
  };

  return (
    <div className={styles?.cartLogin}>
      <div className='row'>
        <div className='w-full mt-md-0'>
          {!emailExists ? (
            <>
              <EmailCheckInput
                required
                label={t('contact_form.email.label')}
                error={error}
                handleEmailChange={handleEmailCheck}
                successText={emailExists ? statusTexts?.found : null}
                inputProps={{
                  ref: emailCheckerInputRef,
                  id: 'email',
                  name: 'email',
                  type: 'email',
                  onChange: handleChange,
                  onBlur: handleBlur,
                  value: email,
                  placeholder: t('contact_form.email.placeholder'),
                  groupClassName: 'mt-0 mb-3',
                  autoComplete: 'email',
                  className: inputClassName,
                }}
              />
            </>
          ) : null}
          {emailExists ? (
              <>
                  <LoginForm
                      email={email}
                      afterLoginCallback={afterLoginCallback}
                      showRegister={false}
                      inputClassName={inputClassName}
                      layout={'block'}
                  />
                  <div className={'text-center'}>
                      <Button type="ghost" fullWidth onClick={() => handleEmailChange()}>
                          {t('contact_form.use_different_email')}
                      </Button>
                  </div>
              </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default EmailChecker;
