'use client';

import Box from "@/components/_other/box/Box";
import CartForm from "@/modules/cart/components/CartForm";
import CartSummary from "@/modules/cart/components/CartSummary";
import {useRef, useState} from "react";
import StickyBox from "react-sticky-box";

const CartPage = ({products, countries, towns, contact, webInstance}) => {
  const contactFormRef = useRef(null);
  const [deliveryStartFrom, setDeliveryStartFrom] = useState('');

  return <div className="container">
    <div className="grid grid-cols-12 gap-6">
      <div className="col col-span-12 md:col-span-7">
        <Box>
          <CartForm
            products={products}
            countries={countries}
            tows={towns}
            contact={contact}
            contactFormRef={contactFormRef}
            setDeliveryStartFrom={setDeliveryStartFrom}
            deliveryStartFrom={deliveryStartFrom}
          />
        </Box>
      </div>

      <div className="col col-span-12 md:col-span-5">
        <StickyBox offsetTop={15}>
          <CartSummary webInstance={webInstance} contactFormRef={contactFormRef} deliveryStartFrom={deliveryStartFrom}/>
        </StickyBox>
      </div>
    </div>
  </div>
}

export default CartPage;
