export * from './errorHandling'
export * from './state'

export const connectFILSnap = async (snapId: string) => {
  await window.ethereum.request({
    method: 'wallet_enable',
    params: [
      {
        [`wallet_snap_${snapId}`]: {}
      }
    ]
  })
}
