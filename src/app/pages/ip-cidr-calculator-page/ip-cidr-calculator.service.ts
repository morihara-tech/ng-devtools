import { Injectable } from '@angular/core';
import { IpCidrResult, IpProtocol } from './ip-cidr-model';

@Injectable({
  providedIn: 'root'
})
export class IpCidrCalculatorService {

  calculate(protocol: IpProtocol, ipAddress: string, cidr: number): IpCidrResult | null {
    if (protocol === 'ipv4') {
      return this.calculateIpv4(ipAddress, cidr);
    } else {
      return this.calculateIpv6(ipAddress, cidr);
    }
  }

  private calculateIpv4(ipAddress: string, cidr: number): IpCidrResult | null {
    // Parse IP address
    const parts = ipAddress.split('.');
    if (parts.length !== 4) {
      return null;
    }

    const octets = parts.map(p => parseInt(p, 10));
    if (octets.some(o => isNaN(o) || o < 0 || o > 255)) {
      return null;
    }

    // Convert to 32-bit integer
    const ipInt = (octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3];
    
    // Calculate netmask
    const netmaskInt = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
    
    // Calculate network address
    const networkInt = (ipInt & netmaskInt) >>> 0;
    
    // Calculate broadcast address
    const hostmaskInt = ~netmaskInt >>> 0;
    const broadcastInt = (networkInt | hostmaskInt) >>> 0;
    
    // Calculate first and last host
    const firstHostInt = cidr === 31 || cidr === 32 ? networkInt : (networkInt + 1) >>> 0;
    const lastHostInt = cidr === 31 || cidr === 32 ? broadcastInt : (broadcastInt - 1) >>> 0;
    
    // Calculate total hosts
    const totalHosts = cidr === 32 ? 1 : cidr === 31 ? 2 : Math.pow(2, 32 - cidr) - 2;
    
    // Convert integers back to IP addresses
    const networkAddr = this.intToIpv4(networkInt);
    const netmaskAddr = this.intToIpv4(netmaskInt);
    const firstHost = this.intToIpv4(firstHostInt);
    const lastHost = this.intToIpv4(lastHostInt);
    
    // Determine IP type
    const ipType = this.getIpv4Type(octets[0], octets[1]);
    
    // Binary representation
    const binaryRep = this.ipv4ToBinary(ipAddress);

    return {
      cidrNotation: `${ipAddress}/${cidr}`,
      netmask: netmaskAddr,
      networkAddress: networkAddr,
      firstHost,
      lastHost,
      totalHosts: totalHosts.toLocaleString(),
      ipType,
      binaryRepresentation: binaryRep,
      networkBits: cidr
    };
  }

  private calculateIpv6(ipAddress: string, cidr: number): IpCidrResult | null {
    // Expand IPv6 address
    const expanded = this.expandIpv6(ipAddress);
    if (!expanded) {
      return null;
    }

    // Convert to BigInt
    const ipBigInt = this.ipv6ToBigInt(expanded);
    if (ipBigInt === null) {
      return null;
    }

    // Calculate netmask
    const netmaskBigInt = cidr === 0 ? BigInt(0) : (BigInt(2) ** BigInt(128) - BigInt(1)) << BigInt(128 - cidr);
    
    // Calculate network address
    const networkBigInt = ipBigInt & netmaskBigInt;
    
    // Calculate last address in subnet
    const hostmaskBigInt = ~netmaskBigInt & ((BigInt(2) ** BigInt(128)) - BigInt(1));
    const lastAddressBigInt = networkBigInt | hostmaskBigInt;
    
    // First and last host
    const firstHostBigInt = networkBigInt + BigInt(1);
    const lastHostBigInt = lastAddressBigInt - BigInt(1);
    
    // Total hosts
    const totalHosts = BigInt(2) ** BigInt(128 - cidr);
    // For very large numbers, use toString(); for smaller ones, convert to Number and use toLocaleString()
    const totalHostsStr = totalHosts > BigInt(Number.MAX_SAFE_INTEGER) 
      ? totalHosts.toString() 
      : Number(totalHosts).toLocaleString();
    
    // Convert back to IPv6 addresses
    const networkAddr = this.bigIntToIpv6(networkBigInt);
    const netmaskAddr = this.bigIntToIpv6(netmaskBigInt);
    const firstHost = this.bigIntToIpv6(firstHostBigInt);
    const lastHost = this.bigIntToIpv6(lastHostBigInt);
    
    // Determine IP type
    const ipType = this.getIpv6Type(expanded);
    
    // Binary/Hex representation
    const hexRep = expanded;

    return {
      cidrNotation: `${this.compressIpv6(expanded)}/${cidr}`,
      netmask: this.compressIpv6(netmaskAddr),
      networkAddress: this.compressIpv6(networkAddr),
      firstHost: this.compressIpv6(firstHost),
      lastHost: this.compressIpv6(lastHost),
      totalHosts: totalHostsStr,
      ipType,
      binaryRepresentation: hexRep,
      networkBits: cidr
    };
  }

