'use client';
import Button from '@/components/_other/button/Button';
import IconButton from '@/components/_other/button/IconButton';
import { CartStroke, CloseStroke } from '@/components/_other/icons/StrokeIcons';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { CART_STEPS } from '@/constants/AppConstants';
import { useTranslation } from '@/app/i18n/client';
import MiniCartItems from '@/modules/cart/components/minicart/MiniCartItems';
import Services from '@/modules/cart/components/Services';
import { createPortal } from 'react-dom';
import CartMessages from '@/modules/cart/components/messages/CartMessages';
import useCart from '@/grandus-lib/hooks/useCart';
import { formatter } from '@/utils/price';
import isEmpty from 'lodash/isEmpty';
import reject from 'lodash/reject';
import some from 'lodash/some';
import { isCartServiceItem } from '@/modules/cart/components/ui/cartServices';
import { getCartProductsTotal } from '@/modules/cart/components/ui/cartTotals';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Mini cart: right drawer from sm, bottom sheet on phones. Opens on the
// document CustomEvent 'miniCartOpen' (header cart button, add to cart).
export const MiniCart = () => {
  const { t } = useTranslation();
  const { cart } = useCart();
  const pathname = usePathname();
  const [isEnabled, setIsEnabled] = useState(false);
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const drawerElement = document.getElementById('mini-cart-drawer');
    if (!drawerElement) {
      let element = document.createElement('div');
      element.id = 'mini-cart-drawer';
      document.body.appendChild(element);
    }
  }, []);

  useEffect(() => {
    if (isEnabled) {
      document.body.classList.add('noScroll');
    } else {
      document.body.classList.remove('noScroll');
    }
  }, [isEnabled]);

  const handleClose = useCallback(() => {
    setIsEnabled(false);
  }, []);

  const onMiniCartOpen = () => {
    setIsEnabled(true);
  };

  useEffect(() => {
    document.addEventListener('miniCartOpen', onMiniCartOpen);

    return () => {
      document.removeEventListener('miniCartOpen', onMiniCartOpen);
    };
  });

  // close after a navigation (e.g. "Do košíka", a product link)
  useEffect(() => {
    setIsEnabled(false);
  }, [pathname]);

  // focus into the panel, Escape closes, Tab stays inside, focus returns on close
  useEffect(() => {
    if (!isEnabled) {
      return undefined;
    }

    const previouslyFocused = document.activeElement;
    const frame = requestAnimationFrame(() => closeButtonRef.current?.focus());

    const onKeyDown = e => {
      if (e.key === 'Escape') {
        handleClose();
        return;
      }

      if (e.key !== 'Tab' || !panelRef.current) {
        return;
      }

      const focusable = Array.from(panelRef.current.querySelectorAll(FOCUSABLE)).filter(
        el => el.offsetParent !== null,
      );
      if (!focusable.length) {
        return;
      }

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];

      if (!panelRef.current.contains(document.activeElement)) {
        // focus got lost (e.g. with a removed row): continue inside the panel
        e.preventDefault();
        (e.shiftKey ? lastElement : firstElement).focus();
      } else if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    // removing an item also removes its focused ✕ button: keep focus in the dialog
    const observer =
      typeof MutationObserver !== 'undefined' && panelRef.current
        ? new MutationObserver(() => {
            if (panelRef.current && !panelRef.current.contains(document.activeElement)) {
              panelRef.current.focus();
            }
          })
        : null;
    observer?.observe(panelRef.current, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      document.removeEventListener('keydown', onKeyDown);
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
    };
  }, [isEnabled, handleClose]);

  if (!isEnabled) {
    return '';
  }

  const items = reject(cart?.items, isCartServiceItem);
  const productsTotal = getCartProductsTotal(cart);
  // gift wrap etc. only with products; a service left alone in the cart stays
  // listed so it can be unticked
  const showServices = !isEmpty(items) || some(cart?.items, isCartServiceItem);

  return createPortal(
    <div className="fixed inset-0 z-[100]">
      <div
        aria-hidden="true"
        onClick={handleClose}
        className="absolute inset-0 bg-petrol/60 backdrop-blur-[2px] animate-in fade-in-0 duration-300 motion-reduce:animate-none"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mini-cart-title"
        tabIndex={-1}
        className="absolute inset-x-0 bottom-0 flex outline-none max-h-[90dvh] flex-col overflow-hidden rounded-t-panel bg-white shadow-[0_-20px_60px_rgba(11,59,58,0.25)] animate-in slide-in-from-bottom duration-300 motion-reduce:animate-none sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[480px] sm:max-w-full sm:rounded-none sm:rounded-l-panel sm:shadow-[-20px_0_60px_rgba(11,59,58,0.25)] sm:slide-in-from-bottom-0 sm:slide-in-from-right"
      >
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-soft text-brand-deep">
              <CartStroke className="size-5" />
            </span>
            <h2 id="mini-cart-title" className="mb-0 truncate text-lg font-medium leading-snug text-ink md:text-xl">
              {t('cart.your_cart')}
            </h2>
          </div>
          <IconButton
            ref={closeButtonRef}
            variant="soft"
            size="md"
            label={t('cart.close_panel')}
            onClick={handleClose}
          >
            <CloseStroke className="size-5" />
          </IconButton>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 sm:px-6">
          <CartMessages className="pt-4" />
          <MiniCartItems />
          {showServices ? <Services compact /> : null}
        </div>

        <div className="shrink-0 border-t border-line px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 sm:px-6 sm:pb-6">
          {!isEmpty(items) ? (
            <>
              <div className="mb-4 flex items-center justify-between gap-4">
                <span className="text-[15px] text-ink">{t('cart_summary_items.totalProducts')}</span>
                <span className="whitespace-nowrap text-lg font-bold text-price tabular-nums">
                  {formatter.format(productsTotal)}
                </span>
              </div>
              <Button
                fullWidth
                htmlType={'a'}
                href={CART_STEPS[0]}
                size="medium"
                onClick={handleClose}
              >
                {t('cart.proceed_to_cart')}
                <CartStroke className="size-5" />
              </Button>

              <button
                type="button"
                onClick={handleClose}
                className="mt-3 w-full py-1 text-center text-sm text-ink underline-offset-4 transition-colors hover:text-brand-deep hover:underline"
              >
                {t('cart.close')}
              </button>
            </>
          ) : (
            // empty cart: one way back to the shop instead of the empty /kosik
            <Button
              fullWidth
              htmlType={'a'}
              href={'/kategoria/sviecky'}
              size="medium"
              onClick={handleClose}
            >
              {t('ui.cart.continueShopping')}
            </Button>
          )}
        </div>
      </div>
    </div>,
    document.getElementById('mini-cart-drawer'),
  );
};
