import { Injectable } from '@angular/core';
import { IpCidrResult } from '../ip-cidr-model';
import { IpCalculator } from './ip-calculator.interface';

@Injectable({
  providedIn: 'root'
})
export class Ipv6Calculator implements IpCalculator {

  calculate(ipAddress: string, cidr: number): IpCidrResult | null {
    const expanded = this.expandAddress(ipAddress);
    if (!expanded) {
      return null;
    }

    const ipBigInt = this.toBigInt(expanded);
    if (ipBigInt === null) {
      return null;
    }

    const netmaskBigInt = this.calculateNetmask(cidr);
    const networkBigInt = ipBigInt & netmaskBigInt;
    const lastAddressBigInt = this.calculateLastAddress(networkBigInt, netmaskBigInt);
    
    const { firstHostBigInt, lastHostBigInt } = this.calculateHostRange(networkBigInt, lastAddressBigInt);
    const totalHostsStr = this.formatTotalHosts(cidr);

    return {
      cidrNotation: `${this.compressAddress(expanded)}/${cidr}`,
      netmask: this.compressAddress(this.bigIntToIpv6(netmaskBigInt)),
      networkAddress: this.compressAddress(this.bigIntToIpv6(networkBigInt)),
      firstHost: this.compressAddress(this.bigIntToIpv6(firstHostBigInt)),
      lastHost: this.compressAddress(this.bigIntToIpv6(lastHostBigInt)),
      totalHosts: totalHostsStr,
      ipType: this.getIpType(expanded),
      binaryRepresentation: expanded,
      networkBits: cidr
    };
  }

  private expandAddress(ip: string): string | null {
    if (!ip || ip === '::') {
      return '0000:0000:0000:0000:0000:0000:0000:0000';
    }

    let expanded = ip.toLowerCase();
    
    if (expanded.includes('::')) {
      const parts = expanded.split('::');
      if (parts.length > 2) return null;
      
      const left = parts[0] ? parts[0].split(':') : [];
      const right = parts[1] ? parts[1].split(':') : [];
      const missing = 8 - left.length - right.length;
      
      if (missing < 0) return null;
      
      const middle = Array(missing).fill('0000');
      expanded = [...left, ...middle, ...right].join(':');
    }
    
    const segments = expanded.split(':');
    if (segments.length !== 8) return null;
    
    return segments.map(seg => seg.padStart(4, '0')).join(':');
  }

  private compressAddress(ip: string): string {
    const segments = ip.split(':');
    const compressed = segments.map(seg => seg.replace(/^0+/, '') || '0');
    
    let maxZeroStart = -1;
    let maxZeroLen = 0;
    let currentZeroStart = -1;
    let currentZeroLen = 0;
    
    for (let i = 0; i < compressed.length; i++) {
      if (compressed[i] === '0') {
        if (currentZeroStart === -1) {
          currentZeroStart = i;
          currentZeroLen = 1;
        } else {
          currentZeroLen++;
        }
      } else {
        if (currentZeroLen > maxZeroLen) {
          maxZeroStart = currentZeroStart;
          maxZeroLen = currentZeroLen;
        }
        currentZeroStart = -1;
        currentZeroLen = 0;
      }
    }
    
    if (currentZeroLen > maxZeroLen) {
      maxZeroStart = currentZeroStart;
      maxZeroLen = currentZeroLen;
    }
    
    if (maxZeroLen > 1) {
      const before = compressed.slice(0, maxZeroStart).join(':');
      const after = compressed.slice(maxZeroStart + maxZeroLen).join(':');
      return `${before}::${after}`.replace(/^:|:$/g, x => x + ':');
    }
    
    return compressed.join(':');
  }

  private toBigInt(ip: string): bigint | null {
    const segments = ip.split(':');
    if (segments.length !== 8) return null;
    
    let result = BigInt(0);
    for (const seg of segments) {
      const value = parseInt(seg, 16);
      if (isNaN(value)) return null;
      result = (result << BigInt(16)) | BigInt(value);
    }
    
    return result;
  }

  private bigIntToIpv6(bigInt: bigint): string {
    const segments: string[] = [];
    let value = bigInt;
    
    for (let i = 0; i < 8; i++) {
      segments.unshift((value & BigInt(0xFFFF)).toString(16).padStart(4, '0'));
      value = value >> BigInt(16);
    }
    
    return segments.join(':');
  }

  private calculateNetmask(cidr: number): bigint {
    return cidr === 0 ? BigInt(0) : (BigInt(2) ** BigInt(128) - BigInt(1)) << BigInt(128 - cidr);
  }

  private calculateLastAddress(networkBigInt: bigint, netmaskBigInt: bigint): bigint {
    const hostmaskBigInt = ~netmaskBigInt & ((BigInt(2) ** BigInt(128)) - BigInt(1));
    return networkBigInt | hostmaskBigInt;
  }

  private calculateHostRange(networkBigInt: bigint, lastAddressBigInt: bigint): { firstHostBigInt: bigint; lastHostBigInt: bigint } {
    return {
      firstHostBigInt: networkBigInt + BigInt(1),
      lastHostBigInt: lastAddressBigInt - BigInt(1)
    };
  }

  private formatTotalHosts(cidr: number): string {
    const totalHosts = BigInt(2) ** BigInt(128 - cidr);
    return totalHosts > BigInt(Number.MAX_SAFE_INTEGER) 
      ? totalHosts.toString() 
      : Number(totalHosts).toLocaleString();
  }

  private getIpType(ip: string): string {
    const firstSegment = ip.split(':')[0];
    
    if (ip === '0000:0000:0000:0000:0000:0000:0000:0001') return 'Loopback';
    if (firstSegment.startsWith('fe80')) return 'Link-Local';
    if (firstSegment.startsWith('fc') || firstSegment.startsWith('fd')) return 'Unique Local';
    if (firstSegment.startsWith('ff')) return 'Multicast';
    if (firstSegment.startsWith('2') || firstSegment.startsWith('3')) return 'Global Unicast';
    
    return 'Reserved';
  }
}
