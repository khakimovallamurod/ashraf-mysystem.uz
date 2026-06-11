import { Typography } from 'antd'
import React from 'react'

function MainLightTitle({children}) {
  return (
    <Typography.Title level={3} style={{fontWeight: 'lighter'}}>{children}</Typography.Title>
  )
}

export default MainLightTitle