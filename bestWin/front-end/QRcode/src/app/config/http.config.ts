const httpConfig = {
  domainName: 'http://47.105.108.213:3200',
  frontDominName: "http://scycode.bestwin.vip/#/qrcode"
};

export const api = {
  domainName: httpConfig.domainName,
  frontDominName: httpConfig.frontDominName,
  login: httpConfig.domainName + '/user/login',
  imgUpload: httpConfig.domainName + '/file/uploadImg',
  addMerch: httpConfig.domainName + '/merch/add',
  editMerch: httpConfig.domainName + '/merch/edit',
  getMerchLIst: httpConfig.domainName + '/merch/list',
  getMerchInfo: httpConfig.domainName + '/merch/info',
  addQrCode: httpConfig.domainName + '/qrcode/add',
  validate: httpConfig.domainName + '/user/validate',
  logout: httpConfig.domainName + '/user/logout',
  gethomeInfo: httpConfig.domainName + '/home/info',
}
