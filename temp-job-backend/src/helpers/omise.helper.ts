import {
  Barcode,
  ChargeResponse,
  Reference,
  SourceResponse,
} from "omise-nodejs";

export function isSourceResponseError(
  sourceResponse: SourceResponse
): sourceResponse is {
  object: "error";
  location: string;
  code: string;
  message: string;
} {
  return sourceResponse.object === "error";
}

export function validateSourceResponse(sourceResponse: SourceResponse): {
  isError: boolean;
  message: string;
} {
  return {
    isError: isSourceResponseError(sourceResponse),
    message: isSourceResponseError(sourceResponse)
      ? sourceResponse.message
      : "",
  };
}

export function isSourceResponseErrorBadRequest(
  sourceResponse: SourceResponse
) {
  return (
    isSourceResponseError(sourceResponse) &&
    sourceResponse.code === "bad_request"
  );
}

export function isSourceReponseASourceInfo(
  sourceResponse: SourceResponse
): sourceResponse is {
  object: "source";
  id: string;
  livemode: boolean;
  location: string;
  amount: number;
  barcode?: string;
  bank?: string;
  created_at: string;
  currency: string;
  email?: string;
  flow: "redirect" | "offline";
  installment_term?: number;
  name?: string;
  mobile_number?: string;
  phone_number?: string;
  scannable_code?: Barcode;
  references?: Reference;
  store_id?: string;
  store_name?: string;
  terminal_id?: string;
  type:
    | "alipay"
    | "barcode_alipay"
    | "barcode_wechat"
    | "bill_payment_tesco_lotus"
    | "econtext"
    | "mobile_banking_scb"
    | "paynow"
    | "points_citi"
    | "promptpay"
    | "qr_code_upi"
    | "truemoney"
    | "rabbit_linepay"
    | "fpx"
    | "installment_bay"
    | "installment_bbl";
  zero_interest_installments?: boolean;
  charge_status:
    | "failed"
    | "expired"
    | "pending"
    | "reversed"
    | "successful"
    | "unknown";
  receipt_amount?: number;
  discounts?: [];
} {
  return sourceResponse.object === "source";
}

export function isChargeResponseError(
  chargeResponse: ChargeResponse
): chargeResponse is {
  object: "error";
  location: string;
  code: string;
  message: string;
} {
  return chargeResponse.object === "error";
}

export function validateChargeResponse(chargeResponse: ChargeResponse): {
  isError: boolean;
  message: string;
} {
  return {
    isError: isChargeResponseError(chargeResponse),
    message: isChargeResponseError(chargeResponse)
      ? chargeResponse.message
      : "",
  };
}

export function isChargeResponseErrorBadRequest(
  chargeResponse: ChargeResponse
) {
  return (
    isChargeResponseError(chargeResponse) &&
    chargeResponse.code === "bad_request"
  );
}
