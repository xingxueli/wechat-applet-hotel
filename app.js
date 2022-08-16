import updateManager from './common/updateManager';

App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'prod-3gvqnfsbbbe3e2b9', // 填入云托管环境ID
      })
    }
  },
  onShow: function () {
    updateManager();
  },
});
