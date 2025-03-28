import Divider from "@/components/_other/divider/Divider";

const ItemSkeleton = () => {
    return (
        <>
            <div className="col col-span-3 p-2 ps-0 flex gap-4 items-center h-full relative">
                <div className="bg-grey w-[80px] h-[80px] flex-shrink-0"></div>
                <div className="w-full">
                    <div className="bg-grey h-5 w-full"></div>
                    <div className="bg-grey h-4 w-full mt-3"></div>
                </div>
            </div>
            <div className="col text-center p-2">
                <div className="bg-grey h-5 w-full"></div>
            </div>

            <div className="col text-center p-2">
                <div className="bg-grey h-5 w-full"></div>
            </div>
        </>
    )
};

const CartItemsSkeleton = () => {
    return (
        <div className="grid grid-cols-5 items-center text-left animate-pulse">
            <div className="col col-span-3 p-2 ps-0 text-left">
                <div className="bg-grey h-8 w-full"></div>
            </div>
            <div className="col text-center p-2">
                <div className="bg-grey h-8 w-full"></div>
            </div>
            <div className="col text-center p-2">
                <div className="bg-grey h-8 w-full"></div>
            </div>

            <ItemSkeleton />
            <ItemSkeleton />
            <ItemSkeleton />

            <div className="col-span-full">
                <Divider/>
            </div>
        </div>
    )
}

export default CartItemsSkeleton;
