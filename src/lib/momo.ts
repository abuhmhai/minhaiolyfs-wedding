import crypto from 'crypto';

const MOMO_CONFIG = {
  accessKey: 'F8BBA842ECF85',
  secretKey: 'K951B6PE1waDMi640xX08PD3vg6EkVlz',
  partnerCode: 'MOMO',
  redirectUrl: 'http://localhost:3000/payment/success',
  ipnUrl: 'http://localhost:3000/api/payment/momo/webhook',
  requestType: 'payWithMethod',
  lang: 'vi',
  endpoint: 'https://test-payment.momo.vn/v2/gateway/api/create'
};

function generateRequestId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}${random}`;
}

function generateUniqueOrderId(baseOrderId: string) {
  const timestamp = Date.now();
  return `${baseOrderId}_${timestamp}`;
}

export async function createPaymentRequest(orderId: string, amount: number, orderInfo: string) {
  const requestId = generateRequestId();
  const uniqueOrderId = generateUniqueOrderId(orderId);
  
  const rawSignature = `accessKey=${MOMO_CONFIG.accessKey}&amount=${amount}&extraData=&ipnUrl=${MOMO_CONFIG.ipnUrl}&orderId=${uniqueOrderId}&orderInfo=${orderInfo}&partnerCode=${MOMO_CONFIG.partnerCode}&redirectUrl=${MOMO_CONFIG.redirectUrl}&requestId=${requestId}&requestType=${MOMO_CONFIG.requestType}`;

  const signature = crypto
    .createHmac('sha256', MOMO_CONFIG.secretKey)
    .update(rawSignature)
    .digest('hex');

  const requestBody = {
    partnerCode: MOMO_CONFIG.partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId: requestId,
    amount: amount,
    orderId: uniqueOrderId,
    orderInfo: orderInfo,
    redirectUrl: MOMO_CONFIG.redirectUrl,
    ipnUrl: MOMO_CONFIG.ipnUrl,
    lang: MOMO_CONFIG.lang,
    requestType: MOMO_CONFIG.requestType,
    autoCapture: true,
    extraData: '',
    orderGroupId: '',
    signature: signature
  };

  try {
    const response = await fetch(MOMO_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Momo API Error:', errorData);
      throw new Error('Failed to create payment request');
    }

    const data = await response.json();
    console.log('Momo Payment Response:', data);
    return data;
  } catch (error) {
    console.error('Error creating payment request:', error);
    throw error;
  }
} 