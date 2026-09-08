import { WathbaOtpClient } from './otp.js';
import { WathbaEjarClient } from './ejar.js';
import { WathbaPaymentsClient } from './payments.js';
import { RawWathbaClient, type RawWathbaClientOptions } from './raw-client.js';
import { WathbaShippingClient } from './shipping.js';

export class WathbaClient {
  readonly raw: RawWathbaClient;
  readonly otp: WathbaOtpClient;
  readonly payments: WathbaPaymentsClient;
  readonly shipping: WathbaShippingClient;
  readonly ejar: WathbaEjarClient;

  constructor(options: RawWathbaClientOptions) {
    this.raw = new RawWathbaClient(options);
    this.otp = new WathbaOtpClient(this.raw);
    this.payments = new WathbaPaymentsClient(this.raw);
    this.shipping = new WathbaShippingClient(this.raw);
    this.ejar = new WathbaEjarClient(this.raw);
  }
}
