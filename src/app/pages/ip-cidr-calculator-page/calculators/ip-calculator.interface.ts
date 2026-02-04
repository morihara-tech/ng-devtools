import { IpCidrResult } from '../ip-cidr-model';

export interface IpCalculator {
  calculate(ipAddress: string, cidr: number): IpCidrResult | null;
}
