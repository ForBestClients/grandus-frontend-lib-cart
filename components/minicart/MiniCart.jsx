import CartIcon from '@/components/_other/icons/CartIcon';
import Button from '@/components/_other/button/Button';
import CustomButton from '@/components/_other/button/CustomButton';
import CloseIcon from '@/components/_other/icons/CloseIcon';
import { useEffect, useState } from 'react';
import { CART_STEPS } from '@/constants/AppConstants';
import Divider from '@/components/_other/divider/Divider';
import { useTranslation } from '@/app/i18n/client';
import MiniCartItems from '@/modules/cart/components/minicart/MiniCartItems';
import { createPortal } from 'react-dom';

export const MiniCart = ({ isOpen, handleClose }) => {
  const { t } = useTranslation();
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const drawerElement = document.getElementById('mini-cart-drawer');
    if (!drawerElement) {
      let element = document.createElement('div');
      element.id = 'mini-cart-drawer';
      document.body.appendChild(element);
    }
    setIsEnabled(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('noScroll');
    } else {
      document.body.classList.remove('noScroll');
    }
  }, [isOpen]);

  if (!isEnabled) {
    return '';
  }

  return createPortal(
      <div className={`fixed left-0 top-0 w-full h-full z-50 bg-grey/70 transition-all backdrop-blur-sm
      duration-500 pointer-events-none ${!isOpen ? 'opacity-0' : 'opacity-1'}`}>
        <div
          className={`
            absolute
            bottom-0 w-full h-fit
            sm:right-0 sm:w-[600px] sm:h-full
            bg-white
            px-6 sm:px-12 pb-6 pt-8
            flex flex-col
            overflow-auto
            pointer-events-auto
            transition-all
            duration-1000
            ${isOpen ? 'translate-0 translate-y-0' : 'sm:translate-x-full translate-y-full sm:translate-y-0'}
          `}
        >
          <span className={'absolute right-[50px] top-7 flex items-center justify-center'}>
            <Button type="text" onClick={handleClose}>
              <CloseIcon className={'h-6 text-grey/80 hover:text-font w-auto'} />
            </Button>
          </span>
          <div>
            <h2 className={'flex gap-8 items-center text-xl font-semibold'}>
              <CartIcon className={'h-8 w-auto'} />
              {t('cart.your_cart')}
            </h2>
            <Divider className="my-8" />
            <MiniCartItems />
          </div>
          <CustomButton type={'primary'} fullWidth  className="mt-6" htmlType={'a'} href={CART_STEPS[0]} icon={<CartIcon />}>
            {t('cart.proceed_to_cart')}
          </CustomButton>
        </div>
      </div>,
      document.getElementById('mini-cart-drawer'),
  );
};
