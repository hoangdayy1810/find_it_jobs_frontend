import React, { useEffect, useState, useCallback, useMemo } from "react";

interface Ward {
  Code: string;
  FullName: string;
  DistrictCode: string;
}

interface District {
  Code: string;
  FullName: string;
  ProvinceCode: string;
  Ward: Ward[];
}

interface Province {
  Code: string;
  FullName: string;
  District: District[];
}

interface InputAddressProps {
  onChange?: (value: string) => void;
  value?: string;
}

const Input_Address: React.FC<InputAddressProps> = ({ onChange, value }) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [isInternalChange, setIsInternalChange] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useMemo(() => {
    fetch("/vietnamese_provinces.json")
      .then((response) => response.json())
      .then((data: Province[]) => {
        setProvinces(data);
      });
  }, []);

  useEffect(() => {
    if (!value || isInitialized || provinces.length === 0) return;

    const addressParts = value.split(", ").filter(Boolean);
    if (addressParts.length < 1) return;

    let provinceValue = null;
    let districtValue = null;
    let wardValue = null;

    if (addressParts.length >= 3) {
      provinceValue = addressParts[2];
      districtValue = addressParts[1];
      wardValue = addressParts[0];
    } else if (addressParts.length === 2) {
      provinceValue = addressParts[1];
      districtValue = addressParts[0];
    } else if (addressParts.length === 1) {
      provinceValue = addressParts[0];
    }

    if (provinceValue) {
      const province = provinces.find((p) => p.FullName === provinceValue);
      if (province) {
        setSelectedProvince(provinceValue);
        setDistricts(province.District);

        if (districtValue) {
          const district = province.District.find(
            (d) => d.FullName === districtValue
          );
          if (district) {
            setSelectedDistrict(districtValue);
            setWards(district.Ward);

            if (wardValue) {
              const ward = district.Ward.find((w) => w.FullName === wardValue);
              if (ward) {
                setSelectedWard(wardValue);
              }
            }
          }
        }
      }
    }

    setIsInitialized(true);
  }, [value, provinces, isInitialized]);

  const updateAddress = useCallback(() => {
    if (!selectedProvince) return;

    let addressParts = [];

    if (selectedWard) addressParts.push(selectedWard);
    if (selectedDistrict) addressParts.push(selectedDistrict);
    if (selectedProvince) addressParts.push(selectedProvince);

    const fullAddress = addressParts.join(", ");

    if (onChange && fullAddress && isInternalChange) {
      setIsInternalChange(false);
      onChange(fullAddress);
    }
  }, [
    selectedProvince,
    selectedDistrict,
    selectedWard,
    onChange,
    isInternalChange,
  ]);

  useEffect(() => {
    updateAddress();
  }, [updateAddress]);

  const handleProvinceChange = (provinceCode: string) => {
    setIsInternalChange(true);
    setSelectedProvince(provinceCode);
    const province = provinces.find((p) => p.FullName === provinceCode);
    setDistricts(province ? province.District : []);
    setSelectedDistrict(null);
    setWards([]);
  };

  const handleDistrictChange = (districtCode: string) => {
    setIsInternalChange(true);
    setSelectedDistrict(districtCode);
    const district = districts.find((d) => d.FullName === districtCode);
    setWards(district ? district.Ward : []);
    setSelectedWard(null);
  };

  const handleWardChange = (wardCode: string) => {
    setIsInternalChange(true);
    setSelectedWard(wardCode);
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-4 text-sm">
      <div className="mt-1 mb-1 text-sm w-full">
        <select
          value={selectedProvince || ""}
          onChange={(e) => handleProvinceChange(e.target.value)}
          className="block px-4 w-full h-10 rounded border shadow-sm"
          required
        >
          <option value="">Chọn Tỉnh/Thành phố</option>
          {provinces.map((province) => (
            <option key={province.Code} value={province.FullName}>
              {province.FullName}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-1 mb-1 text-sm w-full">
        <select
          onChange={(e) => handleDistrictChange(e.target.value)}
          value={selectedDistrict || ""}
          disabled={!selectedProvince}
          className="block px-4 w-full h-10 rounded border shadow-sm"
          required
        >
          <option value="">Chọn Quận/Huyện</option>
          {districts.map((district) => (
            <option key={district.Code} value={district.FullName}>
              {district.FullName}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-1 mb-1 text-sm w-full">
        <select
          onChange={(e) => handleWardChange(e.target.value)}
          value={selectedWard || ""}
          disabled={!selectedDistrict}
          className="block px-4 w-full h-10 rounded border shadow-sm"
          required
        >
          <option value="">Chọn Phường/Xã</option>
          {wards.map((ward) => (
            <option key={ward.Code} value={ward.FullName}>
              {ward.FullName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Input_Address;
