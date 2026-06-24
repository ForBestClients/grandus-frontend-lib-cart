'use client';

import useSWR from 'swr';
import isEmpty from 'lodash/isEmpty';
import ProductList from '@/modules/cart/components/ProductList';
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

  return (
    <div className={compact ? 'pt-4 mt-2 border-t' : ''}>
      <h3 className={compact ? 'text-base mb-0' : ''}>{t('cart_services.title')}</h3>
      <ProductList products={products} />
    </div>
  );
};

export default Services;