  private intToIpv4(int: number): string {
    return [
      (int >>> 24) & 0xFF,
      (int >>> 16) & 0xFF,
      (int >>> 8) & 0xFF,
      int & 0xFF
    ].join('.');
  }

  private ipv4ToBinary(ip: string): string {
    return ip.split('.')
      .map(octet => parseInt(octet, 10).toString(2).padStart(8, '0'))
      .join('.');
  }

  private getIpv4Type(firstOctet: number, secondOctet: number): string {
    if (firstOctet === 10) {
      return 'Private';
    }
    if (firstOctet === 172 && secondOctet >= 16 && secondOctet <= 31) {
      return 'Private';
    }
    if (firstOctet === 192 && secondOctet === 168) {
      return 'Private';
    }
    if (firstOctet === 127) {
      return 'Loopback';
    }
    if (firstOctet >= 224 && firstOctet <= 239) {
      return 'Multicast';
    }
    if (firstOctet === 169 && secondOctet === 254) {
      return 'Link-Local';
    }
    return 'Public';
  }

  private expandIpv6(ip: string): string | null {
    if (!ip || ip === '::') {
      return '0000:0000:0000:0000:0000:0000:0000:0000';
    }

    let expanded = ip.toLowerCase();
    
    // Handle :: notation
    if (expanded.includes('::')) {
      const parts = expanded.split('::');
      if (parts.length > 2) {
        return null;
      }
      
      const left = parts[0] ? parts[0].split(':') : [];
      const right = parts[1] ? parts[1].split(':') : [];
      const missing = 8 - left.length - right.length;
      
      if (missing < 0) {
        return null;
      }
      
      const middle = Array(missing).fill('0000');
      expanded = [...left, ...middle, ...right].join(':');
    }
    
    // Expand each segment to 4 digits
    const segments = expanded.split(':');
    if (segments.length !== 8) {
      return null;
    }
    
    return segments.map(seg => seg.padStart(4, '0')).join(':');
  }

  private compressIpv6(ip: string): string {
    const segments = ip.split(':');
    
    // Remove leading zeros
    const compressed = segments.map(seg => seg.replace(/^0+/, '') || '0');
    
    // Find longest sequence of zeros
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
    
    // Replace longest zero sequence with ::
    if (maxZeroLen > 1) {
      const before = compressed.slice(0, maxZeroStart).join(':');
      const after = compressed.slice(maxZeroStart + maxZeroLen).join(':');
      return `${before}::${after}`.replace(/^:|:$/g, x => x + ':');
    }
    
    return compressed.join(':');
  }

  private ipv6ToBigInt(ip: string): bigint | null {
    const segments = ip.split(':');
    if (segments.length !== 8) {
      return null;
    }
    
    let result = BigInt(0);
    for (const seg of segments) {
      const value = parseInt(seg, 16);
      if (isNaN(value)) {
        return null;
      }
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

  private getIpv6Type(ip: string): string {
    const firstSegment = ip.split(':')[0];
    
    if (ip === '0000:0000:0000:0000:0000:0000:0000:0001') {
      return 'Loopback';
    }
    if (firstSegment.startsWith('fe80')) {
      return 'Link-Local';
    }
    if (firstSegment.startsWith('fc') || firstSegment.startsWith('fd')) {
      return 'Unique Local';
    }
    if (firstSegment.startsWith('ff')) {
      return 'Multicast';
    }
    if (firstSegment.startsWith('2') || firstSegment.startsWith('3')) {
      return 'Global Unicast';
    }
    
    return 'Reserved';
  }
}
