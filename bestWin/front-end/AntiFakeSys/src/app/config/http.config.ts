const httpConfig = {
  domainName: 'http://scycode.api.chinalansu.com',
};

export const api = {
  domainName: httpConfig.domainName,
  getCodeInfo: httpConfig.domainName + '/qrcode/info'
}
