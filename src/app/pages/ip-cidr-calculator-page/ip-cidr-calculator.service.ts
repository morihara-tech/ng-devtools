import { Injectable, inject } from '@angular/core';
import { IpCidrResult, IpProtocol } from './ip-cidr-model';
import { Ipv4Calculator } from './calculators/ipv4-calculator';
import { Ipv6Calculator } from './calculators/ipv6-calculator';
import { IpCalculator } from './calculators/ip-calculator.interface';

@Injectable({
  providedIn: 'root'
})
export class IpCidrCalculatorService {
  private readonly ipv4Calculator = inject(Ipv4Calculator);
  private readonly ipv6Calculator = inject(Ipv6Calculator);
  private readonly calculators: Map<IpProtocol, IpCalculator>;

  constructor() {
    this.calculators = new Map<IpProtocol, IpCalculator>([
      ['ipv4', this.ipv4Calculator],
      ['ipv6', this.ipv6Calculator]
    ]);
  }

  calculate(protocol: IpProtocol, ipAddress: string, cidr: number): IpCidrResult | null {
    const calculator = this.calculators.get(protocol);
    if (!calculator) {
      return null;
    }
    return calculator.calculate(ipAddress, cidr);
  }
}
