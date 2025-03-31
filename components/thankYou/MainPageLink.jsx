'use client';

import Link from "next/link";
import {useTranslation} from "@/app/i18n/client";

const MainPageLink = ({}) => {
  const {t} = useTranslation();

  return (<>
    <Link href={'/'}>
      {t('main_page_link.back')}
    </Link>
  </>);
}

export default MainPageLink;
