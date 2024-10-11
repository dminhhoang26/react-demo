const {withXcodeProject} = require('@expo/config-plugins')

module.exports = function withIosConfig(config) {
  return withXcodeProject(config, _config => {
    const xcodeProject = _config.modResults
    const productName = xcodeProject.productName
    const devTeam = process.env.EXPO_APPLE_TEAM_ID

    console.log('ios-config-plugin: Setting DEVELOPMENT_TEAM...')
    const configurations = xcodeProject.pbxXCBuildConfigurationSection()
    for (const key in configurations) {
      if (
        typeof configurations[key].buildSettings !== 'undefined' &&
        configurations[key].buildSettings.PRODUCT_NAME === `"${productName}"`
      ) {
        const buildSettingsObj = configurations[key].buildSettings
        if (devTeam != null && devTeam !== '') {
          buildSettingsObj.DEVELOPMENT_TEAM = process.env.EXPO_APPLE_TEAM_ID
        }
      }
    }

    // fix issue that OneSignalNotificationServiceExtension appeared in Pods group
    const groups = xcodeProject.hash.project.objects.PBXGroup
    for (let key in groups) {
      const group = groups[key]
      if (group.path === 'Pods') {
        const groupChildren = group.children
        for (let i in groupChildren) {
          const item = groupChildren[i]
          if (item.comment === 'OneSignalNotificationServiceExtension') {
            console.log(
              'Found duplicate of OneSignalNotificationServiceExtension in project.pbxproj',
            )
            groupChildren.splice(i, 1)
            break
          }
        }
      }
    }

    return _config
  })
}
