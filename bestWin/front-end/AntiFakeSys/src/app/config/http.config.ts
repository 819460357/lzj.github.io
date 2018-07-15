const httpConfig = {
  domainName: 'http://scy.api.bestwin.vip',
};

export const api = {
  domainName: httpConfig.domainName,
  getCodeInfo: httpConfig.domainName + '/qrcode/info'
}
