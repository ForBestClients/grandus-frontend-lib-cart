import get from "lodash/get";
import {initTranslations} from "@/app/i18n";
import SEO from "@/utils/seo";
import {Suspense} from "react";
import ThankYou from "@/modules/cart/components/thankYou/ThankYou";
import ThankYouSkeleton from "@/modules/cart/components/thankYou/ThankYouSkeleton";


export async function generateMetadata({params}) {
  const {t} = await initTranslations(params?.locale);

  return SEO.getDefaultMetaObject(
    t('seo.thank_you.title'),
    '',
  );
}

const Page = ({ searchParams }) => {
  return (
    <main className="bg-white py-16">
      <div className={'container'}>
        <Suspense fallback={<ThankYouSkeleton />}>
          <ThankYou orderToken={ get(searchParams, 'orderToken', '') } />
        </Suspense>
      </div>
    </main>
  );
}

export default Page;
