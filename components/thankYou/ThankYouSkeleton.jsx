import Divider from "@/components/_other/divider/Divider";
import Box from "@/components/_other/box/Box";

const ThankYouSkeleton = () => {

    return (
        <div className="my-8 flex flex-col justify-center">
            <div className="w-full bg-white text-center mx-auto mb-16 py-0 animate-pulse max-w-[800px]">
                <div className="h-10 bg-grey mb-8"></div>
                <div className="h-7 bg-grey w-full inline-block w-[200px]"></div>
            </div>

            <div className="mx-auto w-[100%] max-w-[500px]">
                <Box>
                    <div className="flex flex-col justify-center animate-pulse">
                        <div className="grid grid-cols-4 gap-2 pb-3">
                            <div className="col-span-2 h-4 bg-grey mb-2"></div>
                            <div className="col text-center h-4 bg-grey mb-2"></div>
                            <div className="col text-end h-4 bg-grey mb-2"></div>
                        </div>
                        <div className="grid grid-cols-4 gap-2 pb-3">
                            <div className="col-span-2 h-4 bg-grey mb-2"></div>
                            <div className="col text-center h-4 bg-grey mb-2"></div>
                            <div className="col text-end h-4 bg-grey mb-2"></div>
                        </div>
                        <Divider/>
                        <div className="grid grid-cols-4 gap-2 pb-3">
                            <div className="col-span-2 h-4 bg-grey mb-2"></div>
                            <div className="col"></div>
                            <div className="col text-end h-4 bg-grey mb-2"></div>
                        </div>
                        <div className="grid grid-cols-4 gap-2 pb-3">
                            <div className="col-span-2 h-4 bg-grey mb-2"></div>
                            <div className="col"></div>
                            <div className="col text-end h-4 bg-grey mb-2"></div>
                        </div>
                        <Divider/>
                        <div className="grid grid-cols-4 gap-2 pb-3">
                            <div className="col-span-2 h-5 bg-grey mb-2"></div>
                            <div className="col"></div>
                            <div className="col text-end h-5 bg-grey mb-2"></div>
                        </div>
                    </div>
                </Box>

                <div className="w-full bg-white text-center mx-auto mt-8 py-0 animate-pulse w-[200px]">
                    <div className="h-4 bg-grey w-full"></div>
                </div>
            </div>
        </div>
    );
}

export default ThankYouSkeleton;
