"use client"
import { useCartStep } from '@/utils/cart';
import {useTranslation} from "@/app/i18n/client";

const TitleContent= ()=> {
  const step = useCartStep()
  const {t} = useTranslation()
  switch (step) {
    case 0: return t('cart_title.step1.long');
    case 1: return t('cart_title.step2.long');
    case 2: return t('cart_title.step3.long');
    default: return ""
  }
}

const CartTitle = () => {
  return  <h1 className="mt-8"><TitleContent/></h1>
};
export  default CartTitle;
