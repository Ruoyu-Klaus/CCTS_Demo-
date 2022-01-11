export function ValidateWith(
  validateConfigs: ValidateConfigs,
  validateConfig: ValidateConfig
) {
  return function (_: any, proName: string) {
    validateConfigs[proName] = {
      ...validateConfigs[proName],
      ...validateConfig,
    }
  }
}
export default ValidateWith
