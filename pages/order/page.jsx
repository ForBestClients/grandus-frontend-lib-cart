import get from "lodash/get";
import {initTranslations} from "@/app/i18n";
import { buildSystemMetadata } from "@/utils/metadata";
import {Suspense} from "react";
import ThankYou from "@/modules/cart/components/thankYou/ThankYou";
import ThankYouSkeleton from "@/modules/cart/components/thankYou/ThankYouSkeleton";


// URL carries the order access token: noindex,nofollow
export async function generateMetadata() {
  const {t} = await initTranslations();

  return buildSystemMetadata({ title: t('seo.thank_you.title'), follow: false });
}

const Page = async ({ searchParams }) => {
  const searchParamsData = await searchParams;

  return (
    <main className="container mx-auto px-4 pb-16 pt-10 md:px-6 md:pb-20 md:pt-16">
      <Suspense fallback={<ThankYouSkeleton />}>
        <ThankYou orderToken={get(searchParamsData, 'orderToken', '')} />
      </Suspense>
    </main>
  );
}

export default Page;
