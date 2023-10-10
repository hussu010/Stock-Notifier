interface ITmsAuth {
  _rid: string;
  _aid: string;
  xsrfToken: string;
  clientId: string;
  userId: string;
  userName: string;
}

interface ClientCollateralDetails {
  totalCashCollateral: number;
  utilizedCollateral: number;
}

interface DPHolding {
  scrip: string;
  currentBalance: number;
  previousCloseprice: number;
  ltp: number;
  cdsFreeBalance: number;
  cdsTotalBalance: number;
  symbolName: string;
}

interface TmsApiStockSecurity {
  exchangeSecurityId: number;
  symbol: string;
  securityName: string;
}

export { ITmsAuth, ClientCollateralDetails, DPHolding, TmsApiStockSecurity };
