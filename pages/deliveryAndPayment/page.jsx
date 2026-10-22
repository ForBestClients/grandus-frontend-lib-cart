import getCountries from '@/grandus-utils/fetches/ssr/Countries';
import { buildSystemMetadata } from '@/utils/metadata';
import { initTranslations } from '@/app/i18n';
import CartLayout from "@/modules/cart/components/layout/CartLayout";
import DeliveryAndPaymentForm from '@/modules/cart/components/DeliveryAndPaymentForm';

export async function generateMetadata() {
  const { t } = await initTranslations();

  return buildSystemMetadata({ title: t('seo.checkout_delivery'), follow: false });
}

export default async function DeliveryAndPaymentPage(props) {
  const countries = await getCountries();

  return (
    <CartLayout>
      <DeliveryAndPaymentForm countries={countries} />
    </CartLayout>
  );
}
