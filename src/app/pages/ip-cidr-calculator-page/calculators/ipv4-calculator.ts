import { Injectable } from '@angular/core';
import { IpCidrResult } from '../ip-cidr-model';
import { IpCalculator } from './ip-calculator.interface';

@Injectable({
  providedIn: 'root'
})
export class Ipv4Calculator implements IpCalculator {

  calculate(ipAddress: string, cidr: number): IpCidrResult | null {
    const octets = this.parseIpAddress(ipAddress);
    if (!octets) {
      return null;
    }

    const ipInt = this.octetsToInt(octets);
    const netmaskInt = this.calculateNetmask(cidr);
    const networkInt = (ipInt & netmaskInt) >>> 0;
    const broadcastInt = this.calculateBroadcast(networkInt, netmaskInt);
    
    const { firstHostInt, lastHostInt } = this.calculateHostRange(networkInt, broadcastInt, cidr);
    const totalHosts = this.calculateTotalHosts(cidr);

    return {
      cidrNotation: `${ipAddress}/${cidr}`,
      netmask: this.intToIpv4(netmaskInt),
      networkAddress: this.intToIpv4(networkInt),
      firstHost: this.intToIpv4(firstHostInt),
      lastHost: this.intToIpv4(lastHostInt),
      totalHosts: totalHosts.toLocaleString(),
      ipType: this.getIpType(octets[0], octets[1]),
      binaryRepresentation: this.toBinary(ipAddress),
      networkBits: cidr
    };
  }

  private parseIpAddress(ip: string): number[] | null {
    const parts = ip.split('.');
    if (parts.length !== 4) {
      return null;
    }

    const octets = parts.map(p => parseInt(p, 10));
    if (octets.some(o => isNaN(o) || o < 0 || o > 255)) {
      return null;
    }

    return octets;
  }

  private octetsToInt(octets: number[]): number {
    return (octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3];
  }

  private calculateNetmask(cidr: number): number {
    return cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
  }

  private calculateBroadcast(networkInt: number, netmaskInt: number): number {
    const hostmaskInt = ~netmaskInt >>> 0;
    return (networkInt | hostmaskInt) >>> 0;
  }

  private calculateHostRange(networkInt: number, broadcastInt: number, cidr: number): { firstHostInt: number; lastHostInt: number } {
    const firstHostInt = cidr === 31 || cidr === 32 ? networkInt : (networkInt + 1) >>> 0;
    const lastHostInt = cidr === 31 || cidr === 32 ? broadcastInt : (broadcastInt - 1) >>> 0;
    return { firstHostInt, lastHostInt };
  }

  private calculateTotalHosts(cidr: number): number {
    if (cidr === 32) return 1;
    if (cidr === 31) return 2;
    return Math.pow(2, 32 - cidr) - 2;
  }

  private intToIpv4(int: number): string {
    return [
      (int >>> 24) & 0xFF,
      (int >>> 16) & 0xFF,
      (int >>> 8) & 0xFF,
      int & 0xFF
    ].join('.');
  }

  private toBinary(ip: string): string {
    return ip.split('.')
      .map(octet => parseInt(octet, 10).toString(2).padStart(8, '0'))
      .join('.');
  }

  private getIpType(firstOctet: number, secondOctet: number): string {
    if (firstOctet === 10) return 'Private';
    if (firstOctet === 172 && secondOctet >= 16 && secondOctet <= 31) return 'Private';
    if (firstOctet === 192 && secondOctet === 168) return 'Private';
    if (firstOctet === 127) return 'Loopback';
    if (firstOctet >= 224 && firstOctet <= 239) return 'Multicast';
    if (firstOctet === 169 && secondOctet === 254) return 'Link-Local';
    return 'Public';
  }
}
