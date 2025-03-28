import getCountries from '@/grandus-utils/fetches/ssr/Countries';
import SEO from '@/utils/seo';
import { initTranslations } from '@/app/i18n';
import CartLayout from '@/modules/cart/components/CartLayout';
import DeliveryAndPaymentForm from '@/modules/cart/components/DeliveryAndPaymentForm';

export async function generateMetadata({ params }) {
  const { t } = await initTranslations(params?.locale);

  return SEO.getDefaultMetaObject(t('Kontaktné informácie'), '');
}

export default async function DeliveryAndPaymentPage(props) {
  const countries = await getCountries();

  return (
    <CartLayout>
      <DeliveryAndPaymentForm countries={countries} />
    </CartLayout>
  );
}
