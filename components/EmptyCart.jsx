"use client"
import { Suspense } from 'react';
import Button from '@/components/_other/button/Button';
import { CartIcon } from '@/components/_other/icons/CartIcon';
import upperFirst from "lodash/upperFirst";
import {useTranslation} from "@/app/i18n/client";

export default function EmptyCart(props) {
    const { t } = useTranslation();
    return (
        <main className="bg-white py-8">
            <div className="container">
                <div className={"flex flex-col items-center justify-center min-h-[500px]"}>
                    <Suspense>
                        <CartIcon className={"h-52 w-auto text-grey mb-16"}/>
                        <h1 className="text-center">{upperFirst(t('cart.empty'))}</h1>
                    </Suspense>
                    <div className="py-8">
                        <Button htmlType={"a"} href={"/"}>
                            <span>{t('error.404.button')}</span>
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
}
