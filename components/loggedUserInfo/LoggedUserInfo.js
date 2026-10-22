"use client"
import isEmpty from 'lodash/isEmpty';
import upperFirst from 'lodash/upperFirst';

import useUser from 'grandus-lib/hooks/useUser';
import Box from "@/components/_other/box/Box";
import {useTranslation} from "@/app/i18n/client";


const LoggedUserInfoContent = ({ user }) => {
  const { t } = useTranslation();

  return <>
    {upperFirst(
      t('contact_form.cart_user_info', {
        fullname: `${user?.attributes?.name || ''} ${
          user?.attributes?.surname || ''
        }`,
        email: user?.attributes?.email,
      }),
    )}
  </>;
};

const LoggedUserInfo = ({ isSimple = false }) => {
  const { user } = useUser();

  if (isEmpty(user)) {
    return null;
  }

  if (isSimple) {
    return (
      <p className="mb-0 text-sm leading-relaxed text-ink">
        <LoggedUserInfoContent user={user} />
      </p>
    );
  }

  return (
    <Box className={'!border-brand-soft !bg-brand-soft font-medium text-brand-deep'}>
      <LoggedUserInfoContent user={user} />
    </Box>
  );
};

export default LoggedUserInfo;
