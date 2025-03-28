import {useRef, useState} from "react";
import find from "lodash/find";
import SelectInput from "@/components/_other/form/SelectInput";
import map from "lodash/map";
import toInteger from "lodash/toInteger";
import Image from "@/grandus-utils/wrappers/image/Image";


const ShippingItemGroup = ({
   group,
   selectedGroup,
   selectedDelivery,
   handleChange,
   handleGroupChange,
   groupName,
   className = "",
   disabled = false,
}) => {
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const selectRef = useRef(null);

    const onChange = (e) => {
        const delivery = find(group, { id: toInteger(e.target.value) });
        handleChange(delivery)
        setMenuIsOpen(false);
    };

    const onGroupChange = () => {
        handleGroupChange(groupName);
        selectRef.current?.focus();
    }

    return (
        <div className={'mt-4'}>
            <div>
                <label htmlFor={`delivery-${group.id}`} className={'flex items-start justify-start gap-4'}>
                    <input
                        type={'radio'}
                        id={`delivery-${group.id}`}
                        name={`delivery-${group.id}`}
                        className={'me-2 mt-1.5'}
                        onChange={onGroupChange}
                        checked={selectedGroup}
                    />
                    {group?.photo ? (
                        <div className="w-[50px] h-[60px] flex-shrink-0">
                            <Image
                                width={50}
                                height={60}
                                className={'w-full h-auto'}
                                photo={{...delivery?.photo, path: `${delivery?.photo?.path}/${delivery?.photo.id}`}}
                                type={'jpg'}
                                title={delivery?.name}
                                alt={delivery?.name ?? 'product'}
                            />
                        </div>
                    ) : (
                        ''
                    )}
                    <div className={'flex-grow'}>
                        <h6 className="font-bold text-font inline-block mb-1">
                            {groupName}
                        </h6>
                        <p className={'text-sm text-grey3'} dangerouslySetInnerHTML={{__html: group?.description}}/>
                    </div>
                </label>
                <SelectInput
                    selectRef={selectRef}
                    value={toInteger(selectedDelivery?.id) ?? ''}
                    label={null}
                    inputProps={{
                        id: "deliveryId",
                        name: "deliveryId",
                        prompt: "Vyberte možnosť",
                        value: selectedDelivery?.id,
                        disabled: disabled,
                        onChange: onChange,
                        onFocus: () => {
                            setMenuIsOpen(true)
                        },
                        onBlur: () => {
                            setMenuIsOpen(false)
                        },
                        menuIsOpen: menuIsOpen,
                        options: map(group, (option) => {
                            return {
                                value: option?.id,
                                label: `${option?.groupName} - ${option?.priceData?.priceFormatted}`,
                                ...option,
                            };
                        }),
                        className: "w-100",
                        groupClassName: "mt-2 ps-8",
                        placeholder: groupName,
                    }}
                />
            </div>
        </div>
    //
    // <ShippingItem delivery={{...delivery, name: groupName}} selected={selectedGroup} handleChange={handleGroupChange}>
    //
    // </ShippingItem>
    );
};

export default ShippingItemGroup;
