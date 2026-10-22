import CartListingItems from '@/modules/cart/components/CartListingItems';
import Services from '@/modules/cart/components/Services';
import Box from "@/components/_other/box/Box";
import DiscountForm from "@/modules/cart/components/DiscountForm";
import Credits from "@/modules/cart/components/credits/Credits";
import {Suspense} from "react";
import {CartSummarySection} from "@/modules/cart/components/CartSummarySection";
import CartLayout from "@/modules/cart/components/layout/CartLayout";
import { initTranslations } from "@/app/i18n";
import { buildSystemMetadata } from "@/utils/metadata";
import CartAnalytics from '@/app/components/cart/CartAnalytics';

export async function generateMetadata() {
    const {t} = await initTranslations();

    return buildSystemMetadata({ title: t('seo.cart') });
}

export default async function CartPage(props) {
  return (
    <>
      <CartAnalytics />
      <CartLayout>
          <div className="grid grid-cols-6 gap-6 pt-8">
              <div className="col col-span-full">
                  <Suspense>
                      <Box>
                        <CartListingItems/>
                      </Box>
                  </Suspense>
              </div>
              <div className="col col-span-full">
                  <Suspense>
                      <Services/>
                  </Suspense>
              </div>
              <div className="col col-span-full md:col-span-3 flex flex-col gap-6">
                  <DiscountForm/>
                  <Credits/>
              </div>
              <div className="col col-span-full md:col-span-3 flex flex-col gap-6">
                  <CartSummarySection setIsProcessing={false}/>
              </div>
          </div>
      </CartLayout>
    </>
  );
}
