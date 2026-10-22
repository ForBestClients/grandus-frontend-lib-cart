'use client';

import useCart from 'grandus-lib/hooks/useCart';
import isEmpty from "lodash/isEmpty";
import map from "lodash/map";
import ShippingAndPaymentSkeleton from "@/modules/cart/components/skeletons/ShippingAndPaymentSkeleton";
import {useTranslation} from "@/app/i18n/client";
import styles from "./ShippingSelect.module.scss"
import ShippingItem from "@/modules/cart/components/delivery/ShippingItem";
import {groupBy, pickBy} from "lodash";
import ShippingItemGroup from "@/modules/cart/components/delivery/ShippingItemGroup";
import { PACKETERY_TYPE } from "@/grandus-lib/components/v2/delivery/provider";

const ShippingSelect = ({ countries, selected, selectedGroup, handleChange, handleGroupChange }) => {
  const { cart, isLoading } = useCart();
  const { t } = useTranslation();

  if (isEmpty(cart) && isLoading) {
    return <ShippingAndPaymentSkeleton />;
  }

  const deliveries = cart?.deliveryOptions

  // Packeta deliveries (serviceProviderType === 1) are always rendered as individual
  // ShippingItem (never grouped) so the pickup-point widget shows up via DeliveryProvider.
  const deliveryOptionsGrouped = groupBy(deliveries, (item) => {
    if (item?.serviceProviderType === PACKETERY_TYPE) return "nogroup";
    return item.group ? item.group : "nogroup";
  });
  const nogroup = deliveryOptionsGrouped["nogroup"];
  const groups = pickBy(
      deliveryOptionsGrouped,
      (value, key) => key !== "nogroup"
  );

  return (
      <div className={styles.shipping}>
        <h2 id="cart-delivery-title" className="mb-4 text-lg font-medium leading-snug text-ink md:text-xl">
          {t('cart_form.delivery.title')}
        </h2>
        {
          isEmpty(nogroup) && isEmpty(groups)
              ? <p className="mb-0 text-ink-muted">{t('delivery_select.empty')}</p>
              : (<div className="flex flex-col gap-3" role="radiogroup" aria-labelledby="cart-delivery-title">
                    {map(nogroup, (delivery, i) => {
                      return <ShippingItem key={`delivery-item-${i}`} delivery={delivery} countries={countries} selected={selected?.id === delivery.id} handleChange={handleChange} />
                    })}

                    {map(groups, (delivery, groupName) => {
                      return <ShippingItemGroup
                          key={`delivery-item-${delivery?.id}`}
                          group={delivery}
                          countries={countries}
                          selectedDelivery={selected}
                          selectedGroup={selectedGroup === groupName}
                          groupName={groupName}
                          handleGroupChange={handleGroupChange}
                          handleChange={handleChange}
                      />
                    })}
                  </div>
              )
        }
      </div>
  )
}

export default ShippingSelect;
