import { Row } from 'antd'
import React from 'react'

function MainRow({children}) {
  return (
    <Row style={{ width: "100%", height: '100%' }} gutter={[16, 16]}>{children}</Row>
  )
}

export default MainRow