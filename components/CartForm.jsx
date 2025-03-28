'use client';

import ProductList from "@/modules/cart/components/ProductList";
import SubscriptionFromForm from "@/modules/cart/components/SubscriptionFromForm";
import PaymentSelect from "@/modules/cart/components/PaymentSelect";
import ContactForm from "@/modules/cart/components/ContactForm";
import DiscountForm from "@/modules/cart/components/DiscountForm";
import {useTranslation} from "@/app/i18n/client";

const CartForm = ({products, countries, towns, contact, contactFormRef, setDeliveryStartFrom, deliveryStartFrom}) => {
  const {t} = useTranslation();


  return (<>
    <h3>{t('cart_form.order.title')}</h3>
    <ProductList products={products}/>

    <div className="separator h-[25px] mt-4"></div>

    <div className="flex flex-wrap flex-col md:flex-row">
      <div className="flex-grow">
        <h3>{t('cart_form.subscription.title')}</h3>
      </div>
      <div className={'flex-grow md:flex-grow-0 mt-2 md:mt-0'}>
        <SubscriptionFromForm
          setDeliveryStartFrom={setDeliveryStartFrom}
          deliveryStartFrom={deliveryStartFrom}
        />
      </div>
    </div>

    <div className="separator h-[25px] mt-4"></div>

    <h3>{t('cart_form.discount.title')}</h3>

    <DiscountForm/>

    <div className="separator h-[25px] mt-4"></div>

    <h3>{t('cart_form.payment.title')}</h3>

    <PaymentSelect/>

    <div className="separator h-[25px] mt-4"></div>

    <h3>{t('cart_form.invoice.title')}</h3>

    <ContactForm
      countries={countries}
      towns={towns}
      contact={contact}
      contactFormRef={contactFormRef}
    />
  </>);
}

export default CartForm;
