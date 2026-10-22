import {useRef, useState} from "react";
import find from "lodash/find";
import first from "lodash/first";
import SelectInput from "@/components/_other/form/SelectInput";
import map from "lodash/map";
import toInteger from "lodash/toInteger";
import kebabCase from "lodash/kebabCase";
import Image from "@/grandus-utils/wrappers/image/Image";
import RadioInput from "@/components/_other/form/RadioInput";
import OptionCard from "@/modules/cart/components/ui/OptionCard";


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
    // a group is an array of deliveries; the first one carries the shared photo
    const delivery = first(group);
    // RadioInput renders the input with the id `${id}-${value}` (value '')
    const radioId = `delivery-group-${kebabCase(groupName)}`;

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
        <OptionCard selected={selectedGroup} disabled={disabled} className={className}>
            <label htmlFor={`${radioId}-`} className={'flex cursor-pointer items-start gap-2 p-4 md:gap-3'}>
                <RadioInput
                    inputProps={{
                        id: radioId,
                        name: 'cart-delivery',
                        className: '!mb-0 mt-px shrink-0',
                        onChange: onGroupChange,
                        checked: selectedGroup,
                    }}
                />
                {delivery?.photo ? (
                    <div className="h-[60px] w-[50px] flex-shrink-0 overflow-hidden rounded-[8px]">
                        <Image
                            width={50}
                            height={60}
                            className={'h-full w-full object-contain'}
                            photo={{...delivery?.photo, path: `${delivery?.photo?.path}/${delivery?.photo.id}`}}
                            type={'jpg'}
                            title={delivery?.name}
                            alt={delivery?.name ?? 'product'}
                        />
                    </div>
                ) : (
                    ''
                )}
                <div className={'min-w-0 flex-grow'}>
                    <span className="mb-1 inline-block text-[15px] font-semibold leading-snug text-ink">
                        {groupName}
                    </span>
                    <div className={'text-sm leading-snug text-ink-muted [&_p]:mb-0 [&_p]:text-sm [&_p]:leading-snug'} dangerouslySetInnerHTML={{__html: group?.description}}/>
                </div>
            </label>
            <div className="px-4 pb-4 md:ps-14">
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
                        className: "w-full",
                        groupClassName: "!mb-0",
                        placeholder: groupName,
                    }}
                />
            </div>
        </OptionCard>
    );
};

export default ShippingItemGroup;
