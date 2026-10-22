"use client"
import { useEffect, useState } from 'react';
import CartSummary from '@/modules/cart/components/summary/CartSummary';
import { CheckoutButton } from '@/modules/cart/components/CheckoutButton';
import StickyBox from 'react-sticky-box';
import { useCartStep } from '@/utils/cart';

const GAP = 16;
const FALLBACK_OFFSET = 150;

// The site header is sticky (top-0), so the sticky summary starts below it.
const useStickyOffset = () => {
  const [offset, setOffset] = useState(FALLBACK_OFFSET);

  useEffect(() => {
    const header =
      document.getElementById('site-header') ?? document.querySelector('header');

    if (!header) {
      return undefined;
    }

    const update = () => setOffset(Math.round(header.getBoundingClientRect().height) + GAP);
    update();

    if (typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const observer = new ResizeObserver(update);
    observer.observe(header);

    return () => observer.disconnect();
  }, []);

  return offset;
};

export const CartSummarySection = ({ setIsProcessing, contact }) => {
  const step = useCartStep();
  const offsetTop = useStickyOffset();

  return (
      <StickyBox offsetTop={offsetTop} offsetBottom={GAP}>
        <CartSummary isFirstStep={step===0} />
        <CheckoutButton step={step} setIsProcessing={setIsProcessing} contact={contact} />
      </StickyBox>
  );
};
