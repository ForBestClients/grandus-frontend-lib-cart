"use client"
import Button from '@/components/_other/button/Button';
import { CartStroke } from '@/components/_other/icons/StrokeIcons';
import upperFirst from "lodash/upperFirst";
import {useTranslation} from "@/app/i18n/client";

// rendered inside the kosik layout (<main> + h1 "Košík"), so no own <main>/<h1>
export default function EmptyCart() {
    const { t } = useTranslation();
    return (
        <section className="flex min-h-[420px] flex-col items-center justify-center py-10 text-center">
            <span className="mb-6 grid h-24 w-24 place-items-center rounded-full bg-brand-soft text-brand-deep md:h-28 md:w-28">
                <CartStroke className="h-10 w-10 md:h-12 md:w-12" strokeWidth={1.5} />
            </span>
            <h2 className="mb-6 max-w-md text-xl font-medium leading-snug text-ink md:text-2xl">
                {upperFirst(t('cart.empty'))}
            </h2>
            <Button htmlType={"a"} href={"/"} type="primary">
                <span>{t('error.404.button')}</span>
            </Button>
        </section>
    );
}
