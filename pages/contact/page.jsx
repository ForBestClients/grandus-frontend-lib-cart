import getCountries from "@/grandus-utils/fetches/ssr/Countries";
import getTowns from "@/grandus-utils/fetches/ssr/Towns";
import {getCookieValue} from "@/utils/cookie";
import {CART_CONTACT_CONSTANT} from "@/grandus-lib/constants/SessionConstants";
import { initTranslations } from "@/app/i18n";
import SEO from "@/utils/seo";
import ContactForm from '@/modules/cart/components/ContactForm';
import CartLayout from "@/modules/cart/components/CartLayout";

export async function generateMetadata({params}) {
  const {t} = await initTranslations(params?.locale);

  return SEO.getDefaultMetaObject(
      t('Kontaktné informácie'),
      '',
  );
}

export default async function CartContact(props) {
  const [countries, towns, contact] = await Promise.all([
    getCountries(),
    getTowns(),
    getCookieValue(CART_CONTACT_CONSTANT),
  ]);

  return (
    <CartLayout>
      <ContactForm
        countries={countries}
        towns={towns}
        contact={contact}
      />
    </CartLayout>
  );
}
