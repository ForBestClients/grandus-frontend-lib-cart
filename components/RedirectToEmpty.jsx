"use client"
import useCart from '@/grandus-lib/hooks/useCart';
import { useRouter } from 'next/navigation';
import isEmpty  from 'lodash/isEmpty';

export const RedirectToEmpty = () => {
  const {cart, isLoading} = useCart()
  const router = useRouter()
  if (!isLoading && isEmpty(cart?.items)) {
    router.push("/prazdny_kosik")
  }
  return (
    <></>
  );
};
