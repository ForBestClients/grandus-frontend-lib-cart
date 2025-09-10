"use client"
import DiscountForm from '@/modules/cart/components/DiscountForm';
import CartSummary from '@/modules/cart/components/summary/CartSummary';
import { CheckoutButton } from '@/modules/cart/components/CheckoutButton';
import StickyBox from 'react-sticky-box';
import { useCartStep } from '@/utils/cart';

export const CartSummarySection = ({ setIsProcessing, passengersData }) => {
 const step= useCartStep()

  return (
      <StickyBox offsetTop={15} >
        <CartSummary isFirstStep={step===0} />
        <CheckoutButton step={step} setIsProcessing={setIsProcessing} passengersData={passengersData} />
      </StickyBox>
  );
};
