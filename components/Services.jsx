'use client';

import useSWR from 'swr';
import isEmpty from 'lodash/isEmpty';
import ProductList from '@/modules/cart/components/ProductList';
import Box from '@/components/_other/box/Box';
import { useTranslation } from '@/app/i18n/client';
import { CART_SERVICES_CATEGORY } from '@/constants/AppConstants';

// Doplnkové služby v košíku (napr. darčekové balenie). Sú to bežné produkty
// z kategórie `sluzby` – vykreslia sa ako zoznam checkboxov a pridávajú/odoberajú
// sa do košíka rovnako ako na rozhybto.sk. Viď ProductList pre logiku add/remove.
// `compact` = ľahší variant pre mini-košík (oddelený vrchnou čiarou).
const Services = ({ compact = false }) => {
  const { t } = useTranslation();

  const { data } = useSWR(
    `/api/lib/v1/products?category=${CART_SERVICES_CATEGORY}&fields=shortDescription&perPage=20`,
    url => fetch(url).then(r => r.json()),
    {
      revalidateOnReconnect: false,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  const products = data?.products ?? [];

  if (isEmpty(products)) {
    return null;
  }

  if (compact) {
    return (
      <section className="mt-1 border-t border-line pb-2 pt-4">
        <h3 className="mb-3 text-base font-medium leading-snug text-ink">
          {t('cart_services.title')}
        </h3>
        <ProductList products={products} compact />
      </section>
    );
  }

  // one card like the other cart blocks (brief 4.4)
  return (
    <Box>
      <section aria-labelledby="cart-services-title">
        <h2
          id="cart-services-title"
          className="mb-4 text-lg font-medium leading-snug text-ink md:text-xl"
        >
          {t('cart_services.title')}
        </h2>
        <ProductList products={products} />
      </section>
    </Box>
  );
};

export default Services;
