'use client';

import useCart from "grandus-lib/hooks/useCart";
import isEmpty from "lodash/isEmpty";
import map from "lodash/map";
import ShippingAndPaymentSkeleton from "@/modules/cart/components/skeletons/ShippingAndPaymentSkeleton";
import {useTranslation} from "@/app/i18n/client";
import styles from "./ShippingSelect.module.scss"
import ShippingItem from "@/modules/cart/components/delivery/ShippingItem";
import {groupBy, pickBy} from "lodash";
import ShippingItemGroup from "@/modules/cart/components/delivery/ShippingItemGroup";

const ShippingSelect = ({ countries, selected, selectedGroup, handleChange, handleGroupChange }) => {
  const { cart, isLoading } = useCart();
  const { t } = useTranslation();

  if (isEmpty(cart) && isLoading) {
    return <ShippingAndPaymentSkeleton />;
  }

  const deliveries = cart?.deliveryOptions

  const deliveryOptionsGrouped = groupBy(deliveries, (item) => {
    return item.group ? item.group : "nogroup";
  });
  const nogroup = deliveryOptionsGrouped["nogroup"];
  const groups = pickBy(
      deliveryOptionsGrouped,
      (value, key) => key !== "nogroup"
  );

  return (
    <div className={styles.shipping}>
      <h3 className="text-lg mb-3">
        {t('cart_form.delivery.title')}
      </h3>
      {
        isEmpty(nogroup) && isEmpty(groups)
          ? <p>{t('delivery_select.empty')}</p>
          : (<>
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
            </>
          )
      }
    </div>
  )
}

export default ShippingSelect;
