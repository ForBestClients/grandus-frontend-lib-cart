'use client';

import useUser from 'grandus-lib/hooks/useUser';
import useWebInstance from 'grandus-lib/hooks/useWebInstance';

import toNumber from 'lodash/toNumber';

import Box from "@/components/_other/box/Box";
import CreditsUnauth from "@/modules/cart/components/credits/CreditsUnauth";
import CreditsForm from "@/modules/cart/components/credits/CreditsForm";
import {useTranslation} from "@/app/i18n/client";



const Credits = () => {
  const { user } = useUser();
  const { settings } = useWebInstance();
  const { t } = useTranslation();


  if (!toNumber(settings?.credits_allow_user)) {
    return null;
  }

  return (
    <Box className="mt-4">
      <p className="mb-1 text-[15px] font-semibold leading-snug text-ink">
        {settings?.credits_name ? `${settings?.credits_name}: ` : ''}
        {t('credits_form.title')}
      </p>
      { user ? <CreditsForm /> : <CreditsUnauth /> }
    </Box>
  );
};

export default Credits;
