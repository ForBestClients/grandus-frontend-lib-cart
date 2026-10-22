'use client';

import Box from "@/components/_other/box/Box";
import {useTranslation} from "@/app/i18n/client";

const EmptyState = () => {
  const {t} = useTranslation()

  return (
    <Box className="!py-10 text-center md:!py-12">
      <h1 className="mb-0 text-2xl font-medium leading-tight text-ink md:text-3xl">
        {t('order.empty_state.title')}
      </h1>
    </Box>
  );
};

export default EmptyState;
