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

export { ITmsAuth, ClientCollateralDetails };
