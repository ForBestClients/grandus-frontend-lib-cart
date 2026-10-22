import getCountries from "@/grandus-utils/fetches/ssr/Countries";
import getTowns from "@/grandus-utils/fetches/ssr/Towns";
import {getCookieValue} from "@/utils/cookie";
import {CART_CONTACT_CONSTANT} from "@/grandus-lib/constants/SessionConstants";
import { initTranslations } from "@/app/i18n";
import { buildSystemMetadata } from "@/utils/metadata";
import ContactForm from '@/modules/cart/components/ContactForm';
import CartLayout from "@/modules/cart/components/layout/CartLayout";

export async function generateMetadata() {
  const {t} = await initTranslations();

  return buildSystemMetadata({ title: t('seo.checkout_contact'), follow: false });
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
