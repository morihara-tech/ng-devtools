export interface IpCidrInputModel {
  protocol: IpProtocol;
  ipAddress: string;
  cidr: number;
}

export type IpProtocol = 'ipv4' | 'ipv6';

export interface IpCidrResult {
  cidrNotation: string;
  netmask: string;
  networkAddress: string;
  firstHost: string;
  lastHost: string;
  totalHosts: string;
  ipType: string;
  binaryRepresentation?: string;
  networkBits?: number;
}
