const httpConfig = {
  domainName: 'http://scycode.api.chinatotomall.com',
  frontDominName: "http://scycode.chinatotomall.com/#/qrcode"
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
