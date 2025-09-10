import getCountries from "@/grandus-utils/fetches/ssr/Countries";
import getTowns from "@/grandus-utils/fetches/ssr/Towns";
import { initTranslations } from "@/app/i18n";
import SEO from "@/utils/seo";
import CartLayout from "@/modules/cart/components/layout/CartLayout";
import PassengersForm from '@/modules/cart/components/PassengersForm';
import getCart from '@/grandus-utils/fetches/ssr/Cart';
import { getCookieValue } from '@/utils/cookie';
import { CART_CONTACT_CONSTANT } from '@/grandus-lib/constants/SessionConstants';

export async function generateMetadata({params}) {
  const {t} = await initTranslations(params?.locale);

  return SEO.getDefaultMetaObject(
      t('Passengers information'),
      '',
  );
}

export default async function CartContact(props) {
  const [countries, towns, cart, contact] = await Promise.all([
    getCountries(),
    getTowns(),
    getCart(),
    getCookieValue(CART_CONTACT_CONSTANT),
  ]);

  return (
    <CartLayout>
      <PassengersForm
        countries={countries}
        towns={towns}
        contact={contact}
        passengersData={cart?.jsonData?.passengers || {}}
      />
    </CartLayout>
  );
}
