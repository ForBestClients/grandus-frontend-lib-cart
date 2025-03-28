"use client"
import { Suspense } from 'react';
import CartIcon from '@/components/_other/icons/CartIcon';
import {useTranslation} from "@/app/i18n/client";
import upperFirst from "lodash/upperFirst";

export default function LoadingCart(props) {
    const {t} = useTranslation();
    return (
        <main className="bg-white rounded-lg py-8">
            <div className="container">
                <div className={"flex flex-col text-center items-center justify-center min-h-[500px]"}>
                    <Suspense>
                        <CartIcon className={"h-52 w-auto text-grey mb-16"}/>
                        <h1 className="text-lg">{upperFirst(t('cart.loading'))}</h1>
                    </Suspense>
                </div>
            </div>
        </main>
    );
}
