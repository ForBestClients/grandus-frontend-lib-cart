"use client"
import { CartStroke } from '@/components/_other/icons/StrokeIcons';
import {useTranslation} from "@/app/i18n/client";
import upperFirst from "lodash/upperFirst";

export default function LoadingCart() {
    const {t} = useTranslation();
    return (
        <section
            className="flex min-h-[420px] flex-col items-center justify-center py-10 text-center"
            aria-busy="true"
        >
            <span className="mb-6 grid h-24 w-24 animate-pulse place-items-center rounded-full bg-brand-soft text-brand-deep md:h-28 md:w-28">
                <CartStroke className="h-10 w-10 md:h-12 md:w-12" strokeWidth={1.5} />
            </span>
            <p className="mb-0 text-base text-ink-muted" role="status">{upperFirst(t('cart.loading'))}</p>
        </section>
    );
}
