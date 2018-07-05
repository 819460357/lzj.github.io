const httpConfig = {
  domainName: 'http://scycode.api.chinatotomall.com',
};

export const api = {
  domainName: httpConfig.domainName,
  getCodeInfo: httpConfig.domainName + '/qrcode/info'
}
