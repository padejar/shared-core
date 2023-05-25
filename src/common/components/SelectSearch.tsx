import "./SelectSearch.scss";
import React, { useCallback, useEffect, useState } from "react";
import { CButton } from "@coreui/react";
import Select, { defaultTheme, Styles } from "react-select";
import { ReactSVG } from "react-svg";
import ArrowWhiteRight from "../assets/images/arrow-right-white.svg";
import IconSearch from "../assets/images/icon-search.svg";

const { colors } = defaultTheme;

type SelectOptionProps = Record<string, string | Record<string, string>[]>[];

type SelectSearchProps = {
  className?: string;
  options: SelectOptionProps;
  onChange: (selectedValue: string) => void;
  value: string;
};

type MenuProps = {
  children: JSX.Element;
};

const Menu = (props: MenuProps) => {
  const shadow = "hsla(218, 50%, 10%, 0.1)";
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "white",
        borderRadius: 4,
        boxShadow: `0 0 0 1px ${shadow}, 0 4px 11px ${shadow}`,
        marginTop: 8,
        position: "absolute",
        zIndex: 2,
      }}
      {...props}
    />
  );
};

type BlanketProps = {
  onClick: () => void;
};

const Blanket = (props: BlanketProps) => {
  return (
    <div
      style={{
        bottom: 0,
        left: 0,
        top: 0,
        right: 0,
        position: "fixed",
        zIndex: 1,
      }}
      {...props}
    />
  );
};

type DropwDownProps = {
  children: JSX.Element;
  isOpen: boolean;
  target: JSX.Element;
  onClose: () => void;
};

const Dropdown = ({ children, isOpen, target, onClose }: DropwDownProps) => (
  <div style={{ position: "relative" }}>
    {target}
    {isOpen ? <Menu>{children}</Menu> : null}
    {isOpen ? <Blanket onClick={onClose} /> : null}
  </div>
);
const DropdownIndicator = () => (
  <div style={{ color: colors.neutral20, height: 24, width: 32 }}>
    <ReactSVG src={IconSearch} />
  </div>
);
const ChevronDown = () => (
  <ReactSVG className="chevron" src={ArrowWhiteRight} />
);

const selectStyles: Partial<Styles<
  { [key: string]: string },
  false,
  {
    label: string;
    options: {
      label: string;
      value: string;
    }[];
  }
>> = {
  control: (provided) => ({ ...provided, minWidth: 240, margin: 8 }),
  menu: () => ({ boxShadow: "inset 0 1px 0 rgba(0, 0, 0, 0.1)" }),
};

const SelectSearch: React.FunctionComponent<SelectSearchProps> = ({
  className,
  options,
  value,
  onChange,
}: SelectSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<Record<string, string>>();

  useEffect(() => {
    const selectedGroupIndex = options.findIndex((group) => {
      return (group.options as Record<string, string>[]).find(
        (option) => option.value === value
      );
    });

    if (selectedGroupIndex !== -1) {
      const selected = (options[selectedGroupIndex].options as Record<
        string,
        string
      >[]).find((option) => option.value === value);
      setSelectedValue(selected);
    }
  }, [value, options]);

  const onChangeCallback = useCallback(
    (value: string) => {
      onChange(value);
    },
    [onChange]
  );
  return (
    <Dropdown
      onClose={() => setIsOpen((previousState) => !previousState)}
      target={
        <CButton
          className="quest-search-dropdown"
          color="primary"
          onClick={() => setIsOpen((previousState) => !previousState)}
        >
          {selectedValue ? selectedValue.label : "Select Industry"}{" "}
          <ChevronDown />
        </CButton>
      }
      isOpen={isOpen}
    >
      <Select
        autoFocus
        components={{ DropdownIndicator, IndicatorSeparator: null }}
        styles={selectStyles}
        backspaceRemovesValue={false}
        controlShouldRenderValue={false}
        hideSelectedOptions={false}
        isClearable={false}
        menuIsOpen
        classNamePrefix="quest"
        className={`select-search ${className ?? ""}`}
        options={options}
        value={selectedValue}
        onChange={(selected) => {
          onChangeCallback(selected ? selected.value : "");
          setIsOpen(false);
        }}
        placeholder="Search..."
        tabSelectsValue={false}
      />
    </Dropdown>
  );
};

export default SelectSearch;
