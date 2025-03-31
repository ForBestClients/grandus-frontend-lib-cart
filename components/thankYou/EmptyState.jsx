'use client';

import Box from "@/components/_other/box/Box";
import {useTranslation} from "@/app/i18n/client";

const EmptyState = () => {
  const {t} = useTranslation()

  return (
    <>
      <Box className="text-center">
        <h1>{t('order.empty_state.title')}</h1>
      </Box>
    </>
  );
};

export default EmptyState;
