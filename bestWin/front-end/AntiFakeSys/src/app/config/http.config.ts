const httpConfig = {
  domainName: 'http://47.105.108.213:3200',
};

export const api = {
  domainName: httpConfig.domainName,
  getCodeInfo: httpConfig.domainName + '/qrcode/info'
}
