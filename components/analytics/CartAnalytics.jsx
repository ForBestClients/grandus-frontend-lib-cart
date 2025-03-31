"use client"
import {useEffect, useState} from "react";
import TagManager from "grandus-lib/utils/gtag";
import FBPixel from "grandus-lib/utils/fbpixel";
import useCart from "grandus-lib/hooks/useCart";
import useUser from "grandus-lib/hooks/useUser";
import EnhancedEcommerce from "grandus-lib/utils/ecommerce";

const gaEventToMetaPixelMap = {
  'begin_checkout': 'initiateCheckout',
}

const CartAnalytics = ({ type = 'view_cart'}) => {
  const { cart } = useCart();
  const { user, isLoading: userIsLoading } = useUser()
  const [cartWasTracked, setCartWasTracked] = useState(false);

  useEffect(() => {
    if (cart !== null && !userIsLoading && !cartWasTracked) {
      TagManager.push(EnhancedEcommerce?.[type]?.(cart));

      const metaPixelEvent = gaEventToMetaPixelMap?.[type] ?? null;
      if (metaPixelEvent) {
        FBPixel?.[metaPixelEvent](cart);
      }
      setCartWasTracked(true)
    }
  }, [cart, userIsLoading, cartWasTracked, user]);

  return <></>;
}

export default CartAnalytics;
