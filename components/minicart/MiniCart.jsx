import CartIcon from '@/components/_other/icons/CartIcon';
import Button from '@/components/_other/button/Button';
import CloseIcon from '@/components/_other/icons/CloseIcon';
import { useEffect, useState } from 'react';
import { CART_STEPS } from '@/constants/AppConstants';
import Divider from '@/components/_other/divider/Divider';
import { useTranslation } from '@/app/i18n/client';
import MiniCartItems from '@/modules/cart/components/minicart/MiniCartItems';
import { createPortal } from 'react-dom';

export const MiniCart = () => {
  const { t } = useTranslation();
  const [isEnabled, setIsEnabled] = useState(false);

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

  const handleClose = () => {
    setIsEnabled(false);
  }

  const onMiniCartOpen = () => {
    setIsEnabled(true);
  };

  useEffect(() => {
    document.addEventListener('miniCartOpen', onMiniCartOpen);

    return () => {
      document.removeEventListener('miniCartOpen', onMiniCartOpen);
    };
  });

  if (!isEnabled) {
    return '';
  }

  return createPortal(
    <div
      className={`fixed left-0 top-0 w-full h-full z-50 bg-grey/70 transition-all backdrop-blur-sm
      duration-500 pointer-events-none ${!isEnabled ? 'opacity-0' : 'opacity-1'}`}
    >
      <div
        className={`
      absolute
      bottom-0 w-full
      sm:right-0 sm:w-[600px] sm:h-full
      bg-white
      px-6 sm:px-6 pb-6 pt-6
      flex flex-col inset-y-0
      pointer-events-auto
      transition-all
      duration-1000
      ${
          isEnabled
            ? 'translate-0 translate-y-0'
            : 'sm:translate-x-full translate-y-full sm:translate-y-0'
        }
      `}
      >
        <div className="flex flex-row items-center justify-between mb-2">
          <h3 className={'grid grid-cols-8 gap-x-4 md:gap-x-8 items-center text-lg md:text-xl flex-wrap mb-0 mr-5'}>
            <CartIcon className={'h-6 md:h-8 w-auto flex-shrink-0'} />
            <span className="col-span-6 md:col-span-7">
              {t('cart.your_cart')}
            </span>
          </h3>
          <Button
            type="text"
            onClick={handleClose}
          >
            <CloseIcon className={'h-6 md:h-8 w-auto'} />
          </Button>
        </div>
        <Divider className="mt-2 mb-1" />
        <div className={'flex-1 overflow-y-auto py-0 px-4'}>
          <MiniCartItems />
        </div>
        <div className={'flex flex-col justify-end flex-shrink-0 w-full'}>
          <Divider />
          <Button
            fullWidth
            htmlType={'a'}
            href={CART_STEPS[0]}
            size="medium"
          >
            {t('cart.proceed_to_cart')}
            <CartIcon className="ml-3" />
          </Button>

          <button onClick={handleClose} className="mt-4 hover:underline text-base">
            {t('cart.close')}
          </button>
        </div>
      </div>
    </div>,
    document.getElementById('mini-cart-drawer'),
  );
};
