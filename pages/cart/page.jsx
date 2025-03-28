import CartListingItems from '@/modules/cart/components/CartListingItems';
import Box from '@/components/content/Box';
import DiscountForm from "@/modules/cart/components/DiscountForm";
import Credits from "@/modules/cart/components/credits/Credits";
import {Suspense} from "react";
import {CartSummarySection} from "@/modules/cart/components/CartSummarySection";
import CartLayout from "@/components/cart/cartLayout/CartLayout";
import { initTranslations } from "@/app/i18n";
import SEO from "@/utils/seo";

export async function generateMetadata({params}) {
    const {t} = await initTranslations(params?.locale);

    return SEO.getDefaultMetaObject(
        t('Kontaktné informácie'),
        '',
    );
}

export default async function CartPage(props) {
  return (
      <CartLayout>
          <div className="grid grid-cols-6 gap-6 py-8">
              <div className="col col-span-full">
                  <Suspense>
                      <Box>
                        <CartListingItems/>
                      </Box>
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
  );
}
