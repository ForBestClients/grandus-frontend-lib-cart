'use client';

import Button from "@/components/_other/button/Button";
import {useTranslation} from "@/app/i18n/client";

const MainPageLink = ({}) => {
  const {t} = useTranslation();

  return (
    <Button type="primary" htmlType="a" href={'/'}>
      {t('order.thank_you.continue_shopping')}
    </Button>
  );
}

export default MainPageLink;
