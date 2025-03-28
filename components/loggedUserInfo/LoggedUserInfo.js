"use client"
import isEmpty from 'lodash/isEmpty';
import upperFirst from 'lodash/upperFirst';

import useUser from 'grandus-lib/hooks/useUser';
import Box from "@/components/content/Box";
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
    return <LoggedUserInfoContent user={user} />;
  }

  return (
    <Box className={'!bg-primary text-primary !bg-opacity-15 font-medium'}>
      <LoggedUserInfoContent user={user} />
    </Box>
  );
};

export default LoggedUserInfo;
