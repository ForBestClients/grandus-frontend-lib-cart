import Box from "@/components/_other/box/Box";

const BAR = 'rounded-[8px] bg-brand-soft';

const ThankYouSkeleton = () => {

    return (
        <div className="mx-auto flex w-full max-w-[720px] animate-pulse flex-col gap-6" aria-hidden="true">
            <div className="flex flex-col items-center">
                <div className="mb-6 h-16 w-16 rounded-full bg-brand-soft"></div>
                <div className={`${BAR} mb-3 h-4 w-40`}></div>
                <div className={`${BAR} h-10 w-full max-w-[460px]`}></div>
                <div className="mb-6 mt-5 h-1 w-16 rounded-full bg-brand-soft"></div>
                <div className="h-8 w-48 rounded-full bg-brand-soft"></div>
            </div>

            <Box>
                <div className={`${BAR} mb-5 h-6 w-56`}></div>
                {[0, 1, 2].map(i => (
                    <div key={i} className="grid grid-cols-4 gap-2 py-2">
                        <div className={`${BAR} col-span-2 h-4`}></div>
                        <div className={`${BAR} h-4`}></div>
                        <div className={`${BAR} h-4`}></div>
                    </div>
                ))}
                <div className="my-5 h-px bg-line"></div>
                <div className="flex justify-between">
                    <div className={`${BAR} h-6 w-24`}></div>
                    <div className={`${BAR} h-6 w-24`}></div>
                </div>
            </Box>

            <div className="mx-auto h-12 w-56 rounded-full bg-brand-soft"></div>
        </div>
    );
}

export default ThankYouSkeleton;
