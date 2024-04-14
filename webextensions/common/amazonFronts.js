function getamazonFronts() {
  return [
    { name: "🇨🇦 CA", hostname: "www.amazon.ca", warehouseId: "AUJBRIGYRJ3Q8" },
    {
      name: "🇯🇵 CO.JP",
      hostname: "www.amazon.co.jp",
      warehouseId: "ANNLLU4HTZVX9",
    },
    {
      name: "🇬🇧 CO.UK",
      hostname: "www.amazon.co.uk",
      warehouseId: "A2OAJ7377F756P",
    },
    {
      name: "🇺🇸 COM",
      hostname: "www.amazon.com",
      warehouseId: "A2L77EE7U53NWQ",
    },
    {
      name: "🇦🇺 COM.AU",
      hostname: "www.amazon.com.au",
      warehouseId: "A1GE4GWD4XC0D9",
    },
    {
      name: "🇧🇷 COM.BR",
      hostname: "www.amazon.com.br",
      warehouseId: "AVDBXBAVVSXLQ",
    },
    {
      name: "🇲🇽 COM.MX",
      hostname: "www.amazon.com.mx",
      warehouseId: "AVDBXBAVVSXLQ",
    },
    { name: "🇩🇪 DE", hostname: "www.amazon.de", warehouseId: "A8KICS1PHF7ZO" },
    { name: "🇪🇸 ES", hostname: "www.amazon.es", warehouseId: "A6T89FGPU3U0Q" },
    { name: "🇫🇷 FR", hostname: "www.amazon.fr", warehouseId: "" },
    { name: "🇮🇳 IN", hostname: "www.amazon.in", warehouseId: "" },
    { name: "🇮🇹 IT", hostname: "www.amazon.it", warehouseId: "A2DGM6AFA5W80Q" },
    { name: "🇳🇱 NL", hostname: "www.amazon.nl", warehouseId: "A3C1D9TG1HJ66Y" },
    { name: "🇸🇪 SE", hostname: "www.amazon.se", warehouseId: "" },
    { name: "🇸🇬 SG", hostname: "www.amazon.sg", warehouseId: "" },
  ];
}

globalThis.getamazonFronts = getamazonFronts()